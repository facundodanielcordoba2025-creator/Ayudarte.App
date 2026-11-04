"use client";
import { toast } from "react-hot-toast";

import { MapPin, Image as ImageIcon, Video as VideoIcon, Share2 } from "lucide-react";
import Link from "next/link";
import { useDreams, type Dream } from "@/hooks/useDreams";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { IntentionModal } from "@/components/IntentionModal";
import { ShareModal, type ShareableItem } from "@/components/ShareModal";

interface Props {
  initialDreams?: Dream[];
}

export default function SuenosClientView({ initialDreams }: Props) {
  const { dreams, loading } = useDreams(initialDreams);
  const [intentionItem, setIntentionItem] = useState<{id: string, title: string} | null>(null);
  const [sharingItem, setSharingItem] = useState<ShareableItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-xs text-star uppercase tracking-wider">{s.userName || "Miembro de la comunidad"}</span>
                  {s.userProvincia && (
                    <span className="flex items-center gap-1 text-[11px] text-muted font-medium">
                      <MapPin className="w-3 h-3 text-muted" />
                      {s.userProvincia}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-cream text-lg">{s.title}</h3>
                <div className="flex items-center gap-1 text-xs font-medium text-muted mt-1">
                  <span>{s.isForMe ? "Causa personal" : "Para alguien más"}</span>
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
                onClick={() => setSharingItem({ id: s.id, title: s.title, userName: s.userName, history: s.history, userProvincia: s.userProvincia, kind: "dream" })}
                className="flex-1 bg-surface-2 hover:bg-line text-xs font-bold text-cream py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
              <button 
                onClick={() => {
                const userId = localStorage.getItem("ayudarte_user_id");
                if (!userId) {
                  toast("Para ayudar, primero debes registrarte.");
                  setIsAuthOpen(true);
                } else {
                  setIntentionItem({ id: s.id, title: s.title });
                }
              }}
                className="flex-1 bg-star/10 hover:bg-star/20 text-xs font-bold text-star py-2.5 rounded-lg transition-colors"
              >
                Ayudar
              </button>
            </div>
          </article>
        ))}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="ayudar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />
      <ShareModal isOpen={!!sharingItem} onClose={() => setSharingItem(null)} item={sharingItem} />
    </div>
  );
}
