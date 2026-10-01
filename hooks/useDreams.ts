import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Dream {
  id: string;
  title: string;
  history: string;
  isForMe: boolean;
  media: string[];
  createdAt: number;
  userId?: string;
  userName?: string;
  userProvincia?: string;
}

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'dreams'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dreamData: Dream[] = [];
      snapshot.forEach((doc) => {
        dreamData.push({ id: doc.id, ...doc.data() } as Dream);
      });
      setDreams(dreamData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { dreams, loading };
}
