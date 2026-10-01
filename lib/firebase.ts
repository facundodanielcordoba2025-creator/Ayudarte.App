"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjSuw2v3Epiabvpb6ipju0nhpXHZgfCH8",
  authDomain: "ayudarteapp-4ae2e.firebaseapp.com",
  projectId: "ayudarteapp-4ae2e",
  storageBucket: "ayudarteapp-4ae2e.firebasestorage.app",
  messagingSenderId: "490050021417",
  appId: "1:490050021417:web:802a4fb815d07276c59438"
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const app = getFirebaseApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = initializeFirestore(app, { experimentalForceLongPolling: true });
export const storage: FirebaseStorage = getStorage(app);
