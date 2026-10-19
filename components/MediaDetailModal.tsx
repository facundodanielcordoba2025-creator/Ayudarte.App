"use client";

import { useState } from "react";
import { 
  X, Copy, Check, HeartHandshake, MapPin, 
  Star, CircleUserRound, CheckCircle2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { type UserSocials, isProfileVerified } from "@/lib/verification";
import { SocialButtonsRow } from "@/components/SocialButtonsRow";

export interface MediaDetailItem {
  id: string;
  userId?: string;
  title: string;
  history?: string;
  description?: string;
  media?: string[];
  userName?: string;
  userPhone?: string;
  userProvincia?: string;
  photoUrl?: string;
  cbu?: string;
  alias?: string;
  bankOwnerName?: string;
  bankOwnerDni?: string;
  bankName?: string;
  amountNeeded?: number | null;
  urgencyStars?: number;
  urgencyLabel?: string;
  urgencyNotes?: string;
  urgencyEvaluatorName?: string;
  socials?: UserSocials;
  isVerified?: boolean;
  verificationStars?: number;
  kind?: "dream" | "eventual";
}

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaDetailItem | null;
  onHelp?: (item: MediaDetailItem) => void;
}

export function MediaDetailModal({ isOpen, onClose, item, onHelp }: MediaDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const mediaUrl = item.media && item.media.length > 0 ? item.media[0] : "";
  const isVideo = 
    mediaUrl.includes(".mp4") || 
    mediaUrl.includes("video") || 
    mediaUrl.includes(".webm") || 
    mediaUrl.includes(".mov");

  const aliasDisplay = item.alias || item.cbu || "";
  const ownerName = item.userName || "Usuario";
  const location = item.userProvincia || "Argentina";
  const story = item.history || item.description || "";

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(aliasDisplay);
    setCopied(true);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-night/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 hide-scrollbar">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-line border border-line rounded-full text-muted hover:text-cream transition-all z-20"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SECCIÓN MULTIMEDIA (Video o Foto) */}
        {mediaUrl && (
          <div className="relative bg-night rounded-t-3xl overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px] border-b border-line">
            {isVideo ? (
              <video 
                src={mediaUrl} 
                controls 
                autoPlay 
                playsInline
                className="w-full max-h-[360px] object-contain"
              />
            ) : (
              <img 
                src={mediaUrl} 
                alt={item.title} 
                className="w-full h-full max-h-[360px] object-cover" 
              />
            )}
          </div>
        )}

        {/* 2. CONTENIDO PRINCIPAL */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Perfil del Usuario + Estrellas de Urgencia */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-star/15 border border-star/30 flex items-center justify-center text-star shrink-0">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={ownerName} className="w-full h-full object-cover" />
                ) : (
                  <CircleUserRound className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-cream text-base leading-tight">{ownerName}</h4>
                  {(item.isVerified || isProfileVerified(item.socials)) && (
                    <CheckCircle2 className="w-4 h-4 text-night fill-star shrink-0" />
                  )}
                </div>
                <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
                  <MapPin className="w-3 h-3 text-muted shrink-0" />
                  <span>{location}</span>
                </p>
              </div>
            </div>

            {/* Estrellas en la esquina superior derecha */}
            {item.urgencyStars ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-line/70 bg-night/50 text-cream backdrop-blur-sm shrink-0">
                <span className="flex items-center gap-0.5 text-star">
                  {Array.from({ length: item.urgencyStars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-star text-star" />
                  ))}
                </span>
              </div>
            ) : null}
          </div>

          {/* Redes Sociales del Titular */}
          {item.socials && (
            <SocialButtonsRow socials={item.socials} />
          )}

          {/* Título de la causa */}
          <h3 className="font-display font-bold text-lg text-cream leading-snug">
            {item.title}
          </h3>

          {/* Historia */}
          {story && (
            <p className="text-sm text-cream/90 leading-relaxed whitespace-pre-line">
              {story}
            </p>
          )}

          {item.amountNeeded ? (
            <p className="text-sm text-cream">
              Meta: <span className="font-bold text-star">${item.amountNeeded.toLocaleString('es-AR')}</span>
            </p>
          ) : null}

          {/* CAJA DE CBU / ALIAS Y DATOS DEL TITULAR */}
          {aliasDisplay && (
            <div className="bg-night border border-line rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">
                    Alias / CBU
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
                  {copied ? <Check className="w-4 h-4 text-night" /> : <Copy className="w-4 h-4 text-night" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>

              {/* Datos de validación de la cuenta: Nombre, Apellido y DNI del titular */}
              {(item.bankOwnerName || item.bankOwnerDni || item.userName) && (
                <div className="pt-2.5 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted text-[11px]">Cuenta a nombre de:</span>
                    <span className="font-bold text-cream">
                      {item.bankOwnerName || item.userName}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.bankOwnerDni && (
                      <span className="text-muted text-[11px]">
                        DNI: <strong className="text-cream font-medium">{item.bankOwnerDni}</strong>
                      </span>
                    )}
                    {item.bankName && (
                      <span className="px-2 py-0.5 rounded-md bg-surface-2 text-muted border border-line text-[10px] font-medium">
                        {item.bankName}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOTÓN DE ACCIÓN */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onHelp) onHelp(item);
            }}
            className="w-full py-3.5 bg-star hover:bg-star-dim text-night rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <HeartHandshake className="w-5 h-5" />
            Quiero ayudar
          </button>

        </div>

      </div>
    </div>
  );
}
