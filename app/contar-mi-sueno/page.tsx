"use client";

import { useState } from "react";
import { Camera, Video, UploadCloud, ChevronRight, Star } from "lucide-react";

export default function ContarMiSuenoPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] pb-20">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 border-b border-line bg-surface/50 sticky top-0 z-10 backdrop-blur-md">
        <h1 className="font-display text-2xl font-semibold text-cream">
          Contá tu sueño
        </h1>
        <p className="mt-1 text-xs text-muted">
          Paso {step} de 3: {step === 1 ? 'Tu historia' : step === 2 ? 'Multimedia' : 'Revisión'}
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-surface-2 h-1.5 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-star h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-6 pt-6 flex-1">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                Título del sueño
              </label>
              <input 
                type="text"
                placeholder="Ej. Una silla de ruedas para Mica..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star focus:ring-1 focus:ring-star transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                ¿Para quién es?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button className="border border-star bg-star/10 text-star rounded-xl py-2.5 text-sm font-medium transition-colors">
                  Para mí
                </button>
                <button className="border border-line bg-surface text-muted rounded-xl py-2.5 text-sm font-medium hover:border-muted transition-colors">
                  Para alguien más
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                Contanos la historia
              </label>
              <textarea 
                rows={5}
                placeholder="¿Por qué es importante este sueño? ¿Qué cambiaría en la vida de la persona si se hace realidad?"
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star focus:ring-1 focus:ring-star transition-all resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <p className="text-sm text-cream leading-relaxed">
              Una imagen o un video vale más que mil palabras. Las historias con fotos tienen un <span className="text-star font-semibold">70% más de chances</span> de cumplirse.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-xs font-medium">Sacar Foto</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors">
                <Video className="w-8 h-8" />
                <span className="text-xs font-medium">Grabar Video</span>
              </button>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-line rounded-xl p-4 text-cream hover:bg-surface transition-colors">
              <UploadCloud className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Subir desde la galería</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center py-10">
            <div className="w-20 h-20 bg-star/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-star" fill="currentColor" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-cream">
              ¡Casi listo!
            </h2>
            <p className="text-sm text-muted max-w-[250px] mx-auto">
              Tu historia está a un paso de publicarse. Unimos fuerzas para que los sueños se hagan realidad.
            </p>
          </div>
        )}
      </div>

      {/* Fixed bottom actions */}
      <div className="px-6 py-4 bg-night mt-auto">
        <div className="flex gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-6 py-3.5 rounded-xl border border-line text-cream text-sm font-semibold active:scale-95 transition-transform"
            >
              Atrás
            </button>
          )}
          <button 
            onClick={() => {
              if (step < 3) setStep(step + 1);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-star text-night px-6 py-3.5 rounded-xl font-semibold text-sm shadow-[0_8px_24px_rgba(255,182,72,0.3)] active:scale-95 transition-transform"
          >
            {step === 3 ? "PUBLICAR SUEÑO" : "Siguiente"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
