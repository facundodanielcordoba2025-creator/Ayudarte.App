import { NextResponse } from "next/server";
import webpush from "web-push";
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from "@/lib/push-config";
import { serverDb } from "@/lib/firebase-server";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function POST(req: Request) {
  try {
    const { title, body, url, targetUserId, subscription } = await req.json();

    const payload = JSON.stringify({
      title: title || "Ayudarte.App",
      body: body || "Tenés una nueva actualización en Ayudarte.App",
      url: url || "/"
    });

    // Caso 1: Enviar a una suscripción específica pasada en el body (ej. prueba)
    if (subscription && subscription.endpoint && subscription.keys) {
      try {
        await webpush.sendNotification(subscription, payload);
        return NextResponse.json({ success: true, sentCount: 1, failedCount: 0 });
      } catch (err: any) {
        return NextResponse.json(
          { error: err?.message || "Error al enviar a la suscripción especificada" },
          { status: 500 }
        );
      }
    }

    // Caso 2: Obtener suscripciones desde Firestore
    const subsCollection = collection(serverDb, "push_subscriptions");
    let q = query(subsCollection);

    if (targetUserId) {
      q = query(subsCollection, where("userId", "==", targetUserId));
    }

    const snapshot = await getDocs(q);
    const subscriptions = snapshot.docs.map((d) => ({
      docId: d.id,
      ...d.data()
    })) as Array<{ docId: string; endpoint: string; keys: { p256dh: string; auth: string } }>;

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No hay dispositivos registrados para recibir notificaciones todavía.",
        sentCount: 0,
        failedCount: 0
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys
            },
            payload
          );
          sentCount++;
        } catch (err: any) {
          failedCount++;
          // Si el endpoint devolvió 410 (Gone) o 404 (Not Found), la suscripción expiró: limpiarla
          if (err.statusCode === 410 || err.statusCode === 404) {
            try {
              await deleteDoc(doc(serverDb, "push_subscriptions", sub.docId));
            } catch (cleanupErr) {
              console.warn("No se pudo limpiar la suscripción caducada:", cleanupErr);
            }
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      total: subscriptions.length
    });
  } catch (error: any) {
    console.error("Error en API de notificaciones push:", error);
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
