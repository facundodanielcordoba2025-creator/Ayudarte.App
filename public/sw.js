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

// Notificaciones push (Firebase Cloud Messaging) llegan acá cuando
// la app no está en primer plano.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const title = data.notification?.title || "FACUTEAYUDA";
  const options = {
    body: data.notification?.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: data.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
