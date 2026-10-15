// Configuración centralizada de Notificaciones Push para Ayudarte.App

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BE67prA3Q8NsBp-kuUqUGbrsmteX3FK2KDHLrCelwpAptZ_wHnk0C_xHRhUZ2vuP6u7578npKhvzH_Cu1V_CvcQ";

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "wArs_tZZpG7DC_LaefUo3q2NCizJSObltD6L7lene8A";

export const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:soporte@ayudarte.app";

/**
 * Convierte una clave pública VAPID en base64url a un Uint8Array requerido por PushManager.subscribe()
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
