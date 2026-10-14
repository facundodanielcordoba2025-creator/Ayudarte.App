"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, PlusSquare } from "lucide-react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // 1. Verificar si ya está corriendo como App instalada
    const standalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);

    if (standalone) return;

    // 2. Verificar si el usuario ya lo cerró en esta sesión
    const dismissed = sessionStorage.getItem("ayudarte_pwa_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }

    // 3. Detectar iOS (Safari)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // 4. Capturar evento de instalación nativo (Android Chrome / Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsDismissed(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Flujo nativo Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Flujo instructivo iOS
      setShowIOSModal(true);
    } else {
      // Fallback
      alert("Para instalar la app, abre las opciones de tu navegador (3 puntitos) y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("ayudarte_pwa_dismissed", "true");
  };

  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Banner flotante */}
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-surface border border-line p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img 
              src="/icons/icon-192.png" 
              alt="Ayudarte Icon" 
              className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0" 
            />
            <div className="min-w-0">
              <h4 className="text-cream text-sm font-bold truncate">Instalar AYUDARTE.APP</h4>
              <p className="text-muted text-xs truncate">Acceso rápido y sin esperas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-star text-night font-bold text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-muted hover:text-cream rounded-lg transition-colors"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal instructivo para iPhone / iPad */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-line rounded-3xl p-6 max-w-sm w-full relative shadow-2xl text-center">
            <button 
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-cream rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <img 
              src="/icons/icon-192.png" 
              alt="Ayudarte.app" 
              className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg"
            />

            <h3 className="text-lg font-bold text-cream mb-2">Instalar en tu iPhone</h3>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              Sigue estos 2 simples pasos desde Safari para tener Ayudarte en tu pantalla de inicio:
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 bg-surface-2 p-3.5 rounded-2xl border border-line">
                <div className="p-2 bg-night rounded-xl text-star shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-cream block mb-0.5">Paso 1:</span>
                  <span className="text-muted">Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-surface-2 p-3.5 rounded-2xl border border-line">
                <div className="p-2 bg-night rounded-xl text-warmth shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-cream block mb-0.5">Paso 2:</span>
                  <span className="text-muted">Baja y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-3 bg-star text-night font-bold text-sm rounded-xl"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
