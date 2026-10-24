"use client";

import { useState, useEffect } from "react";
import { X, Camera, Video, UploadCloud, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "react-hot-toast";

interface EditDreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  dream: {
    id: string;
    title: string;
    history: string;
    media?: string[];
  } | null;
}

export function EditDreamModal({ isOpen, onClose, dream }: EditDreamModalProps) {
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState("");
  const [existingMedia, setExistingMedia] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dream) {
      setTitle(dream.title || "");
      setHistory(dream.history || "");
      setExistingMedia(dream.media || []);
      setNewFiles([]);
      setNewPreviews([]);
    }
  }, [dream, isOpen]);

  if (!isOpen || !dream) return null;

  const totalMediaCount = existingMedia.length + newFiles.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const availableSlots = 8 - totalMediaCount;
      if (availableSlots <= 0) {
        toast.error("Has alcanzado el límite máximo de 8 archivos.");
        return;
      }
      const filesToProcess = filesArray.slice(0, availableSlots);

      setNewFiles(prev => [...prev, ...filesToProcess]);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || !history.trim()) {
      toast.error("Por favor completa el título y la historia.");
      return;
    }

    if (totalMediaCount < 4) {
      toast.error("Por medidas de seguridad debemos asegurarnos que la historia es verdadera, al menos sube 4 archivos.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Guardando cambios y subiendo fotos...");

    try {
      const newlyUploadedUrls: string[] = [];
      for (const file of newFiles) {
        try {
          const url = await uploadToCloudinary(file);
          newlyUploadedUrls.push(url);
        } catch (uploadErr) {
          console.warn("Error subiendo archivo:", uploadErr);
        }
      }

      const finalMedia = [...existingMedia, ...newlyUploadedUrls];

      await updateDoc(doc(db, "dreams", dream.id), {
        title: title.trim(),
        history: history.trim(),
        media: finalMedia,
        updatedAt: Date.now(),
      });

      toast.success("¡Publicación actualizada con éxito!", { id: toastId });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al guardar los cambios.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-night/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-line rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative p-6 space-y-5 hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-cream text-lg">Editar Mi Publicación</h3>
            <p className="text-xs text-muted mt-0.5">Actualiza el título, historia o suma evidencias multimedia</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-line border border-line rounded-full text-muted hover:text-cream transition-all"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de Seguridad Antifraude */}
        <div className="bg-surface-2 border border-star/40 rounded-2xl p-3.5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-star shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-cream">Regla de Verificación: </span>
            <span className="text-muted">
              Por medidas de seguridad para garantizar que la causa es real, <strong className="text-star">se requieren al menos 4 archivos</strong> (fotos y/o videos).
            </span>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
            Título de tu sueño
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-2 border border-line rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-star transition-all"
            placeholder="Ej. Me gustaría tener mi casa propia..."
          />
        </div>

        {/* Historia */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
            Tu historia completa
          </label>
          <textarea
            rows={5}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-cream text-sm focus:outline-none focus:border-star transition-all resize-none leading-relaxed"
            placeholder="Cuenta los detalles de tu historia..."
          />
        </div>

        {/* Archivos multimedia */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted uppercase tracking-wide">Archivos Multimedia ({totalMediaCount}/4 mín.)</span>
            <span className={totalMediaCount >= 4 ? "text-star font-bold" : "text-amber-400 font-bold"}>
              {totalMediaCount >= 4 ? "✓ Requisito cumplido" : `Faltan ${4 - totalMediaCount} archivo(s)`}
            </span>
          </div>

          {/* Galería actual */}
          {totalMediaCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Fotos ya guardadas en Firestore */}
              {existingMedia.map((url, idx) => {
                const isVideo = url.includes("video") || url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov");
                return (
                  <div key={`existing-${idx}`} className="relative h-24 rounded-xl overflow-hidden border border-line bg-night group">
                    {isVideo ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt="Evidencia" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingMedia(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-night/80 text-[9px] px-1.5 py-0.5 rounded text-muted">
                      Guardada
                    </span>
                  </div>
                );
              })}

              {/* Nuevas fotos pendientes de subir */}
              {newPreviews.map((previewUrl, idx) => (
                <div key={`new-${idx}`} className="relative h-24 rounded-xl overflow-hidden border border-star/50 bg-night group">
                  <img src={previewUrl} alt="Nueva" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                    title="Quitar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-star text-night font-bold text-[9px] px-1.5 py-0.5 rounded">
                    Nueva
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Botones para agregar nuevas fotos / videos */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center justify-center gap-2 bg-surface-2 border border-line border-dashed rounded-xl p-3 text-muted hover:border-star hover:text-star transition-colors cursor-pointer text-xs font-semibold">
              <input type="file" accept="image/*" capture="environment" className="opacity-0 absolute w-0 h-0" onChange={handleFileChange} />
              <Camera className="w-4 h-4" />
              <span>Sacar Foto</span>
            </label>

            <label className="flex items-center justify-center gap-2 bg-surface-2 border border-line border-dashed rounded-xl p-3 text-muted hover:border-star hover:text-star transition-colors cursor-pointer text-xs font-semibold">
              <input type="file" accept="image/*,video/*" multiple className="opacity-0 absolute w-0 h-0" onChange={handleFileChange} />
              <UploadCloud className="w-4 h-4" />
              <span>Galería</span>
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-3 border-t border-line flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-surface-2 hover:bg-line text-cream rounded-xl font-bold text-sm transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-star text-night rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
