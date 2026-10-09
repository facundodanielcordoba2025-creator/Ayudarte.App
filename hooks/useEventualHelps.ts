import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// "Ayudas eventuales": necesidades básicas y frecuentes (luz, alquiler, comida,
// medicamentos). A diferencia de los sueños, se cubren con el fondo solidario,
// por eso pasan por revisión del admin antes de mostrarse públicamente.
export type EventualCategory = 'servicios' | 'alquiler' | 'alimentos' | 'medicamentos' | 'otro';
export type EventualStatus = 'pendiente' | 'aprobada' | 'cubierta' | 'rechazada';

export const EVENTUAL_CATEGORIES: { id: EventualCategory; label: string; emoji: string }[] = [
  { id: 'servicios', label: 'Luz / Gas / Agua', emoji: '💡' },
  { id: 'alquiler', label: 'Alquiler', emoji: '🏠' },
  { id: 'alimentos', label: 'Alimentos', emoji: '🍽️' },
  { id: 'medicamentos', label: 'Medicamentos', emoji: '💊' },
  { id: 'otro', label: 'Otra necesidad', emoji: '🤝' },
];

export const EVENTUAL_STATUS_LABEL: Record<EventualStatus, string> = {
  pendiente: 'En revisión',
  aprobada: 'Publicada',
  cubierta: 'Cubierta',
  rechazada: 'No aprobada',
};

export function categoryInfo(id: string) {
  return EVENTUAL_CATEGORIES.find(c => c.id === id) ?? EVENTUAL_CATEGORIES[4];
}

export interface EventualHelp {
  id: string;
  category: EventualCategory;
  title: string;
  description: string;
  amountNeeded: number | null;
  isForMe: boolean;
  media: string[];
  status: EventualStatus;
  createdAt: number;
  userId: string;
  userName?: string;
  userProvincia?: string;
}

/** Devuelve todas las ayudas eventuales (el filtrado por estado se hace en cliente
 *  para no requerir índices compuestos en Firestore). */
export function useEventualHelps() {
  const [helps, setHelps] = useState<EventualHelp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'eventualHelps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHelps(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EventualHelp)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { helps, loading };
}
