import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia y Filosofía",
  description: "Conocé el origen, los valores y el propósito que impulsan la red comunitaria de Ayudarte.",
  alternates: {
    canonical: "/libro",
  },
  openGraph: {
    title: "Nuestra Historia y Filosofía | Ayudarte",
    description: "Conocé el origen, los valores y el propósito que impulsan la red comunitaria de Ayudarte.",
    url: "https://www.ayudarte.app/libro",
    siteName: "Ayudarte",
    type: "website",
    images: [
      {
        url: "/playstore-feature-graphic-1024x500.png",
        width: 1024,
        height: 500,
        alt: "Nuestra Historia en Ayudarte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuestra Historia y Filosofía | Ayudarte",
    description: "Conocé el origen y los valores de la red comunitaria de Ayudarte.",
    images: ["/playstore-feature-graphic-1024x500.png"],
  },
};

export default function LibroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
