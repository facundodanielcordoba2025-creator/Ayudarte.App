import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contanos tu Sueño",
  description: "Compartí tu historia o proyecto con la comunidad de Ayudarte. Juntos podemos transformar tu sueño en realidad.",
  alternates: {
    canonical: "/contar-mi-sueno",
  },
  openGraph: {
    title: "Contanos tu Sueño | Ayudarte",
    description: "Compartí tu historia o proyecto con la comunidad de Ayudarte. Juntos podemos transformar tu sueño en realidad.",
    url: "https://www.ayudarte.app/contar-mi-sueno",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Contanos tu Sueño en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contanos tu Sueño | Ayudarte",
    description: "Compartí tu historia o proyecto con la comunidad de Ayudarte.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function ContarMiSuenoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
