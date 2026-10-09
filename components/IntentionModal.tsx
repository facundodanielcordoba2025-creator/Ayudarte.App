import { toast } from "react-hot-toast";

"use client";

import { useState } from "react";
import { X, MessageSquareHeart, Copy, CheckCircle2, DollarSign, Package, Star } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ayudar" | "reclamar";
  itemId: string;
  itemTitle: string;
  /** "eventual" = pedido de ayuda del día a día; ajusta los textos del modal. */
  itemKind?: "dream" | "eventual";
}

export function IntentionModal({ isOpen, onClose, type, itemId, itemTitle, itemKind = "dream" }: IntentionModalProps) {
  const isEventual = itemKind === "eventual";
  const noun = isEventual ? "la ayuda" : "el sueño";
  const [helpMode, setHelpMode] = useState<"economico" | "objeto" | "completo" | null>(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Mode (if ayudar), 2: Input Details, 3: Success

  if (!isOpen) return null;

  const handleReset = () => {
    setHelpMode(null);
    setMessage("");
    setAmount("");
    setStep(1);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (type === "ayudar" && helpMode === "economico" && !amount) return toast("Por favor ingresa un monto.");
    if (type === "ayudar" && helpMode === "objeto" && !message.trim()) return toast("Por favor escribe qué objeto donarás.");
    if (type === "reclamar" && !message.trim()) return toast("Por favor escribe un mensaje.");
    
    const userId = localStorage.getItem("ayudarte_user_id");
    if (!userId) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "connections"), {
        type,
        itemId,
        itemTitle,
        itemKind,
        userId,
        helpMode: type === "ayudar" ? helpMode : null,
        amount: amount ? Number(amount) : null,
        message: helpMode === "completo" ? `Desea cubrir ${noun} completo` : message,
        status: "pending",
        createdAt: Date.now()
      });
      setSuccess(true);
      setStep(3);
      setTimeout(() => {
        handleReset();
      }, 5000);
    } catch (error) {
      console.error(error);
      toast("Hubo un error al enviar tu mensaje.");
    } finally {
      setLoading(false);
    }
  };

  // If it's just "reclamar", bypass the help mode selection
  if (type === "reclamar" && step === 1) {
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {!success && (
          <button onClick={handleReset} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-surface-2 rounded-full text-muted hover:text-white transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-6">
          {step === 1 && type === "ayudar" && (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-cream mb-4">¿Cómo quieres ayudar?</h2>
              
              <button onClick={() => { setHelpMode("economico"); setStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-line hover:border-star transition-colors text-left group">
                <div className="w-12 h-12 rounded-full bg-star flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,45,0.4)]">
                  <DollarSign className="w-6 h-6 text-night" />
                </div>
                <div>
                  <h3 className="font-bold text-cream">Aporte Económico</h3>
                  <p className="text-xs text-muted mt-1">Dona dinero a voluntad. Se sumará al pozo de {isEventual ? "esta ayuda" : "este sueño"}.</p>
                </div>
              </button>

              <button onClick={() => { setHelpMode("objeto"); setStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-line hover:border-star transition-colors text-left group">
                <div className="w-12 h-12 rounded-full bg-star flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,45,0.4)]">
                  <Package className="w-6 h-6 text-night" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-cream">Aporte de Objeto</h3>
                  <p className="text-xs text-muted mt-1">Regala un artículo físico que {isEventual ? "esta persona" : "el soñador"} necesite.</p>
                </div>
              </button>

              <button onClick={() => { setHelpMode("completo"); setStep(2); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-star/50 hover:border-star transition-colors text-left group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-star/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="w-12 h-12 rounded-full bg-star flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,45,0.4)]">
                  <Star className="w-6 h-6 text-night" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-cream">{isEventual ? "Cubrir la Ayuda Completa" : "Cumplir Sueño Completo"}</h3>
                  <p className="text-xs text-muted mt-1">Quiero hacerme cargo de toda la petición.</p>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-2">
                <MessageSquareHeart className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-xl font-display font-bold text-cream">
                {type === "reclamar" ? "Solicitar Regalo" : 
                 helpMode === "economico" ? "Aporte Económico" : 
                 helpMode === "objeto" ? "Aporte de Objeto" : isEventual ? "Cubrir la Ayuda" : "Cumplir Sueño"}
              </h2>

              {helpMode === "completo" && (
                <div className="bg-star/10 border border-star/30 p-4 rounded-xl">
                  <p className="text-sm text-star font-medium text-center">¡Qué gran corazón! Trabajamos juntos para {isEventual ? "cubrir esta necesidad" : "cumplir el sueño"}. Al aceptar, nuestro equipo se contactará de inmediato contigo para coordinar toda la gestión.</p>
                </div>
              )}

              {helpMode === "economico" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Monto a donar ($)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Ej: 5000"
                      className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-lg font-bold focus:border-star focus:outline-none transition-colors"
                    />
                  </div>
                  {amount && Number(amount) > 0 && (
                    <div className="bg-surface-2 border border-line p-4 rounded-xl animate-in fade-in zoom-in-95">
                      <p className="text-xs text-muted mb-3 font-bold uppercase">Datos Bancarios para transferir:</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between bg-night/50 border border-line rounded-lg p-2 px-3">
                          <span className="text-xs text-muted">CBU</span>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-cream font-mono">00000031000000000000</strong>
                            <button onClick={() => {
                              navigator.clipboard.writeText("00000031000000000000");
                              toast("CBU copiado al portapapeles");
                            }} className="p-1.5 hover:bg-star/20 rounded-md transition-colors text-star">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-night/50 border border-line rounded-lg p-2 px-3">
                          <span className="text-xs text-muted">Alias</span>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-cream font-mono">AYUDARTE.APP.SOLIDARIO</strong>
                            <button onClick={() => {
                              navigator.clipboard.writeText("AYUDARTE.APP.SOLIDARIO");
                              toast("Alias copiado al portapapeles");
                            }} className="p-1.5 hover:bg-star/20 rounded-md transition-colors text-star">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-star font-medium leading-tight">Recaudaremos el dinero en este pozo seguro. Cuando cubramos la meta, procederemos a {isEventual ? "cubrir la ayuda" : "cumplir el sueño"} y verás la actualización en tu perfil.</p>
                    </div>
                  )}
                  <p className="text-xs text-muted">También puedes dejarnos un mensaje (Opcional):</p>
                </div>
              )}

              {(helpMode === "objeto" || helpMode === "economico" || type === "reclamar") && (
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={type === "reclamar" ? "Explica por qué lo necesitas..." : helpMode === "objeto" ? "Ej: Tengo una silla de ruedas casi nueva para donar..." : "Tu mensaje..."}
                  className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-sm focus:border-star focus:outline-none transition-colors resize-none mt-2"
                />
              )}
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Procesando..." : helpMode === "economico" ? "Aceptar y Notificar Transferencia" : "Confirmar Ayuda"}
              </button>

              {type === "ayudar" && (
                <button onClick={() => setStep(1)} className="w-full text-center text-xs text-muted hover:text-cream mt-2">
                  Volver atrás
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in">
              <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-star" />
              </div>
              <h2 className="text-xl font-bold text-cream">¡Gracias por tu inmenso corazón!</h2>
              <p className="text-sm text-muted">Tu intención de ayuda ha sido registrada. Puedes ver el estado de {isEventual ? "esta ayuda" : "este sueño"} en tu sección "Mi Cuenta". Nuestro equipo lo está procesando.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
