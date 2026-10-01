with open('lib/firebase.ts', 'r') as f:
    c = f.read()

c = c.replace('import { getFirestore, type Firestore } from "firebase/firestore";', 'import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";')

c = c.replace('export const db: Firestore = getFirestore(app);', 'export const db: Firestore = initializeFirestore(app, { experimentalForceLongPolling: true });')

with open('lib/firebase.ts', 'w') as f:
    f.write(c)
