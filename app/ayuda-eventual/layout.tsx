import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayudas del Día a Día",
  description: "Pedidos de ayuda comunitaria inmediata para necesidades cotidianas: salud, alimentos, trámites y acompañamiento solidario.",
  alternates: {
    canonical: "/ayuda-eventual",
  },
  openGraph: {
    title: "Ayudas del Día a Día | Ayudarte",
    description: "Pedidos de ayuda comunitaria inmediata para necesidades cotidianas: salud, alimentos, trámites y acompañamiento solidario.",
    url: "https://www.ayudarte.app/ayuda-eventual",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Ayudas del Día a Día en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayudas del Día a Día | Ayudarte",
    description: "Pedidos de ayuda comunitaria inmediata para necesidades cotidianas.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function AyudaEventualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
