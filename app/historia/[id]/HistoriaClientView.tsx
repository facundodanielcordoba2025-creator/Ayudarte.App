"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, HeartHandshake, MapPin, CheckCircle2, CircleUserRound, 
  Share2, Copy, Check, ChevronLeft, ChevronRight, ShieldCheck 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthModal } from "@/components/AuthModal";
import { IntentionModal } from "@/components/IntentionModal";
import { ShareModal } from "@/components/ShareModal";
import { SocialButtonsRow } from "@/components/SocialButtonsRow";

interface HistoriaClientViewProps {
  story: any;
}

export default function HistoriaClientView({ story }: HistoriaClientViewProps) {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isIntentionOpen, setIsIntentionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const mediaList: string[] = story.media && story.media.length > 0 ? story.media : [];
  const currentMediaUrl = mediaList[activeMediaIdx] || "";
  const isVideo = 
    currentMediaUrl.includes(".mp4") || 
    currentMediaUrl.includes("video") || 
    currentMediaUrl.includes(".webm") || 
    currentMediaUrl.includes(".mov");

  const author = story.userName ? story.userName.trim() : "Usuario de la Comunidad";
  const location = story.userProvincia || "Argentina";
  const storyText = story.history || story.description || "";
  const aliasDisplay = story.alias || story.cbu || "";

  const handleCopyAlias = () => {
    if (!aliasDisplay) return;
    navigator.clipboard.writeText(aliasDisplay);
    setCopied(true);
    toast.success("¡Alias/CBU copiado al portapapeles!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleHelpClick = () => {
    const uid = localStorage.getItem("ayudarte_user_id");
    if (!uid) {
      setIsAuthOpen(true);
      return;
    }
    if (uid === story.userId) {
      toast("No puedes ayudarte a ti mismo.");
      return;
    }
    setIsIntentionOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface-2 pb-24 animate-in fade-in duration-300">
      
      {/* Barra Superior */}
      <div className="px-4 py-3.5 bg-surface/80 backdrop-blur-md border-b border-line sticky top-0 z-40 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold text-cream hover:text-star transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <button
          onClick={() => setIsShareOpen(true)}
          className="px-3 py-1.5 bg-surface-2 hover:bg-line border border-line text-cream hover:text-star rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Difundir</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 sm:pt-6 space-y-5">
        
        {/* Contenedor Multimedia Principal */}
        {currentMediaUrl ? (
          <div className="relative bg-night rounded-3xl overflow-hidden border border-line shadow-2xl flex items-center justify-center min-h-[240px] max-h-[440px] group">
            {isVideo ? (
              <video
                key={currentMediaUrl}
                src={currentMediaUrl}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[440px] object-contain"
              />
            ) : (
              <img
                key={currentMediaUrl}
                src={currentMediaUrl}
                alt={story.title}
                className="w-full h-full max-h-[440px] object-cover"
              />
            )}

            {/* Flechas de galería si hay más de 1 foto/video */}
            {mediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveMediaIdx(prev => prev > 0 ? prev - 1 : mediaList.length - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night/70 hover:bg-night text-cream border border-line/60 backdrop-blur-md flex items-center justify-center transition-all z-10"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaIdx(prev => prev < mediaList.length - 1 ? prev + 1 : 0)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night/70 hover:bg-night text-cream border border-line/60 backdrop-blur-md flex items-center justify-center transition-all z-10"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 bg-night/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cream border border-line shadow-md">
                  {activeMediaIdx + 1} / {mediaList.length}
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Tarjeta de Contenido */}
        <div className="bg-surface border border-line rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          
          {/* Autor y Ubicación */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-line/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-star/15 border border-star/30 flex items-center justify-center text-star shrink-0">
                {story.photoUrl ? (
                  <img src={story.photoUrl} alt={author} className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-cream text-base leading-tight">{author}</h4>
                  {story.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-night fill-star shrink-0" />
                  )}
                </div>
                <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
                  <MapPin className="w-3 h-3 text-muted shrink-0" />
                  <span>{location}</span>
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-star/15 text-star border border-star/30 uppercase tracking-wide">
              {story.kind === "eventual" ? "Ayuda del día a día" : "Sueño"}
            </span>
          </div>

          {/* Redes sociales del autor */}
          {story.socials && <SocialButtonsRow socials={story.socials} />}

          {/* Título de la causa */}
          <h1 className="font-display font-bold text-xl sm:text-2xl text-cream leading-snug">
            {story.title}
          </h1>

          {/* Historia Completa */}
          <div className="text-sm sm:text-base text-cream/90 leading-relaxed whitespace-pre-line space-y-3">
            {storyText}
          </div>

          {/* Monto estimado */}
          {story.amountNeeded ? (
            <div className="bg-surface-2 border border-line rounded-2xl p-4">
              <span className="text-xs text-muted block mb-1">Monto estimado necesario:</span>
              <span className="font-display font-bold text-2xl text-star">
                ${story.amountNeeded.toLocaleString("es-AR")}
              </span>
            </div>
          ) : null}

          {/* Caja de Alias / CBU */}
          {aliasDisplay && (
            <div className="bg-night border border-line rounded-2xl p-4 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">
                    Alias o CBU para colaborar
                  </span>
                  <span className="font-mono font-bold text-star text-base tracking-wide select-all break-all">
                    {aliasDisplay}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAlias}
                  className="px-4 py-2 bg-star hover:bg-star-dim text-night font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copiado" : "Copiar"}</span>
                </button>
              </div>

              {(story.bankOwnerName || story.userName) && (
                <div className="pt-2 border-t border-line/60 text-xs text-muted flex items-center justify-between">
                  <span>Titular: <strong className="text-cream">{story.bankOwnerName || story.userName}</strong></span>
                  {story.bankOwnerDni && <span>DNI: {story.bankOwnerDni}</span>}
                </div>
              )}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleHelpClick}
              className="w-full sm:flex-1 py-4 bg-star hover:bg-star-dim text-night rounded-2xl font-bold text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Quiero ayudar a cumplir este sueño</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="w-full sm:w-auto px-6 py-4 bg-surface-2 hover:bg-line border border-line text-cream hover:text-star rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span>Difundir</span>
            </button>
          </div>

        </div>

        {/* Banner para explorar más */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-star hover:underline"
          >
            <span>Conoce más historias y sueños en Ayudarte.App →</span>
          </Link>
        </div>

      </div>

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <IntentionModal
        isOpen={isIntentionOpen}
        onClose={() => setIsIntentionOpen(false)}
        type="ayudar"
        itemId={story.id}
        itemTitle={story.title}
        itemKind={story.kind || "dream"}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        item={{
          id: story.id,
          title: story.title,
          userName: story.userName,
          userProvincia: story.userProvincia,
          kind: story.kind,
        }}
      />

    </div>
  );
}
