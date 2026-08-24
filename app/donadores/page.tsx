"use client";

import { Heart, Building2, Medal, User } from "lucide-react";
import Link from "next/link";

const donantes = [
  { id: 1, nombre: "Farmacia San José", tipo: "empresa", monto: "$50.000", tiempo: "Hace 2 días" },
  { id: 2, nombre: "Carlos M.", tipo: "persona", monto: "$2.000", tiempo: "Hace 1 hora" },
  { id: 3, nombre: "Laura G.", tipo: "persona", monto: "$5.000", tiempo: "Hace 3 horas" },
  { id: 4, nombre: "Supermercados El Sol", tipo: "empresa", monto: "$100.000", tiempo: "Hace 1 semana" },
];

export default function DonadoresPage() {
  return (
    <div className="pb-28 min-h-screen bg-surface-2">
      {/* HEADER */}
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line text-center">
        <div className="w-16 h-16 bg-warmth/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-8 h-8 text-warmth fill-warmth/20" />
        </div>
        <h1 className="font-display text-2xl font-bold text-cream">Nuestros Superhéroes</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-[250px] mx-auto">
          Gracias a los aportes en la calle y transferencias, seguimos cumpliendo sueños.
        </p>

        {/* TARJETAS INFORMATIVAS: DONAR Y REGALAR */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {/* Tarjeta de Donación Monetaria */}
          <div className="bg-surface-2 rounded-2xl border border-line p-3 shadow-sm flex flex-col relative overflow-hidden">
            <h2 className="font-bold text-cream text-sm leading-tight">Aporte<br/>Económico</h2>
            <p className="text-[10px] text-muted mt-1 leading-snug mb-3 flex-1">
              Financiá sueños y sorteos. Toda ayuda suma.
            </p>
            <Link href="/donar" className="w-full bg-star text-white font-bold text-xs py-2 rounded-lg shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1">
              DONAR
            </Link>
          </div>

          {/* Tarjeta de Regalar Objetos */}
          <div className="bg-surface-2 rounded-2xl border border-line p-3 shadow-sm flex flex-col relative overflow-hidden">
            <h2 className="font-bold text-cream text-sm leading-tight">Regalar<br/>un Objeto</h2>
            <p className="text-[10px] text-muted mt-1 leading-snug mb-3 flex-1">
              ¿Tenés algo en buen estado? Donalo a un soñador.
            </p>
            <Link href="/regalar" className="w-full border-2 border-star text-star bg-star/10 font-bold text-xs py-1.5 rounded-lg active:scale-95 transition-colors flex items-center justify-center gap-1">
              REGALAR
            </Link>
          </div>
        </div>
      </div>

      {/* RANKING / FEED DE DONACIONES */}
      <div className="px-6 pt-6 space-y-3">
        {donantes.map((d, index) => (
          <div key={d.id} className="bg-surface border border-line rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${d.tipo === 'empresa' ? 'bg-star/20 text-star' : 'bg-line text-muted'}`}>
              {d.tipo === 'empresa' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-cream">{d.nombre}</h3>
                <span className="font-display font-bold text-warmth">{d.monto}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                <Medal className="w-3 h-3" />
                {d.tipo === 'empresa' ? 'Empresa Padrino' : 'Socio de Calle'} • {d.tiempo}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
