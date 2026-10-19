"use client";
import { toast } from "react-hot-toast";

import { useState } from "react";
import { X, Mail, KeyRound, MapPin, Phone, User, Bell, ShieldCheck } from "lucide-react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/lib/push-config";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptPush, setAcceptPush] = useState(true);
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!email.includes("@")) return toast("Ingresa un email válido");
    setLoading(true);
    
    if (email === "demo@ayudarte.app" || email === "tester@ayudarte.app" || email === "google@ayudarte.app") {
      setGeneratedCode("123456");
      setStep(2);
      setLoading(false);
      return;
    }

    // Generar código de 6 dígitos aleatorio
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: newCode })
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.ok && data.success) {
        if (!data.delivered && data.fallbackCode) {
          setCode(data.fallbackCode);
          toast.success("Código de verificación listo");
        } else {
          toast.success("Código enviado a tu correo");
        }
        setStep(2);
      } else {
        // Failsafe de emergencia para jamás bloquear a un usuario que descarga la app
        setCode(newCode);
        toast.success("Código de verificación listo");
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      // Failsafe ante error de red
      setCode(newCode);
      toast.success("Código de verificación listo");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code !== generatedCode && code !== "123456") {
      return toast("Código incorrecto, por favor revisa tu correo.");
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
        toast(`¡Bienvenido de nuevo, ${userDoc.data().name || email}!`);
        onClose();
        // Recargar página para actualizar estados
        window.location.reload();
      } else {
        // Usuario nuevo, pasar a completar perfil
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      toast("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !phone || !provincia) return toast("Por favor completa al menos tu nombre, teléfono y provincia.");
    if (isCompany && !companyName) return toast("Si eres empresa, ingresa el nombre de la empresa.");
    if (!acceptTerms) return toast("Debes aceptar los Términos y Condiciones para continuar.");
    
    setLoading(true);
    try {
      let logoUrl = null;
      if (isCompany && companyLogo) {
        try {
          logoUrl = await uploadToCloudinary(companyLogo);
        } catch (uploadErr) {
          console.warn("No se pudo procesar el logo, continuando registro:", uploadErr);
        }
      }

      const docRef = await addDoc(collection(db, "users"), {
        email,
        name,
        dni,
        phone,
        provincia,
        localidad,
        zip,
        address,
        isCompany,
        companyName: isCompany ? companyName : null,
        companyLogo: logoUrl,
        acceptPush,
        createdAt: Date.now()
      });

      // Si el usuario consintió recibir notificaciones push, solicitamos el permiso nativo y registramos el dispositivo
      if (acceptPush && typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
        try {
          const perm = await Notification.requestPermission();
          if (perm === "granted") {
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
              sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource
              });
            }
            const subJson = sub.toJSON();
            if (subJson.endpoint && subJson.keys) {
              const docId = encodeURIComponent(subJson.endpoint).slice(-100).replace(/\./g, "_");
              await setDoc(doc(db, "push_subscriptions", docId), {
                endpoint: subJson.endpoint,
                keys: subJson.keys,
                userId: docRef.id,
                userEmail: email,
                userName: name,
                platform: /android/i.test(navigator.userAgent) ? "android" : "web",
                active: true,
                updatedAt: Date.now(),
                createdAt: Date.now()
              }, { merge: true });
            }
          }
        } catch (pushErr) {
          console.warn("Suscripción push durante el registro omitida o no soportada:", pushErr);
        }
      }
      
      localStorage.setItem("ayudarte_user_id", docRef.id);
      toast("¡Registro exitoso! Ya eres parte de Ayudarte.App");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast("Error al registrarse");
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
                
                {/* Selector Persona / Empresa */}
                <div className="flex bg-surface-2 p-1 rounded-xl mb-4 border border-line">
                  <button 
                    onClick={() => setIsCompany(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isCompany ? 'bg-star text-night shadow-sm' : 'text-muted hover:text-cream'}`}
                  >
                    Soy Persona
                  </button>
                  <button 
                    onClick={() => setIsCompany(true)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isCompany ? 'bg-star text-night shadow-sm' : 'text-muted hover:text-cream'}`}
                  >
                    Soy Empresa
                  </button>
                </div>

                {isCompany && (
                  <div className="bg-star/5 border border-star/20 p-4 rounded-xl space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block text-star">Nombre de la Empresa</label>
                      <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Ej. Zapatería López" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block text-star">Logo de la Empresa (Opcional)</label>
                      <input type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCompanyLogo(e.target.files[0]);
                        }
                      }} className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-2 file:text-star hover:file:bg-surface-light transition-colors" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">{isCompany ? 'Nombre del Contacto' : 'Nombre completo'}</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">DNI / CUIT (Seguridad)</label>
                  <input type="text" value={dni} onChange={e=>setDni(e.target.value)} placeholder="Sin puntos ni espacios" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
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

              {/* Consentimientos Legales y Notificaciones Push */}
              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-surface-2 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms} 
                    onChange={e => setAcceptTerms(e.target.checked)} 
                    className="mt-0.5 accent-star w-4 h-4 rounded cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-muted leading-tight select-none">
                    Acepto los <a href="/legales" target="_blank" className="text-cream underline underline-offset-2 hover:text-star font-semibold">Términos, Privacidad y Políticas</a> de Ayudarte.App.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-xl bg-star/10 border border-star/30 hover:border-star transition-all">
                  <input 
                    type="checkbox" 
                    checked={acceptPush} 
                    onChange={e => setAcceptPush(e.target.checked)} 
                    className="mt-0.5 accent-star w-4 h-4 rounded cursor-pointer shrink-0"
                  />
                  <div className="select-none">
                    <span className="text-xs font-bold text-cream flex items-center gap-1.5 leading-tight">
                      <Bell className="w-3.5 h-3.5 text-star shrink-0" />
                      Acepto recibir alertas de casos urgentes y sueños cumplidos
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5 leading-snug">
                      Te notificaremos al instante en tu celular ante necesidades prioritarias.
                    </span>
                  </div>
                </label>
              </div>
              
              <button 
                onClick={handleRegister}
                disabled={loading || !acceptTerms}
                className="w-full bg-star text-night font-bold py-3.5 rounded-xl mt-3 shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform disabled:opacity-50"
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
