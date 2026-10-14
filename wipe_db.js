import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

// Leer las variables de entorno si están en .env.local
const envFile = fs.readFileSync(".env.local", "utf-8");
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) env[key] = val.join('=').trim().replace(/"/g, '');
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipe() {
  const collections = ["dreams", "eventualHelps", "connections"];
  for (const c of collections) {
    const snap = await getDocs(collection(db, c));
    let count = 0;
    for (const d of snap.docs) {
      await deleteDoc(doc(db, c, d.id));
      count++;
    }
    console.log(`Borrados ${count} documentos de ${c}`);
  }
  process.exit(0);
}

wipe();
