"use client";

import { useState, useEffect, useCallback } from "react";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  query,
  where
} from "firebase/firestore";
import toast from "react-hot-toast";

export interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  loading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendTestPush: () => Promise<void>;
}

export function usePushNotifications(): PushNotificationState {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Comprobar soporte inicial y estado de suscripción
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          setIsSubscribed(!!sub);
        })
        .catch((err) => {
          console.warn("Error comprobando suscripción push previa:", err);
        });
    }
  }, []);

  const getDocIdForEndpoint = (endpoint: string): string => {
    // Generar un ID de documento seguro para Firestore
    return encodeURIComponent(endpoint).slice(-100).replace(/\./g, "_");
  };

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error("Las notificaciones no están soportadas en este navegador.");
      return false;
    }

    try {
      setLoading(true);

      // 1. Pedir permiso al usuario
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        toast.error("Permiso de notificaciones rechazado o bloqueado.");
        setLoading(false);
        return false;
      }

      // 2. Obtener Service Worker activo
      const reg = await navigator.serviceWorker.ready;

      // 3. Suscribir a PushManager con la clave VAPID pública
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource
        });
      }

      // 4. Guardar en Firestore para poder enviar desde el admin / backend
      const currentUser = auth.currentUser;
      const subJson = sub.toJSON();

      if (!subJson.endpoint || !subJson.keys) {
        throw new Error("No se pudo obtener las claves de la suscripción.");
      }

      const docId = getDocIdForEndpoint(subJson.endpoint);
      const subRef = doc(db, "push_subscriptions", docId);

      await setDoc(
        subRef,
        {
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userId: currentUser?.uid || null,
          userEmail: currentUser?.email || null,
          userName: currentUser?.displayName || null,
          userAgent: navigator.userAgent,
          platform: /android/i.test(navigator.userAgent) ? "android" : "web",
          active: true,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        },
        { merge: true }
      );

      setIsSubscribed(true);
      toast.success("¡Notificaciones activadas con éxito! 🔔");
      return true;
    } catch (err: any) {
      console.error("Error al suscribir notificaciones:", err);
      toast.error(err?.message || "Error al activar notificaciones.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();

        // Borrar o marcar inactivo en Firestore
        const docId = getDocIdForEndpoint(endpoint);
        const subRef = doc(db, "push_subscriptions", docId);
        await deleteDoc(subRef);
      }

      setIsSubscribed(false);
      toast.success("Notificaciones desactivadas.");
      return true;
    } catch (err) {
      console.error("Error al cancelar suscripción:", err);
      toast.error("No se pudo desactivar las notificaciones.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTestPush = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "¡Prueba de Ayudarte.App! 🚀",
          body: "Las notificaciones push están funcionando perfectamente en tu dispositivo.",
          url: "/"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fallo al enviar notificación");

      toast.success("¡Notificación de prueba enviada!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error enviando notificación de prueba.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
    sendTestPush
  };
}
