import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAjSuw2v3Epiabvpb6ipju0nhpXHZgfCH8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ayudarteapp-4ae2e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ayudarteapp-4ae2e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ayudarteapp-4ae2e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "490050021417",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:490050021417:web:802a4fb815d07276c59438"
};

function getServerFirebaseApp(): FirebaseApp {
  const existing = getApps().find((a) => a.name === "serverApp");
  if (existing) return existing;
  return initializeApp(firebaseConfig, "serverApp");
}

export const serverApp = getServerFirebaseApp();
export const serverDb: Firestore = getFirestore(serverApp);
