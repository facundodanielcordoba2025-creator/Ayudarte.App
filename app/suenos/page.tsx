"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

const suenos = [
  {
    id: 1,
    nombre: "Roberto",
    apellido: "Gómez",
    localidad: "Rosario",
    provincia: "Santa Fe",
    historia: "Necesito comprar herramientas de carpintería para volver a armar mi taller que perdí en la última tormenta. Con eso podría volver a trabajar y mantener a mi familia.",
    fecha: "Hace 2 horas"
  },
  {
    id: 2,
    nombre: "Silvia",
    apellido: "Pérez",
    localidad: "San Justo",
    provincia: "Buenos Aires",
    historia: "Estamos armando una biblioteca popular en el barrio y nos faltan estanterías y libros infantiles para que los chicos puedan venir a leer después del colegio.",
    fecha: "Hace 5 horas"
  }
];

export default function SuenosPage() {
  return (
    <div className="pb-28 min-h-screen bg-surface-2">
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-10">
        <h1 className="font-display text-2xl font-bold text-cream">Comunidad</h1>
        <p className="text-sm text-muted mt-1">Conocé los sueños que van llegando</p>
        
        <Link 
          href="/contar-mi-sueno"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-star px-4 py-3.5 text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          CONTAR MI SUEÑO
        </Link>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {suenos.map((s) => (
          <article key={s.id} className="bg-surface border border-line rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-cream text-lg">{s.nombre} {s.apellido}</h3>
                <div className="flex items-center gap-1 text-xs font-medium text-muted mt-1">
                  <MapPin className="w-3 h-3 text-warmth" />
                  {s.localidad}, {s.provincia}
                </div>
              </div>
              <span className="text-[10px] text-muted bg-surface-2 px-2 py-1 rounded-md font-medium">
                {s.fecha}
              </span>
            </div>
            
            <p className="text-sm text-cream leading-relaxed mt-2">
              "{s.historia}"
            </p>
            
            <div className="mt-4 pt-4 border-t border-line flex gap-3">
              <button className="flex-1 bg-surface-2 hover:bg-line text-xs font-bold text-cream py-2.5 rounded-lg transition-colors">
                Compartir
              </button>
              <button className="flex-1 bg-star/10 hover:bg-star/20 text-xs font-bold text-star py-2.5 rounded-lg transition-colors">
                Ayudar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
