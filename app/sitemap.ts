import type { MetadataRoute } from "next";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { serverDb } from "@/lib/firebase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.ayudarte.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/suenos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ayuda-eventual`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/regalar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ofrecer-donacion`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contar-mi-sueno`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donadores`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/libro`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legales`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const dreamsSnap = await getDocs(query(collection(serverDb, "dreams"), limit(100)));
    const dreamRoutes: MetadataRoute.Sitemap = dreamsSnap.docs.map((docSnap) => ({
      url: `${baseUrl}/historia/${docSnap.id}`,
      lastModified: docSnap.data().updatedAt?.toDate?.() || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const eventualSnap = await getDocs(query(collection(serverDb, "eventualHelps"), limit(100)));
    const eventualRoutes: MetadataRoute.Sitemap = eventualSnap.docs.map((docSnap) => ({
      url: `${baseUrl}/historia/${docSnap.id}`,
      lastModified: docSnap.data().updatedAt?.toDate?.() || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dreamRoutes, ...eventualRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap from Firestore:", error);
    return staticRoutes;
  }
}
