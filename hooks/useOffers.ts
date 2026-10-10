import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CompanyOffer {
  id: string;
  title: string;
  description: string;
  media: string[];
  status: "activa" | "entregada";
  createdAt: number;
  userId: string;
  companyName: string;
  companyLogo: string | null;
  userProvincia: string;
}

export function useOffers() {
  const [offers, setOffers] = useState<CompanyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'companyOffers'), 
      where('status', '==', 'activa')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: CompanyOffer[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as CompanyOffer);
      });
      // Sort client side to avoid Firebase index requirement
      data.sort((a, b) => b.createdAt - a.createdAt);
      setOffers(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { offers, loading };
}
