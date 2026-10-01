"use client";

import { useState } from "react";
import { X, MessageSquareHeart } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ayudar" | "reclamar";
  itemId: string;
  itemTitle: string;
}

export function IntentionModal({ isOpen, onClose, type, itemId, itemTitle }: IntentionModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return alert("Por favor escribe un mensaje.");
    
    const userId = localStorage.getItem("ayudarte_user_id");
    if (!userId) return; // Esto debería estar validado antes de abrir el modal

    setLoading(true);
    try {
      await addDoc(collection(db, "connections"), {
        type,
        itemId,
        itemTitle,
        userId,
        message,
        status: "pending",
        createdAt: Date.now()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        onClose();
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar tu mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        
        {!success && (
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-surface-2 rounded-full text-muted hover:text-white transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in">
              <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🤝</span>
              </div>
              <h2 className="text-xl font-bold text-cream">¡Mensaje enviado!</h2>
              <p className="text-sm text-muted">El equipo de Ayudarte se pondrá en contacto contigo muy pronto para coordinar todo de forma segura.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-2">
                <MessageSquareHeart className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-xl font-display font-bold text-cream">
                {type === "ayudar" ? "¡Gracias por ayudar!" : "Solicitar Regalo"}
              </h2>
              <p className="text-sm text-muted">
                {type === "ayudar" 
                  ? `Estás a punto de ayudar con: "${itemTitle}". Déjanos un mensaje y nosotros nos encargaremos de coordinar todo de forma segura.` 
                  : `Estás solicitando: "${itemTitle}". Déjanos un mensaje explicando por qué lo necesitas.`}
              </p>
              
              <div className="pt-2">
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={type === "ayudar" ? "Ej: Hola, tengo la silla de ruedas, vivo en Córdoba capital..." : "Ej: Hola, necesito los útiles escolares para mi hijo..."}
                  className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-sm focus:border-star focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
