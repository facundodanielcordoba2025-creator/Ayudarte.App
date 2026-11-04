import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercado Solidario - Donar y Regalar | Ayudarte",
  description: "Regalá lo que ya no usás a personas de la comunidad que lo necesitan. Sin intermediarios, 100% gratuito y solidario.",
  openGraph: {
    title: "Mercado Solidario - Donar y Regalar | Ayudarte",
    description: "Regalá lo que ya no usás a personas de la comunidad que lo necesitan. Sin intermediarios, 100% gratuito y solidario.",
    url: "https://www.ayudarte.app/regalar",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Mercado Solidario en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercado Solidario - Donar y Regalar | Ayudarte",
    description: "Regalá lo que ya no usás a personas de la comunidad que lo necesitan.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function RegalarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
