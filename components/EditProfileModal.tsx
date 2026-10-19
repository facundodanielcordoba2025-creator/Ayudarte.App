"use client";

import { useState, useEffect } from "react";
import { 
  X, ShieldCheck, CreditCard, Save, CheckCircle2, 
  Star, Lock, Eye 
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
      // Sincronizar Redes
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

      // Sincronizar Banco
      if (userData.alias) setAlias(userData.alias);
      if (userData.cbu) setCbu(userData.cbu);
      if (userData.bankOwnerName) setBankOwnerName(userData.bankOwnerName);
      else if (userData.name) setBankOwnerName(userData.name);
      if (userData.bankOwnerDni) setBankOwnerDni(userData.bankOwnerDni);
      else if (userData.dni) setBankOwnerDni(userData.dni);
      if (userData.bankName) setBankName(userData.bankName);
    }
  }, [userData]);

  if (!isOpen) return null;

  // Cálculo en vivo de estrellas
  const currentSocials: UserSocials = {
    whatsapp: { value: whatsappVal, visible: whatsappVis },
    instagram: { value: instagramVal, visible: instagramVis },
    facebook: { value: facebookVal, visible: facebookVis },
    tiktok: { value: tiktokVal, visible: tiktokVis },
    email: { value: emailVal, visible: emailVis },
  };

  const stars = calculateVerificationStars(currentSocials);
  const verified = isProfileVerified(currentSocials);

  const handleSaveAll = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        socials: currentSocials,
        verificationStars: stars,
        isVerified: verified,
        alias: alias.trim(),
        cbu: cbu.trim(),
        bankOwnerName: bankOwnerName.trim(),
        bankOwnerDni: bankOwnerDni.trim(),
        bankName: bankName.trim(),
        updatedAt: Date.now(),
      });
      toast.success("¡Perfil actualizado con éxito!");
      onClose(); // Cierra el modal y deja la página limpia
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      toast.error("No se pudieron guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-night/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 hide-scrollbar overflow-hidden">
        
        {/* ENCABEZADO DEL MODAL */}
        <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between shrink-0 bg-surface">
          <div>
            <h3 className="font-display font-bold text-cream text-lg">Editar Mi Perfil</h3>
            <p className="text-xs text-muted mt-0.5">Completá tus redes de verificación y datos de cobro directo</p>
          </div>
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
        <div className="px-5 sm:px-6 pt-4 shrink-0 bg-surface">
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-line">
            <button
              type="button"
              onClick={() => setActiveTab("socials")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "socials" ? "bg-star text-night shadow" : "text-muted hover:text-cream"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Redes ({stars}/5 ⭐)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "bank" ? "bg-star text-night shadow" : "text-muted hover:text-cream"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Datos Bancarios
            </button>
          </div>
        </div>

        {/* CONTENIDO DESPLAZABLE */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 hide-scrollbar flex-1">
          
          {/* TAB 1: REDES SOCIALES & VERIFICACIÓN */}
          {activeTab === "socials" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Badge de estrellas */}
              <div className="p-3.5 rounded-2xl bg-night border border-line flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-star">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-star text-star" : "text-line"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-cream">{stars} de 5</span>
                </div>

                {verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-star bg-star/15 border border-star/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-star text-night" />
                    Verificado
                  </span>
                ) : (
                  <span className="text-[10px] text-muted font-medium">
                    (Mostrá 3 para verificar)
                  </span>
                )}
              </div>

              {/* 1. WhatsApp */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-line flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <WhatsAppIcon className="w-4 h-4 text-star fill-current shrink-0" />
                    <label className="text-xs font-bold text-cream">WhatsApp</label>
                  </div>
                  <input
                    type="tel"
                    value={whatsappVal}
                    onChange={(e) => setWhatsappVal(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full bg-night border border-line rounded-xl px-3 py-1.5 text-xs text-cream focus:border-star outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-muted">Visible</span>
                  <button
                    type="button"
                    onClick={() => setWhatsappVis(!whatsappVis)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      whatsappVis ? "bg-star text-night" : "bg-night text-muted border border-line"
                    }`}
                  >
                    {whatsappVis ? "SÍ" : "NO"}
                  </button>
                </div>
              </div>

              {/* 2. Instagram */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-line flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <InstagramIcon className="w-4 h-4 text-star fill-current shrink-0" />
                    <label className="text-xs font-bold text-cream">Instagram</label>
                  </div>
                  <input
                    type="text"
                    value={instagramVal}
                    onChange={(e) => setInstagramVal(e.target.value)}
                    placeholder="@usuario o link"
                    className="w-full bg-night border border-line rounded-xl px-3 py-1.5 text-xs text-cream focus:border-star outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-muted">Visible</span>
                  <button
                    type="button"
                    onClick={() => setInstagramVis(!instagramVis)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      instagramVis ? "bg-star text-night" : "bg-night text-muted border border-line"
                    }`}
                  >
                    {instagramVis ? "SÍ" : "NO"}
                  </button>
                </div>
              </div>

              {/* 3. Facebook */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-line flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <FacebookIcon className="w-4 h-4 text-star fill-current shrink-0" />
                    <label className="text-xs font-bold text-cream">Facebook</label>
                  </div>
                  <input
                    type="text"
                    value={facebookVal}
                    onChange={(e) => setFacebookVal(e.target.value)}
                    placeholder="Perfil o link"
                    className="w-full bg-night border border-line rounded-xl px-3 py-1.5 text-xs text-cream focus:border-star outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-muted">Visible</span>
                  <button
                    type="button"
                    onClick={() => setFacebookVis(!facebookVis)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      facebookVis ? "bg-star text-night" : "bg-night text-muted border border-line"
                    }`}
                  >
                    {facebookVis ? "SÍ" : "NO"}
                  </button>
                </div>
              </div>

              {/* 4. TikTok */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-line flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TikTokIcon className="w-4 h-4 text-star fill-current shrink-0" />
                    <label className="text-xs font-bold text-cream">TikTok</label>
                  </div>
                  <input
                    type="text"
                    value={tiktokVal}
                    onChange={(e) => setTiktokVal(e.target.value)}
                    placeholder="@usuario o link"
                    className="w-full bg-night border border-line rounded-xl px-3 py-1.5 text-xs text-cream focus:border-star outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-muted">Visible</span>
                  <button
                    type="button"
                    onClick={() => setTiktokVis(!tiktokVis)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      tiktokVis ? "bg-star text-night" : "bg-night text-muted border border-line"
                    }`}
                  >
                    {tiktokVis ? "SÍ" : "NO"}
                  </button>
                </div>
              </div>

              {/* 5. Email */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-line flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <EmailIcon className="w-4 h-4 text-star fill-current shrink-0" />
                    <label className="text-xs font-bold text-cream">Email público</label>
                  </div>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-night border border-line rounded-xl px-3 py-1.5 text-xs text-cream focus:border-star outline-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-muted">Visible</span>
                  <button
                    type="button"
                    onClick={() => setEmailVis(!emailVis)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      emailVis ? "bg-star text-night" : "bg-night text-muted border border-line"
                    }`}
                  >
                    {emailVis ? "SÍ" : "NO"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATOS BANCARIOS */}
          {activeTab === "bank" && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="bg-night border border-line rounded-2xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-star shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted leading-relaxed">
                  Estos datos se mostrarán para que quienes quieran ayudarte puedan verificar en su banco o billetera que la cuenta está a tu nombre antes de transferir.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  Alias (CBU / CVU)
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="ej: mateo.ruedas.mp"
                  className="w-full bg-night border border-line focus:border-star text-cream text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  CBU / CVU (22 dígitos numéricos opcionales)
                </label>
                <input
                  type="text"
                  value={cbu}
                  onChange={(e) => setCbu(e.target.value)}
                  placeholder="0000003100098472619022"
                  className="w-full bg-night border border-line focus:border-star text-cream text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  Nombre y Apellido del Titular
                </label>
                <input
                  type="text"
                  value={bankOwnerName}
                  onChange={(e) => setBankOwnerName(e.target.value)}
                  placeholder="Tal como figura en la cuenta"
                  className="w-full bg-night border border-line focus:border-star text-cream text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  DNI / CUIT del Titular
                </label>
                <input
                  type="text"
                  value={bankOwnerDni}
                  onChange={(e) => setBankOwnerDni(e.target.value)}
                  placeholder="ej: 34.567.890"
                  className="w-full bg-night border border-line focus:border-star text-cream text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                  Banco o Billetera Virtual (opcional)
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="ej: Mercado Pago, Banco Nación, Galicia, Ualá"
                  className="w-full bg-night border border-line focus:border-star text-cream text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* FOOTER CON BOTÓN GUARDAR Y CERRAR */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface shrink-0">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="w-full py-3.5 bg-star hover:bg-star-dim disabled:opacity-50 text-night rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-night" />
            {isSaving ? "Guardando cambios..." : "Guardar cambios y cerrar"}
          </button>
        </div>

      </div>
    </div>
  );
}
