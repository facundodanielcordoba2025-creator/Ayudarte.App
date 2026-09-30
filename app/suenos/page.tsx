"use client";

import { MapPin, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import Link from "next/link";
import { useDreams } from "@/hooks/useDreams";
import { useState } from "react";

export default function SuenosPage() {
  const { dreams, loading } = useDreams();
  const [modalAyudar, setModalAyudar] = useState<string | null>(null);

  const handleShare = async (title: string, history: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Mira este sueño en Ayudarte.App: "${history}"`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error al compartir", err);
      }
    } else {
      alert("La función de compartir no está disponible en este navegador.");
    }
  };

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
        {loading && <p className="text-cream text-center">Cargando sueños...</p>}
        
        {!loading && dreams.length === 0 && (
          <div className="text-center bg-surface border border-line rounded-2xl p-8">
            <p className="text-muted text-sm">Todavía no hay sueños publicados.</p>
            <p className="text-star font-bold text-sm mt-2">¡Sé el primero en contar el tuyo!</p>
          </div>
        )}

        {dreams.map((s) => (
          <article key={s.id} className="bg-surface border border-line rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-cream text-lg">{s.title}</h3>
                <div className="flex items-center gap-1 text-xs font-medium text-muted mt-1">
                  <MapPin className="w-3 h-3 text-warmth" />
                  {s.isForMe ? "Para sí mismo" : "Para alguien más"}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-cream leading-relaxed mt-2 whitespace-pre-wrap">
              "{s.history}"
            </p>

            {s.media && s.media.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {s.media.map((url, idx) => (
                  <div key={idx} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-line">
                    {url.includes("video") ? (
                       <div className="w-full h-full bg-surface-2 flex items-center justify-center relative">
                         <video src={url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                         <VideoIcon className="w-6 h-6 text-cream relative z-10" />
                       </div>
                    ) : (
                      <img src={url} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-line flex gap-3">
              <button 
                onClick={() => handleShare(s.title, s.history)}
                className="flex-1 bg-surface-2 hover:bg-line text-xs font-bold text-cream py-2.5 rounded-lg transition-colors"
              >
                Compartir
              </button>
              <button 
                onClick={() => setModalAyudar(s.title)}
                className="flex-1 bg-star/10 hover:bg-star/20 text-xs font-bold text-star py-2.5 rounded-lg transition-colors"
              >
                Ayudar
              </button>
            </div>
          </article>
        ))}
      </div>

      {modalAyudar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-line rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="font-bold text-cream text-lg mb-2">¡Gracias por ayudar!</h3>
            <p className="text-sm text-muted mb-6">
              Le avisaremos a la persona que publicaste "{modalAyudar}" que estás dispuesto a hacer su sueño realidad.
            </p>
            <button 
              onClick={() => setModalAyudar(null)}
              className="w-full bg-star text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
