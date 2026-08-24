import type { MetadataRoute } from "next";

// Necesario para que la ruta funcione con output: "export" (build de Capacitor).
export const dynamic = "force-static";

// Next.js genera /manifest.webmanifest automáticamente a partir de esto.
// Esto es lo que permite "Instalar FACUTEAYUDA como PWA" desde el navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FACUTEAYUDA",
    short_name: "Facu Ayuda",
    description: "Contanos tu sueño. Quizás podamos hacerlo realidad.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F1115",
    theme_color: "#0F1115",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["social", "lifestyle"],
    lang: "es-AR",
  };
}
