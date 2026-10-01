"use client";

import { useState, useRef } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ArrowLeft, Camera, Gift, Info, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGifts } from "@/hooks/useGifts";

export default function RegalarPage() {
  const router = useRouter();
  const { addGift } = useGifts();
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemState, setItemState] = useState("Usado");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const availableSlots = 4 - images.length;
      const filesToProcess = filesArray.slice(0, availableSlots);

      setImages(prev => [...prev, ...filesToProcess]);
      
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Por favor completa el título y la descripción.");
      return;
    }
    if (images.length === 0) {
      alert("Por favor, sube al menos 1 foto del regalo.");
      return;
    }

    setIsPublishing(true);

    try {
      // 1. Subir las imágenes a Firebase Storage
      const { storage } = await import('@/lib/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const uploadedUrls = [];
      for (const file of images) {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const storageRef = ref(storage, `regalos/${uniqueName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      // 2. Guardar en Firestore
      await addGift({
        title,
        description,
        state: itemState,
        images: uploadedUrls,
      });
      
      alert("¡Regalo publicado con éxito!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al publicar. ¿Activaste Firestore y Storage?");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-night animate-in slide-in-from-right-4 duration-500">
      <div className="px-6 pt-10 pb-4 bg-surface border-b border-line sticky top-0 z-20 shadow-sm flex items-center gap-4">
        <Link href="/donadores" className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-cream hover:bg-line transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-cream flex items-center gap-2">
            <Gift className="w-5 h-5 text-star" />
            {isPublishing ? "Publicando..." : "Publicar Regalo"}
          </h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-surface-2 rounded-2xl border border-line p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-warmth shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            Sube fotos claras o un video corto (máx 60s) del objeto (hasta 4 archivos). Recuerda que debe estar en buen estado y ser útil para otra persona.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-cream">Fotos del Objeto</label>
              <span className="text-xs text-muted font-medium">{images.length}/4 adjuntas</span>
            </div>
            
            <input 
              type="file" 
              accept="image/*,video/*"
              multiple 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <div className="grid grid-cols-2 gap-3">
              {images.length < 4 && (
                <div 
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-line bg-surface hover:bg-surface-2 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-star font-bold text-xs text-center px-2">Agregar Foto</span>
                </div>
              )}

              {imagePreviews.map((imgUrl, idx) => (
                <div key={idx} className="w-full h-32 rounded-2xl border border-line/50 relative overflow-hidden group">
                  <img src={imgUrl} alt={`Previsualización ${idx + 1}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">¿Qué estás regalando?</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Bicicleta rodado 16, Libros escolares..."
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-cream placeholder:text-muted/50 focus:outline-none focus:border-star transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">Estado del objeto</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 bg-surface border border-line rounded-xl px-4 py-3 cursor-pointer has-[:checked]:border-star has-[:checked]:bg-star/5 transition-colors">
                <input 
                  type="radio" 
                  name="estado" 
                  className="accent-star" 
                  checked={itemState === "Usado"}
                  onChange={() => setItemState("Usado")}
                />
                <span className="text-sm text-cream font-medium">Usado (Buen)</span>
              </label>
              <label className="flex items-center gap-3 bg-surface border border-line rounded-xl px-4 py-3 cursor-pointer has-[:checked]:border-star has-[:checked]:bg-star/5 transition-colors">
                <input 
                  type="radio" 
                  name="estado" 
                  className="accent-star" 
                  checked={itemState === "Nuevo"}
                  onChange={() => setItemState("Nuevo")}
                />
                <span className="text-sm text-cream font-medium">Nuevo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-cream mb-2">Detalles adicionales</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalles, si tiene alguna falla menor, o por qué zona se retiraría..."
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-cream placeholder:text-muted/50 focus:outline-none focus:border-star transition-colors resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-star text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4"
          >
            {isPublishing ? "Publicando..." : "Publicar Regalo"}
            <Gift className="w-5 h-5" />
          </button>
        </form>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => window.location.reload()} />
    </div>
  );
}
