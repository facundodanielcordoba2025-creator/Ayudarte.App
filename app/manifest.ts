import type { MetadataRoute } from "next";

// Necesario para que la ruta funcione con output: "export" (build de Capacitor).
export const dynamic = "force-static";

// Next.js genera /manifest.webmanifest automáticamente a partir de esto.
// Esto es lo que permite "Instalar AYUDARTE.APP como PWA" desde el navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AYUDARTE.APP",
    short_name: "Ayudarte.App",
    description: "Contanos tu sueño. Quizás podamos hacerlo realidad.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#1a0e4f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["social", "lifestyle"],
    lang: "es-AR",
  };
}
