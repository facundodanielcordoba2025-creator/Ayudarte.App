"use client";

import { useState, useEffect } from "react";
import { 
  X, ShieldCheck, Building2, CheckCircle2, 
  Star 
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userData: any;
}

export function EditProfileModal({ isOpen, onClose, userId, userData }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"socials" | "bank">("socials");
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Redes Sociales
  const [whatsappVal, setWhatsappVal] = useState("");
  const [whatsappVis, setWhatsappVis] = useState(true);

  const [instagramVal, setInstagramVal] = useState("");
  const [instagramVis, setInstagramVis] = useState(true);

  const [facebookVal, setFacebookVal] = useState("");
  const [facebookVis, setFacebookVis] = useState(false);

  const [tiktokVal, setTiktokVal] = useState("");
  const [tiktokVis, setTiktokVis] = useState(false);

  const [emailVal, setEmailVal] = useState("");
  const [emailVis, setEmailVis] = useState(false);

  // Estados de Datos Bancarios
  const [alias, setAlias] = useState("");
  const [cbu, setCbu] = useState("");
  const [bankOwnerName, setBankOwnerName] = useState("");
  const [bankOwnerDni, setBankOwnerDni] = useState("");
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    if (userData) {
      if (userData.socials) {
        setWhatsappVal(userData.socials.whatsapp?.value || "");
        setWhatsappVis(userData.socials.whatsapp?.visible ?? true);

        setInstagramVal(userData.socials.instagram?.value || "");
        setInstagramVis(userData.socials.instagram?.visible ?? true);

        setFacebookVal(userData.socials.facebook?.value || "");
        setFacebookVis(userData.socials.facebook?.visible ?? false);

        setTiktokVal(userData.socials.tiktok?.value || "");
        setTiktokVis(userData.socials.tiktok?.visible ?? false);

        setEmailVal(userData.socials.email?.value || userData.email || "");
        setEmailVis(userData.socials.email?.visible ?? false);
      } else {
        if (userData.phone) setWhatsappVal(userData.phone);
        if (userData.email) setEmailVal(userData.email);
      }

      if (userData.bankData) {
        setAlias(userData.bankData.alias || "");
        setCbu(userData.bankData.cbu || "");
        setBankOwnerName(userData.bankData.bankOwnerName || userData.name || "");
        setBankOwnerDni(userData.bankData.bankOwnerDni || "");
        setBankName(userData.bankData.bankName || "");
      } else {
        if (userData.name) setBankOwnerName(userData.name);
      }
    }
  }, [userData, isOpen]);

  if (!isOpen) return null;

  // Cálculo dinámico de estrellas para vista previa en vivo
  const previewSocials: UserSocials = {
    whatsapp: { value: whatsappVal, visible: whatsappVis },
    instagram: { value: instagramVal, visible: instagramVis },
    facebook: { value: facebookVal, visible: facebookVis },
    tiktok: { value: tiktokVal, visible: tiktokVis },
    email: { value: emailVal, visible: emailVis },
  };

  const previewUser = { ...userData, socials: previewSocials };
  const stars = calculateVerificationStars(previewUser);
  const verified = isProfileVerified(previewUser);

  const handleSaveAll = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const updatedSocials: UserSocials = {
        whatsapp: { value: whatsappVal.trim(), visible: whatsappVis },
        instagram: { value: instagramVal.trim(), visible: instagramVis },
        facebook: { value: facebookVal.trim(), visible: facebookVis },
        tiktok: { value: tiktokVal.trim(), visible: tiktokVis },
        email: { value: emailVal.trim(), visible: emailVis },
      };

      const updatedBankData = {
        alias: alias.trim(),
        cbu: cbu.trim(),
        bankOwnerName: bankOwnerName.trim(),
        bankOwnerDni: bankOwnerDni.trim(),
        bankName: bankName.trim(),
        updatedAt: Date.now(),
      };

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        socials: updatedSocials,
        isVerified: verified,
        verificationStars: stars,
        bankData: updatedBankData,
        alias: alias.trim(),
        cbu: cbu.trim(),
      });

      toast.success("¡Perfil actualizado con éxito!");
      onClose();
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      toast.error("No se pudieron guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-night/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 overflow-hidden">
        
        {/* ENCABEZADO */}
        <div className="p-5 border-b border-line flex items-center justify-between shrink-0 bg-surface">
          <h3 className="font-display font-bold text-cream text-lg">Mi Perfil</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-line border border-line rounded-full text-muted hover:text-cream transition-all shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="px-5 pt-4 shrink-0 bg-surface">
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-line">
            <button
              type="button"
              onClick={() => setActiveTab("socials")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "socials" ? "bg-star text-night shadow" : "text-muted hover:text-cream"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Redes ({stars}/5)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "bank" ? "bg-star text-night shadow" : "text-muted hover:text-cream"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Datos Bancarios</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-5 overflow-y-auto space-y-3.5 hide-scrollbar flex-1">
          
          {/* TAB 1: REDES */}
          {activeTab === "socials" && (
            <div className="space-y-3 animate-in fade-in">
              {/* Puntuación */}
              <div className="p-3.5 rounded-2xl bg-night/80 border border-line flex items-center justify-between">
                <div className="flex items-center gap-1 text-star">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-star text-star" : "text-line"}`} />
                  ))}
                </div>
                {verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-star">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-star text-night" />
                    Verificado
                  </span>
                ) : (
                  <span className="text-xs text-muted font-bold">
                    {stars}/5 redes
                  </span>
                )}
              </div>

              {/* 1. WhatsApp */}
              <div className="flex items-center gap-3 bg-night/80 border border-line rounded-2xl p-2.5 sm:p-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-line">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <input
                  type="tel"
                  value={whatsappVal}
                  onChange={(e) => setWhatsappVal(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="flex-1 min-w-0 bg-transparent text-cream placeholder:text-muted/50 text-sm font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setWhatsappVis(!whatsappVis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    whatsappVal.trim() && whatsappVis
                      ? "bg-star text-night shadow-[0_0_10px_rgba(0,229,45,0.25)]"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {whatsappVal.trim() && whatsappVis ? "Visible" : "Oculto"}
                </button>
              </div>

              {/* 2. Instagram */}
              <div className="flex items-center gap-3 bg-night/80 border border-line rounded-2xl p-2.5 sm:p-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-line">
                  <InstagramIcon className="w-5 h-5 text-[#E4405F]" />
                </div>
                <input
                  type="text"
                  value={instagramVal}
                  onChange={(e) => setInstagramVal(e.target.value)}
                  placeholder="@usuario o enlace"
                  className="flex-1 min-w-0 bg-transparent text-cream placeholder:text-muted/50 text-sm font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setInstagramVis(!instagramVis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    instagramVal.trim() && instagramVis
                      ? "bg-star text-night shadow-[0_0_10px_rgba(0,229,45,0.25)]"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {instagramVal.trim() && instagramVis ? "Visible" : "Oculto"}
                </button>
              </div>

              {/* 3. Facebook */}
              <div className="flex items-center gap-3 bg-night/80 border border-line rounded-2xl p-2.5 sm:p-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-line">
                  <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
                </div>
                <input
                  type="text"
                  value={facebookVal}
                  onChange={(e) => setFacebookVal(e.target.value)}
                  placeholder="Perfil o enlace"
                  className="flex-1 min-w-0 bg-transparent text-cream placeholder:text-muted/50 text-sm font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFacebookVis(!facebookVis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    facebookVal.trim() && facebookVis
                      ? "bg-star text-night shadow-[0_0_10px_rgba(0,229,45,0.25)]"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {facebookVal.trim() && facebookVis ? "Visible" : "Oculto"}
                </button>
              </div>

              {/* 4. TikTok */}
              <div className="flex items-center gap-3 bg-night/80 border border-line rounded-2xl p-2.5 sm:p-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-line">
                  <TikTokIcon className="w-5 h-5 text-cream" />
                </div>
                <input
                  type="text"
                  value={tiktokVal}
                  onChange={(e) => setTiktokVal(e.target.value)}
                  placeholder="@usuario o enlace"
                  className="flex-1 min-w-0 bg-transparent text-cream placeholder:text-muted/50 text-sm font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTiktokVis(!tiktokVis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    tiktokVal.trim() && tiktokVis
                      ? "bg-star text-night shadow-[0_0_10px_rgba(0,229,45,0.25)]"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {tiktokVal.trim() && tiktokVis ? "Visible" : "Oculto"}
                </button>
              </div>

              {/* 5. Email */}
              <div className="flex items-center gap-3 bg-night/80 border border-line rounded-2xl p-2.5 sm:p-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shrink-0 border border-line">
                  <EmailIcon className="w-5 h-5 text-[#EA4335]" />
                </div>
                <input
                  type="email"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="flex-1 min-w-0 bg-transparent text-cream placeholder:text-muted/50 text-sm font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setEmailVis(!emailVis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    emailVal.trim() && emailVis
                      ? "bg-star text-night shadow-[0_0_10px_rgba(0,229,45,0.25)]"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  {emailVal.trim() && emailVis ? "Visible" : "Oculto"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DATOS BANCARIOS */}
          {activeTab === "bank" && (
            <div className="space-y-3 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">Alias</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="ej. nombre.mp"
                  className="w-full bg-night/80 border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">CBU / CVU</label>
                <input
                  type="text"
                  value={cbu}
                  onChange={(e) => setCbu(e.target.value)}
                  placeholder="22 dígitos"
                  className="w-full bg-night/80 border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">Titular de la cuenta</label>
                <input
                  type="text"
                  value={bankOwnerName}
                  onChange={(e) => setBankOwnerName(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full bg-night/80 border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5">DNI / CUIT</label>
                  <input
                    type="text"
                    value={bankOwnerDni}
                    onChange={(e) => setBankOwnerDni(e.target.value)}
                    placeholder="Número"
                    className="w-full bg-night/80 border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5">Banco o Billetera</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="ej. Mercado Pago"
                    className="w-full bg-night/80 border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface shrink-0">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="w-full py-3.5 bg-star hover:bg-star-dim disabled:opacity-50 text-night rounded-2xl font-bold text-sm shadow-[0_4px_14px_rgba(0,229,45,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-night" />
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}
