import type { MetadataRoute } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";

function formatDate(date: any): string {
  if (!date) return "2026-11-04";
  try {
    if (typeof date.toDate === "function") {
      return date.toDate().toISOString().split("T")[0];
    }
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    if (typeof date === "number") {
      return new Date(date).toISOString().split("T")[0];
    }
    if (typeof date === "string") {
      return date.split("T")[0];
    }
  } catch {
    // fallback
  }
  return "2026-11-04";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.ayudarte.app";
  const defaultDate = "2026-11-04";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/suenos`,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ayuda-eventual`,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/regalar`,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ofrecer-donacion`,
      lastModified: defaultDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contar-mi-sueno`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donadores`,
      lastModified: defaultDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/libro`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legales`,
      lastModified: defaultDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const dreamsSnap = await getDocs(query(collection(serverDb, "dreams"), limit(100)));
    const dreamRoutes: MetadataRoute.Sitemap = dreamsSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        url: `${baseUrl}/historia/${docSnap.id}`,
        lastModified: formatDate(data.updatedAt || data.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    const eventualSnap = await getDocs(query(collection(serverDb, "eventualHelps"), limit(100)));
    const eventualRoutes: MetadataRoute.Sitemap = eventualSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        url: `${baseUrl}/historia/${docSnap.id}`,
        lastModified: formatDate(data.updatedAt || data.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...dreamRoutes, ...eventualRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap from Firestore:", error);
    return staticRoutes;
  }
}
