import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYUDARTE.APP — Contanos tu sueño",
  description: "Contanos tu sueño. Quizás podamos hacerlo realidad.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Facu Ayuda",
  },
};

export const viewport: Viewport = {
  themeColor: "#12162b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${fredoka.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black flex justify-center overscroll-none md:py-4">
        <div className="w-full max-w-md bg-night min-h-screen relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[2.5rem] md:border-4 md:border-surface overflow-x-hidden">
        <ServiceWorkerRegister />
        <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</main>
        <BottomNav />
      </div>
      </body>
    </html>
  );
}
