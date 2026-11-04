import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallBanner from "@/components/InstallBanner";
import { Toaster } from "react-hot-toast";

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
  metadataBase: new URL("https://www.ayudarte.app"),
  title: {
    default: "Ayudarte | Red Solidaria y Cumplimiento de Sueños en Comunidad",
    template: "%s | Ayudarte",
  },
  description: "Conectamos a personas que necesitan ayuda con personas y empresas dispuestas a colaborar. Cumplí sueños, doná lo que no usás y sumate al impacto solidario en Ayudarte.",
  keywords: [
    "ayuda solidaria",
    "cumplir sueños",
    "donaciones",
    "voluntariado",
    "comunidad solidaria",
    "empresas con propósito",
    "mercado solidario",
    "ayudarte",
    "ayuda comunitaria",
    "responsabilidad social empresarial",
    "argentina solidaria",
  ],
  authors: [{ name: "Ayudarte", url: "https://www.ayudarte.app" }],
  creator: "Ayudarte",
  publisher: "Ayudarte",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.ayudarte.app",
    siteName: "Ayudarte",
    title: "Ayudarte | Red Solidaria y Cumplimiento de Sueños en Comunidad",
    description: "Conectamos a personas que necesitan ayuda con personas y empresas dispuestas a colaborar. Cumplí sueños, doná lo que no usás y sumate al impacto solidario en Ayudarte.",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Ayudarte - Red Solidaria y Cumplimiento de Sueños en Comunidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayudarte | Red Solidaria y Cumplimiento de Sueños en Comunidad",
    description: "Conectamos a personas que necesitan ayuda con personas y empresas dispuestas a colaborar. Cumplí sueños, doná lo que no usás y sumate al impacto solidario en Ayudarte.",
    images: ["/playstore-feature-graphic-1024x500.png"],
    creator: "@ayudarteapp",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ayudarte.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#12162b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.ayudarte.app/#organization",
      name: "Ayudarte",
      alternateName: ["Ayudarte App", "Plataforma Solidaria Ayudarte"],
      url: "https://www.ayudarte.app",
      logo: "https://www.ayudarte.app/icon.png",
      description: "Plataforma comunitaria que conecta a personas y empresas solidarias para cumplir sueños, brindar ayuda cotidiana y donar recursos en comunidad.",
      sameAs: [
        "https://www.instagram.com/ayudarte.app",
        "https://www.facebook.com/ayudarteapp",
        "https://www.tiktok.com/@ayudarte.app",
        "https://x.com/ayudarteapp",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@ayudarte.app",
        availableLanguage: ["Spanish"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.ayudarte.app/#website",
      url: "https://www.ayudarte.app",
      name: "Ayudarte",
      alternateName: ["Ayudarte App", "Plataforma Solidaria Ayudarte"],
      description: "Conectamos a personas que necesitan ayuda con personas y empresas dispuestas a colaborar. Cumplí sueños, doná lo que no usás y sumate al impacto solidario en Ayudarte.",
      publisher: {
        "@id": "https://www.ayudarte.app/#organization",
      },
      inLanguage: "es-AR",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${fredoka.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-night overscroll-none">
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#26166b',
              color: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #4229a8',
            },
          }} 
        />
        <ServiceWorkerRegister />
        <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</main>
        <BottomNav />
        <InstallBanner />
      </body>
    </html>
  );
}
