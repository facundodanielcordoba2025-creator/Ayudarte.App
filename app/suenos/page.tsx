import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import SuenosClientView from "./SuenosClientView";
import type { Dream } from "@/hooks/useDreams";

export const dynamic = "force-dynamic";

async function getInitialDreams(): Promise<Dream[]> {
  try {
    const q = query(collection(serverDb, "dreams"), orderBy("createdAt", "desc"), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        history: data.history || "",
        isForMe: data.isForMe ?? true,
        media: data.media || [],
        createdAt: data.createdAt || Date.now(),
        userId: data.userId,
        userName: data.userName,
        userProvincia: data.userProvincia,
        urgencyStars: data.urgencyStars,
      } as Dream;
    });
  } catch (err) {
    console.error("Error fetching initial dreams for SSR:", err);
    return [];
  }
}

export default async function SuenosPage() {
  const initialDreams = await getInitialDreams();
  return <SuenosClientView initialDreams={initialDreams} />;
}
