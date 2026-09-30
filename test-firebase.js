const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAjSuw2v3Epiabvpb6ipju0nhpXHZgfCH8",
  authDomain: "ayudarteapp-4ae2e.firebaseapp.com",
  projectId: "ayudarteapp-4ae2e",
  storageBucket: "ayudarteapp-4ae2e.firebasestorage.app",
  messagingSenderId: "490050021417",
  appId: "1:490050021417:web:802a4fb815d07276c59438"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log("Adding doc...");
    const docRef = await addDoc(collection(db, "dreams"), {
      title: "Test Dream",
      history: "Testing from backend",
      isForMe: true,
      media: [],
      createdAt: Date.now()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
test();
