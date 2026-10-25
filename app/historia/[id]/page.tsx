import type { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  HeartHandshake, MapPin, CheckCircle2, CircleUserRound, 
  ArrowLeft, Share2, Sparkles, Copy, ShieldCheck 
} from "lucide-react";
import HistoriaClientView from "./HistoriaClientView";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchStory(id: string) {
  try {
    // 1. Buscar en "dreams"
    const dreamSnap = await getDoc(doc(serverDb, "dreams", id));
    if (dreamSnap.exists()) {
      return { id: dreamSnap.id, kind: "dream" as const, ...dreamSnap.data() };
    }

    // 2. Buscar en "eventualHelps"
    const helpSnap = await getDoc(doc(serverDb, "eventualHelps", id));
    if (helpSnap.exists()) {
      return { id: helpSnap.id, kind: "eventual" as const, ...helpSnap.data() };
    }

    return null;
  } catch (err) {
    console.error("Error fetching story for SSR:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story: any = await fetchStory(id);

  if (!story) {
    return {
      title: "Historia no encontrada — Ayudarte.App",
      description: "Conectamos personas con un sueño pendiente con una comunidad dispuesta a ayudar.",
    };
  }

  const title = story.title || "Historia de la comunidad";
  const author = story.userName ? story.userName.trim() : "Un miembro de la comunidad";
  const description = (story.history || story.description || "Ayudanos a cumplir este sueño en Ayudarte.App").slice(0, 160);
  
  // Buscar primera imagen disponible (que no sea video crudo si hay foto)
  const mediaList: string[] = story.media || [];
  const imageCandidate = mediaList.find((url: string) => !url.includes(".mp4") && !url.includes("video/")) || mediaList[0] || "https://res.cloudinary.com/dffhpwfiz/image/upload/v1790805445/ChatGPT_Image_30_sept_2026_06_57_03_p.m._cfv8xi.png";

  const storyUrl = `https://www.ayudarte.app/historia/${id}`;

  return {
    title: `${title} — ${author} | Ayudarte.App`,
    description,
    openGraph: {
      title: `${title} — ${author}`,
      description,
      url: storyUrl,
      siteName: "Ayudarte.App",
      images: [
        {
          url: imageCandidate,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      locale: "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${author}`,
      description,
      images: [imageCandidate],
    },
  };
}

export default async function HistoriaPage({ params }: Props) {
  const { id } = await params;
  const story: any = await fetchStory(id);

  if (!story) {
    return notFound();
  }

  return <HistoriaClientView story={story} />;
}
