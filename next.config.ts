import type { NextConfig } from "next";

// FACUTEAYUDA se despliega en dos modos desde el MISMO código:
//
// 1) WEB (por defecto, `npm run build`): Next.js server normal, con SSR y
//    rutas dinámicas (/sueno/[id]), deployado en Vercel / Firebase Hosting.
//    Esta es la versión que sirve https://facuteayuda.com y también la PWA.
//
// 2) ANDROID (`npm run build:capacitor`): genera un export estático en /out
//    que Capacitor empaqueta dentro del APK/AAB. La app Android usa este
//    shell estático + Firebase client SDK directo (auth, Firestore, storage),
//    por lo que no depende de API routes de Next para funcionar.
//
// Ambos modos comparten componentes, lógica y el mismo backend de Firebase.
const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  ...(isCapacitorBuild
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
