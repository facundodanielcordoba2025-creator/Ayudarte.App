import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";
import HomeClientView from "@/components/HomeClientView";
import type { Dream } from "@/hooks/useDreams";
import type { EventualHelp } from "@/hooks/useEventualHelps";

export const dynamic = "force-dynamic";

async function getInitialData(): Promise<{
  dreams: Dream[];
  eventualHelps: EventualHelp[];
}> {
  try {
    const dreamsSnap = await getDocs(
      query(collection(serverDb, "dreams"), orderBy("createdAt", "desc"), limit(20))
    );
    const dreams: Dream[] = dreamsSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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

    const helpsSnap = await getDocs(
      query(collection(serverDb, "eventualHelps"), orderBy("createdAt", "desc"), limit(20))
    );
    const eventualHelps: EventualHelp[] = helpsSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        category: data.category || "otro",
        title: data.title || "",
        description: data.description || "",
        amountNeeded: data.amountNeeded ?? null,
        isForMe: data.isForMe ?? true,
        media: data.media || [],
        status: data.status || "pendiente",
        createdAt: data.createdAt || Date.now(),
        userId: data.userId || "",
        userName: data.userName,
        userProvincia: data.userProvincia,
        urgencyStars: data.urgencyStars,
        urgencyLabel: data.urgencyLabel,
        urgencyNotes: data.urgencyNotes,
        urgencyEvaluatorName: data.urgencyEvaluatorName,
        urgencyEvaluatedAt: data.urgencyEvaluatedAt,
      } as EventualHelp;
    });

    return { dreams, eventualHelps };
  } catch (error) {
    console.error("Error fetching initial data for HomePage SSR:", error);
    return { dreams: [], eventualHelps: [] };
  }
}

export default async function HomePage() {
  const { dreams, eventualHelps } = await getInitialData();
  return (
    <HomeClientView 
      initialDreams={dreams} 
      initialEventualHelps={eventualHelps} 
    />
  );
}
