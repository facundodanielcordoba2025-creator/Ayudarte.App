"use client";

import { useState } from "react";
import { 
  X, Copy, Check, Share2, Sparkles, Send, ExternalLink
} from "lucide-react";
import { 
  WhatsAppIcon, 
  InstagramIcon, 
  FacebookIcon, 
  TikTokIcon, 
  XIcon 
} from "@/components/SocialIcons";
import { toast } from "react-hot-toast";

export interface ShareableItem {
  id: string;
  title: string;
  userName?: string;
  userProvincia?: string;
  history?: string;
  description?: string;
  kind?: "dream" | "eventual";
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShareableItem | null;
}

export function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.ayudarte.app";
  const shareUrl = `${origin}/?historia=${encodeURIComponent(item.id)}&tipo=${item.kind || "dream"}`;
  const author = item.userName ? item.userName.trim() : "un miembro de nuestra comunidad";
  
  // Mensaje persuasivo y optimizado para viralización en grupos
  const shareMessage = `¡Hola! Te comparto la historia de ${author} en Ayudarte.App: "${item.title}".\n\nCualquier aporte, difusión o mensaje de aliento suma muchísimo 🤝💙👇\n${shareUrl}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareMessage);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("¡Enlace copiado al portapapeles!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Te comparto la historia de ${author} en Ayudarte.App: "${item.title}".`,
          url: shareUrl,
        });
        toast.success("¡Gracias por difundir!");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Share error:", err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInstagramShare = async () => {
    await handleCopyLink();
    toast("Pégalo en el sticker de 'Enlace' en tus Historias de Instagram 📲", {
      icon: "📸",
      duration: 4000,
    });
  };

  const handleTikTokShare = async () => {
    await handleCopyLink();
    toast("Pégalo en tu biografía o comparte el enlace en TikTok 🎵", {
      icon: "🎵",
      duration: 4000,
    });
  };

  const shareChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      subtitle: "Grupos, chats y estados",
      icon: WhatsAppIcon,
      bgColor: "bg-[#25D366]/15 hover:bg-[#25D366]/25 border-[#25D366]/30 text-[#25D366]",
      onClick: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "facebook",
      name: "Facebook",
      subtitle: "Muro y grupos de barrio",
      icon: FacebookIcon,
      bgColor: "bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border-[#1877F2]/30 text-[#1877F2]",
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "x",
      name: "X / Twitter",
      subtitle: "Publicar un post",
      icon: XIcon,
      bgColor: "bg-surface-2 hover:bg-line border-line text-cream",
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&hashtags=AyudarteApp,Solidaridad`, "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "instagram",
      name: "Instagram",
      subtitle: "Copiar para Historias",
      icon: InstagramIcon,
      bgColor: "bg-[#E4405F]/15 hover:bg-[#E4405F]/25 border-[#E4405F]/30 text-[#E4405F]",
      onClick: handleInstagramShare,
    },
    {
      id: "tiktok",
      name: "TikTok",
      subtitle: "Copiar para biografía",
      icon: TikTokIcon,
      bgColor: "bg-surface-2 hover:bg-line border-line text-cream",
      onClick: handleTikTokShare,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-night/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl relative p-5 sm:p-6 space-y-5 animate-in zoom-in-95 hide-scrollbar">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-star/15 border border-star/30 flex items-center justify-center text-star shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-cream text-lg leading-tight">Difundir Historia</h3>
              <p className="text-xs text-muted mt-0.5">Multiplica las posibilidades de que se haga realidad</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-line border border-line rounded-full text-muted hover:text-cream transition-all"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen de la Causa */}
        <div className="bg-surface-2/60 border border-line/60 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-star">
            <span>{item.kind === "eventual" ? "AYUDA DEL DÍA A DÍA" : "SUEÑO DE LA COMUNIDAD"}</span>
            {item.userProvincia && <span className="text-muted font-normal">• {item.userProvincia}</span>}
          </div>
          <h4 className="font-bold text-cream text-sm leading-snug line-clamp-2">{item.title}</h4>
          <p className="text-[11px] text-muted">Por <strong className="text-cream">{author}</strong></p>
        </div>

        {/* Botón de Compartir Nativo de Celular (si está disponible) */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 bg-star text-night font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir en mi celular (Todas las apps)</span>
          </button>
        )}

        {/* Canales de Redes Sociales */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            O compartir directamente en:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={channel.onClick}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left active:scale-[0.98] ${channel.bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-night/40 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs leading-tight">{channel.name}</p>
                      <p className="text-[10px] opacity-75">{channel.subtitle}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Caja de Copiar Enlace */}
        <div className="pt-2 border-t border-line space-y-2">
          <label className="block text-xs font-semibold text-muted">
            Enlace directo de esta causa:
          </label>
          <div className="flex items-center gap-2 bg-surface-2 border border-line rounded-xl p-1.5 pl-3">
            <span className="text-xs text-muted truncate flex-1 font-mono">
              {shareUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                copied 
                  ? "bg-star text-night" 
                  : "bg-surface border border-line text-cream hover:border-star hover:text-star"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
