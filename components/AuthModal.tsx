"use client";

import { useState } from "react";
import { X, Mail, KeyRound, MapPin, Phone, User } from "lucide-react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!email.includes("@")) return alert("Ingresa un email válido");
    setLoading(true);
    // Simular envío de código
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (code !== "123456") {
      return alert("Para la versión de prueba, usa el código maestro: 123456");
    }
    
    setLoading(true);
    try {
      // Verificar si el usuario ya existe en Firebase
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Usuario ya existe! Iniciar sesión directamente.
        const userDoc = querySnapshot.docs[0];
        localStorage.setItem("ayudarte_user_id", userDoc.id);
        alert(`¡Bienvenido de nuevo, ${userDoc.data().name || email}!`);
        onClose();
        // Recargar página para actualizar estados
        window.location.reload();
      } else {
        // Usuario nuevo, pasar a completar perfil
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !provincia) return alert("Por favor completa al menos tu nombre, teléfono y provincia.");
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email,
        name,
        phone,
        provincia,
        localidad,
        zip,
        address,
        createdAt: Date.now()
      });
      
      localStorage.setItem("ayudarte_user_id", docRef.id);
      alert("¡Registro exitoso! Ya eres parte de Ayudarte.App");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-surface-2 rounded-full text-muted hover:text-white transition-colors z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream">Ingresá tu email</h2>
              <p className="text-sm text-muted">Te enviaremos un código de seguridad para verificar tu identidad.</p>
              
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
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Recibir código"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-warmth/20 rounded-2xl flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-warmth" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream">Ingresá el código</h2>
              <p className="text-sm text-muted">Para esta versión de prueba, usa el código universal: <span className="text-cream font-bold">123456</span></p>
              
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
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="w-12 h-12 bg-star/20 rounded-2xl flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-star" />
              </div>
              <h2 className="text-xl font-display font-bold text-cream">Completá tus datos</h2>
              <p className="text-xs text-muted mb-4">Último paso. Necesitamos saber quién eres para entregar o recibir ayudas.</p>
              
              <div className="space-y-3 h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Nombre completo</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Teléfono (WhatsApp)</label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Provincia</label>
                  <input type="text" value={provincia} onChange={e=>setProvincia(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Localidad</label>
                    <input type="text" value={localidad} onChange={e=>setLocalidad(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Cód. Postal</label>
                    <input type="text" value={zip} onChange={e=>setZip(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Dirección exacta</label>
                  <input type="text" value={address} onChange={e=>setAddress(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
              </div>
              
              <button 
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-4 shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Finalizar Registro"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
