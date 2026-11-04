import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sueños de la Comunidad",
  description: "Conocé y colaborá con los sueños y proyectos personales de los miembros de nuestra comunidad. Cada historia cuenta.",
  alternates: {
    canonical: "/suenos",
  },
  openGraph: {
    title: "Sueños de la Comunidad | Ayudarte",
    description: "Conocé y colaborá con los sueños y proyectos personales de los miembros de nuestra comunidad. Cada historia cuenta.",
    url: "https://www.ayudarte.app/suenos",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Sueños de la Comunidad en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sueños de la Comunidad | Ayudarte",
    description: "Conocé y colaborá con los sueños y proyectos personales de los miembros de nuestra comunidad.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function SuenosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
