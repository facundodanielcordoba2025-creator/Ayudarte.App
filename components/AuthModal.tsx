"use client";

import { useState } from "react";
import { X, Mail, KeyRound, MapPin, Phone, User } from "lucide-react";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-surface-2 rounded-full text-muted hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* STEP 1: Email */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream">Ingresá tu email</h2>
              <p className="text-sm text-muted">Te enviaremos un código de seguridad para verificar tu identidad sin necesidad de contraseñas.</p>
              
              <div className="pt-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-center text-lg focus:border-star focus:outline-none transition-colors"
                />
              </div>
              
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform"
              >
                Recibir código
              </button>
            </div>
          )}

          {/* STEP 2: Code Verification */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-warmth/20 rounded-2xl flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-warmth" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream">Ingresá el código</h2>
              <p className="text-sm text-muted">Enviamos un código de 6 dígitos a <span className="text-cream font-bold">{email}</span></p>
              
              <div className="pt-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-center text-3xl font-display tracking-[0.5em] focus:border-star focus:outline-none transition-colors"
                />
              </div>
              
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform"
              >
                Verificar
              </button>
            </div>
          )}

          {/* STEP 3: Profile Form */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-xl font-display font-bold text-cream">Completá tus datos</h2>
              <p className="text-xs text-muted mb-4">Por seguridad de la comunidad, necesitamos saber quién eres para entregar o recibir ayudas.</p>
              
              <div className="space-y-3 h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Nombre completo</label>
                  <input type="text" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Teléfono (WhatsApp)</label>
                  <input type="tel" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Provincia</label>
                  <input type="text" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Localidad</label>
                    <input type="text" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Cód. Postal</label>
                    <input type="text" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Dirección exacta</label>
                  <input type="text" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  alert("¡Registro exitoso!");
                  onClose();
                }}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform"
              >
                Finalizar Registro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
