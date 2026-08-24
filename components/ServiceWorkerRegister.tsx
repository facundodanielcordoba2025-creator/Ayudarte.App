"use client";

import { useEffect } from "react";

// Registra el service worker (app shell offline + push notifications).
// No renderiza nada: es un efecto de arranque de la app.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("No se pudo registrar el service worker:", err);
      });
    }
  }, []);

  return null;
}
