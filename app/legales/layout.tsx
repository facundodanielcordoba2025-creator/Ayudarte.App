import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos, Condiciones y Privacidad",
  description: "Términos de uso, políticas de privacidad, seguridad y transparencia de la plataforma comunitaria Ayudarte.",
  alternates: {
    canonical: "/legales",
  },
  openGraph: {
    title: "Términos, Condiciones y Privacidad | Ayudarte",
    description: "Términos de uso, políticas de privacidad, seguridad y transparencia de la plataforma comunitaria Ayudarte.",
    url: "https://www.ayudarte.app/legales",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Términos y Condiciones de Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Términos, Condiciones y Privacidad | Ayudarte",
    description: "Términos de uso y políticas de privacidad de Ayudarte.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function LegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
