import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empresas Solidarias y Responsabilidad Social | Ayudarte",
  description: "Conectá tu empresa o comercio con causas sociales y sueños comunitarios. Donaciones de excedentes de stock, equipamiento e insumos con impacto directo.",
  openGraph: {
    title: "Empresas Solidarias y Responsabilidad Social | Ayudarte",
    description: "Conectá tu empresa o comercio con causas sociales y sueños comunitarios. Donaciones de excedentes de stock, equipamiento e insumos con impacto directo.",
    url: "https://www.ayudarte.app/ofrecer-donacion",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Empresas Solidarias en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empresas Solidarias y Responsabilidad Social | Ayudarte",
    description: "Conectá tu empresa o comercio con causas sociales y sueños comunitarios.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function OfrecerDonacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
