import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Gift {
  id: string;
  title: string;
  description: string;
  state: string;
  images: string[];
  createdAt: number;
}

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const giftData: Gift[] = [];
      snapshot.forEach((doc) => {
        giftData.push({ id: doc.id, ...doc.data() } as Gift);
      });
      setGifts(giftData);
    });
    return unsubscribe;
  }, []);

  const addGift = async (gift: Omit<Gift, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'gifts'), {
        ...gift,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  return { gifts, addGift };
}
