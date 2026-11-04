import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Superhéroes y Colaboradores Solidarios | Ayudarte",
  description: "Reconocimiento a las personas, comercios y empresas solidarias que ayudan a cumplir sueños y transformar realidades.",
  openGraph: {
    title: "Superhéroes y Colaboradores Solidarios | Ayudarte",
    description: "Reconocimiento a las personas, comercios y empresas solidarias que ayudan a cumplir sueños y transformar realidades.",
    url: "https://www.ayudarte.app/donadores",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Superhéroes Solidarios en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superhéroes y Colaboradores Solidarios | Ayudarte",
    description: "Reconocimiento a las personas y empresas que ayudan a cumplir sueños.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function DonadoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
