// Service worker mínimo para FACUTEAYUDA.
// Cachea el "app shell" para que la navegación entre pestañas funcione
// offline / con conexión lenta, y deja pasar el resto de las requests
// (datos de Firestore, imágenes de Storage, llamadas a Firebase Auth)
// directo a la red, porque esos datos deben ser siempre frescos.

const CACHE_NAME = "facuteayuda-shell-v1";
const APP_SHELL = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo interceptamos navegaciones de documento (cambios de página).
  // Todo lo demás (Firestore, Storage, APIs) va directo a la red.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((cached) => cached || caches.match("/offline"))
    )
  );
});

// Notificaciones push (Web Push / FCM) llegan acá cuando la app está en segundo plano o cerrada
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || data.notification?.title || "Ayudarte.App";
    const body = data.body || data.notification?.body || "Tenés una novedad en Ayudarte.App";
    const url = data.url || data.data?.url || data.notification?.data?.url || "/";
    const options = {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [200, 100, 200],
      data: { url },
      actions: [
        { action: "open", title: "Ver ahora" }
      ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error al procesar notificación push:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Si ya hay una ventana abierta con la app, enfocarla y navegar
      for (const client of windowClients) {
        if ("focus" in client) {
          if (client.url === url) return client.focus();
          return client.navigate(url).then((c) => c.focus());
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
