"use client";

import { useState, useRef } from "react";
import { Camera, Video, UploadCloud, ChevronRight, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContarMiSuenoPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [isForMe, setIsForMe] = useState(true);
  const [history, setHistory] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const availableSlots = 4 - media.length;
      const filesToProcess = filesArray.slice(0, availableSlots);

      setMedia(prev => [...prev, ...filesToProcess]);
      
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !history.trim()) {
      alert("Por favor completa el título y la historia.");
      return;
    }

    setIsPublishing(true);

    try {
      const { storage, db } = await import('@/lib/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const uploadedUrls = [];
      for (const file of media) {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const storageRef = ref(storage, `suenos/${uniqueName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      await addDoc(collection(db, 'dreams'), {
        title,
        history,
        isForMe,
        media: uploadedUrls,
        createdAt: Date.now(),
      });
      
      
      router.push("/suenos");
    } catch (error) {
      console.error(error);
      setHistory("ERROR: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsPublishing(false);
    }
  };

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Una silla de ruedas para Mica..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star focus:ring-1 focus:ring-star transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                ¿Para quién es?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsForMe(true)}
                  className={`border rounded-xl py-2.5 text-sm font-medium transition-colors ${isForMe ? 'border-star bg-star/10 text-star' : 'border-line bg-surface text-muted hover:border-muted'}`}
                >
                  Para mí
                </button>
                <button 
                  onClick={() => setIsForMe(false)}
                  className={`border rounded-xl py-2.5 text-sm font-medium transition-colors ${!isForMe ? 'border-star bg-star/10 text-star' : 'border-line bg-surface text-muted hover:border-muted'}`}
                >
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
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="¿Por qué es importante este sueño? ¿Qué cambiaría en la vida de la persona si se hace realidad?"
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star focus:ring-1 focus:ring-star transition-all resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <p className="text-sm text-cream leading-relaxed">
              Una imagen o un video vale más que mil palabras. Las historias con fotos tienen un <span className="text-star font-semibold">70% más de chances</span> de cumplirse (Máx 60s o 4 archivos).
            </p>
            
            <input type="file" accept="image/*,video/*" multiple className="opacity-0 w-0 h-0 absolute" ref={fileInputRef} onChange={handleFileChange} />
            <input type="file" accept="image/*" capture="environment" className="opacity-0 w-0 h-0 absolute" ref={cameraInputRef} onChange={handleFileChange} />
            <input type="file" accept="video/*" capture="environment" className="opacity-0 w-0 h-0 absolute" ref={videoInputRef} onChange={handleFileChange} />

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-xs font-medium">Sacar Foto</span>
              </button>
              <button onClick={() => videoInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors">
                <Video className="w-8 h-8" />
                <span className="text-xs font-medium">Grabar Video</span>
              </button>
            </div>
            
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-line rounded-xl p-4 text-cream hover:bg-surface transition-colors">
              <UploadCloud className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Subir desde la galería</span>
            </button>

            {/* Previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {mediaPreviews.map((url, idx) => (
                  <div key={idx} className="w-full h-32 rounded-2xl border border-line/50 relative overflow-hidden group">
                    {url.includes("video") || url.startsWith("data:video") ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt="Previsualización" className="w-full h-full object-cover" />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isPublishing}
            >
              Atrás
            </button>
          )}
          <button 
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else handleSubmit();
            }}
            disabled={isPublishing}
            className="flex-1 flex items-center justify-center gap-2 bg-star text-night px-6 py-3.5 rounded-xl font-semibold text-sm shadow-[0_8px_24px_rgba(255,182,72,0.3)] active:scale-95 transition-transform disabled:opacity-50"
          >
            {step === 3 ? (isPublishing ? "PUBLICANDO..." : "PUBLICAR SUEÑO") : "Siguiente"}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
