import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Lightbulb, Home, Utensils, Pill, HandHeart } from 'lucide-react';

// "Ayudas eventuales": necesidades básicas y frecuentes (luz, alquiler, comida,
// medicamentos). A diferencia de los sueños, se cubren con el fondo solidario,
// por eso pasan por revisión del admin antes de mostrarse públicamente.
export type EventualCategory = 'servicios' | 'alquiler' | 'alimentos' | 'medicamentos' | 'otro';
export type EventualStatus = 'pendiente' | 'aprobada' | 'cubierta' | 'rechazada';

export const EVENTUAL_CATEGORIES: { id: EventualCategory; label: string; icon: any }[] = [
  { id: 'servicios', label: 'Luz / Gas / Agua', icon: Lightbulb },
  { id: 'alquiler', label: 'Alquiler', icon: Home },
  { id: 'alimentos', label: 'Alimentos', icon: Utensils },
  { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
  { id: 'otro', label: 'Otra necesidad', icon: HandHeart },
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

export interface UrgencyLevel {
  stars: number;
  label: string;
  shortLabel: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const URGENCY_LEVELS: UrgencyLevel[] = [
  {
    stars: 1,
    label: "Leve / Mediano plazo",
    shortLabel: "Leve",
    badgeBg: "bg-blue-500/15",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    description: "Necesidad no inmediata o proyecto de mediano plazo.",
  },
  {
    stars: 2,
    label: "Moderada",
    shortLabel: "Moderada",
    badgeBg: "bg-teal-500/15",
    textColor: "text-teal-400",
    borderColor: "border-teal-500/30",
    description: "Situación atendible pero con margen de tiempo.",
  },
  {
    stars: 3,
    label: "Importante",
    shortLabel: "Importante",
    badgeBg: "bg-yellow-500/15",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    description: "Afecta el día a día, requiere pronta resolución.",
  },
  {
    stars: 4,
    label: "Muy urgente",
    shortLabel: "Muy urgente",
    badgeBg: "bg-orange-500/15",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    description: "Riesgo inminente de corte, falta de alimentos o techo.",
  },
  {
    stars: 5,
    label: "Crítica / Emergencia inmediata",
    shortLabel: "Crítica",
    badgeBg: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/40",
    description: "Salud en riesgo, desalojo inminente o situación extrema.",
  },
];

export function getUrgencyInfo(stars?: number): UrgencyLevel | null {
  if (!stars || stars < 1 || stars > 5) return null;
  return URGENCY_LEVELS.find(l => l.stars === stars) || null;
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
  // Auditoría de Urgencia por el Equipo Ayudarte (Triage de Captadores)
  urgencyStars?: number; // 1 a 5 estrellas
  urgencyLabel?: string;
  urgencyNotes?: string; // Observaciones del captador/evaluador
  urgencyEvaluatorName?: string;
  urgencyEvaluatedAt?: number;
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
