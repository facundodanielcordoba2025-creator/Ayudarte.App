"use client";

import { useState, useEffect } from "react";
import { 
  Star, ShieldCheck, MessageCircle, Mail, 
  Check, Save, Sparkles, ChevronDown, ChevronUp 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  type UserSocials, 
  calculateVerificationStars, 
  isProfileVerified 
} from "@/lib/verification";
import { 
  WhatsAppIcon, 
  InstagramIcon, 
  FacebookIcon, 
  TikTokIcon, 
  EmailIcon 
} from "@/components/SocialIcons";

interface SocialVerificationSectionProps {
  userId: string;
  userData: any;
}

export function SocialVerificationSection({ userId, userData }: SocialVerificationSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados locales para cada uno de los 5 canales
  const [whatsappVal, setWhatsappVal] = useState(userData?.socials?.whatsapp?.value ?? userData?.phone ?? "");
  const [whatsappVis, setWhatsappVis] = useState(userData?.socials?.whatsapp?.visible ?? true);

  const [instagramVal, setInstagramVal] = useState(userData?.socials?.instagram?.value ?? "");
  const [instagramVis, setInstagramVis] = useState(userData?.socials?.instagram?.visible ?? true);

  const [facebookVal, setFacebookVal] = useState(userData?.socials?.facebook?.value ?? "");
  const [facebookVis, setFacebookVis] = useState(userData?.socials?.facebook?.visible ?? false);

  const [tiktokVal, setTiktokVal] = useState(userData?.socials?.tiktok?.value ?? "");
  const [tiktokVis, setTiktokVis] = useState(userData?.socials?.tiktok?.visible ?? false);

  const [emailVal, setEmailVal] = useState(userData?.socials?.email?.value ?? userData?.email ?? "");
  const [emailVis, setEmailVis] = useState(userData?.socials?.email?.visible ?? false);

  // Sincronizar si cambia userData
  useEffect(() => {
    if (userData) {
      if (userData.socials?.whatsapp) {
        setWhatsappVal(userData.socials.whatsapp.value || "");
        setWhatsappVis(userData.socials.whatsapp.visible);
      } else if (userData.phone) {
        setWhatsappVal(userData.phone);
      }

      if (userData.socials?.instagram) {
        setInstagramVal(userData.socials.instagram.value || "");
        setInstagramVis(userData.socials.instagram.visible);
      }

      if (userData.socials?.facebook) {
        setFacebookVal(userData.socials.facebook.value || "");
        setFacebookVis(userData.socials.facebook.visible);
      }

      if (userData.socials?.tiktok) {
        setTiktokVal(userData.socials.tiktok.value || "");
        setTiktokVis(userData.socials.tiktok.visible);
      }

      if (userData.socials?.email) {
        setEmailVal(userData.socials.email.value || "");
        setEmailVis(userData.socials.email.visible);
      } else if (userData.email) {
        setEmailVal(userData.email);
      }
    }
  }, [userData]);

  // Objeto en tiempo real para calcular las estrellas
  const currentSocials: UserSocials = {
    whatsapp: { value: whatsappVal, visible: whatsappVis },
    instagram: { value: instagramVal, visible: instagramVis },
    facebook: { value: facebookVal, visible: facebookVis },
    tiktok: { value: tiktokVal, visible: tiktokVis },
    email: { value: emailVal, visible: emailVis },
  };

  const stars = calculateVerificationStars(currentSocials);
  const verified = isProfileVerified(currentSocials);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        socials: currentSocials,
        verificationStars: stars,
        isVerified: verified,
        updatedAt: Date.now(),
      });
      toast.success("¡Redes y nivel de verificación guardados!");
    } catch (err) {
      console.error("Error guardando redes:", err);
      toast.error("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-3xl border border-line p-5 sm:p-6 shadow-sm">
      
      {/* Header del bloque con medidor de estrellas */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-star" />
              <h3 className="font-display font-bold text-cream text-lg">
                Nivel de Verificación del Perfil
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Cada canal verificado y visible suma 1 estrella.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-night/60 px-3 py-1.5 rounded-2xl border border-line">
              <span className="flex items-center gap-0.5 text-star">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < stars ? "fill-star text-star" : "text-muted/30"}`} 
                  />
                ))}
              </span>
              <span className="text-xs font-bold text-cream ml-1">{stars}/5</span>
            </div>
            <button className="text-muted hover:text-cream transition-colors p-1">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Badge de estado */}
        <div className="mt-3">
          {verified ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-star/15 border border-star/30 text-star text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>¡Perfil Verificado! Máxima visibilidad en la app activada</span>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-surface-2 border border-line text-xs text-muted leading-relaxed">
              <strong className="text-cream block mb-0.5">Mostrá al menos 3 redes sociales</strong>
              Para que tus tarjetas tengan más visualizaciones y la comunidad confíe al instante en tu sueño o ayuda.
            </div>
          )}
        </div>
      </div>

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="mt-6 pt-5 border-t border-line space-y-4">
          
          {/* 1. WHATSAPP */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <WhatsAppIcon className="w-4 h-4 text-star fill-current" />
                <label className="text-xs font-bold text-cream">WhatsApp (Teléfono)</label>
              </div>
              <input
                type="tel"
                value={whatsappVal}
                onChange={(e) => setWhatsappVal(e.target.value)}
                placeholder="Ej. +54 9 11 1234-5678"
                className="w-full bg-night border border-line rounded-xl px-3 py-2 text-xs text-cream focus:border-star focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-muted">Visible:</span>
              <button
                type="button"
                onClick={() => setWhatsappVis(!whatsappVis)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${whatsappVis ? "bg-star text-night" : "bg-night text-muted border border-line"}`}
              >
                {whatsappVis ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          {/* 2. INSTAGRAM */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <InstagramIcon className="w-4 h-4 text-star fill-current" />
                <label className="text-xs font-bold text-cream">Instagram</label>
              </div>
              <input
                type="text"
                value={instagramVal}
                onChange={(e) => setInstagramVal(e.target.value)}
                placeholder="Ej. @tu_usuario o link completo"
                className="w-full bg-night border border-line rounded-xl px-3 py-2 text-xs text-cream focus:border-star focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-muted">Visible:</span>
              <button
                type="button"
                onClick={() => setInstagramVis(!instagramVis)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${instagramVis ? "bg-star text-night" : "bg-night text-muted border border-line"}`}
              >
                {instagramVis ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          {/* 3. FACEBOOK */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FacebookIcon className="w-4 h-4 text-star fill-current" />
                <label className="text-xs font-bold text-cream">Facebook</label>
              </div>
              <input
                type="text"
                value={facebookVal}
                onChange={(e) => setFacebookVal(e.target.value)}
                placeholder="Ej. nombre de perfil o enlace"
                className="w-full bg-night border border-line rounded-xl px-3 py-2 text-xs text-cream focus:border-star focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-muted">Visible:</span>
              <button
                type="button"
                onClick={() => setFacebookVis(!facebookVis)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${facebookVis ? "bg-star text-night" : "bg-night text-muted border border-line"}`}
              >
                {facebookVis ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          {/* 4. TIKTOK */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TikTokIcon className="w-4 h-4 text-star fill-current" />
                <label className="text-xs font-bold text-cream">TikTok</label>
              </div>
              <input
                type="text"
                value={tiktokVal}
                onChange={(e) => setTiktokVal(e.target.value)}
                placeholder="Ej. @tu_tiktok o link"
                className="w-full bg-night border border-line rounded-xl px-3 py-2 text-xs text-cream focus:border-star focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-muted">Visible:</span>
              <button
                type="button"
                onClick={() => setTiktokVis(!tiktokVis)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tiktokVis ? "bg-star text-night" : "bg-night text-muted border border-line"}`}
              >
                {tiktokVis ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          {/* 5. EMAIL */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <EmailIcon className="w-4 h-4 text-star fill-current" />
                <label className="text-xs font-bold text-cream">Email</label>
              </div>
              <input
                type="email"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-night border border-line rounded-xl px-3 py-2 text-xs text-cream focus:border-star focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-muted">Visible:</span>
              <button
                type="button"
                onClick={() => setEmailVis(!emailVis)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${emailVis ? "bg-star text-night" : "bg-night text-muted border border-line"}`}
              >
                {emailVis ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-2 bg-star hover:bg-star-dim disabled:opacity-50 text-night font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            {isSaving ? "Guardando..." : "Guardar Canales y Nivel de Verificación"}
          </button>

        </div>
      )}

    </div>
  );
}
