"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Package, ShieldCheck, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { AuthModal } from "@/components/AuthModal";

export default function OfrecerDonacionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 3) {
        return toast("Máximo 3 imágenes");
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return toast("Por favor completa el título y la descripción del ofrecimiento.");

    const userId = localStorage.getItem("ayudarte_user_id");
    if (!userId) {
      toast("Para publicar debes iniciar sesión.");
      setIsAuthOpen(true);
      return;
    }

    setIsPublishing(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, getDoc, doc } = await import("firebase/firestore");
      const { uploadToCloudinary } = await import("@/lib/cloudinary");

      const userSnap = await getDoc(doc(db, "users", userId));
      const user = userSnap.exists() ? userSnap.data() : {};

      if (!user.isCompany) {
        toast("Solo las empresas registradas pueden publicar ofrecimientos masivos por ahora.");
        setIsPublishing(false);
        return;
      }

      const media: string[] = [];
      for (const file of files) media.push(await uploadToCloudinary(file));

      await addDoc(collection(db, "companyOffers"), {
        title: title.trim(),
        description: description.trim(),
        media,
        status: "activa",
        createdAt: Date.now(),
        userId,
        companyName: user.companyName || user.name || "Empresa Solidaria",
        companyLogo: user.companyLogo || null,
        userProvincia: user.provincia || null,
      });

      toast("¡Donación publicada con éxito! Ya está disponible en el Mercado Solidario.");
      router.push("/perfil");
    } catch (error) {
      console.error(error);
      toast("Hubo un error al publicar. Probá de nuevo en unos minutos.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-night animate-in slide-in-from-right-4 duration-500">
      <div className="px-6 pt-10 pb-4 bg-surface border-b border-line sticky top-0 z-40 flex items-center gap-4">
        <Link href="/perfil" className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-cream shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-cream text-lg">Ofrecer Donación</h1>
          <p className="text-xs text-star font-bold">Exclusivo Empresas</p>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        <div className="bg-gradient-to-r from-star/20 to-surface-2 border border-star/30 p-4 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-star shrink-0 mt-0.5" />
          <p className="text-xs text-cream/90 leading-relaxed">
            Publica stock sobrante o donaciones físicas (ej. zapatillas, alimentos, muebles). La comunidad podrá solicitarlo y tú decides a quién ayudar.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Título de la Donación</label>
          <input 
            type="text" 
            placeholder="Ej: Lote de 30 pares de zapatillas nuevas" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface border border-line rounded-xl p-4 text-cream focus:border-star focus:outline-none placeholder:text-muted"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Descripción Detallada</label>
          <textarea 
            placeholder="Describe los talles, el estado, etc." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 bg-surface border border-line rounded-xl p-4 text-cream focus:border-star focus:outline-none resize-none placeholder:text-muted"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Fotos (Hasta 3)</label>
          
          {files.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
              {files.map((file, i) => (
                <div key={i} className="relative shrink-0">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-24 h-24 rounded-xl object-cover border border-line" />
                  <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < 3 && (
            <label className="border-2 border-dashed border-line bg-surface hover:bg-surface-2 transition-colors rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer w-full">
              <Camera className="w-6 h-6 text-muted" />
              <span className="text-sm font-bold text-cream">Añadir Foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
            </label>
          )}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isPublishing}
          className="w-full bg-star text-night font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform disabled:opacity-50"
        >
          {isPublishing ? "Publicando donación..." : "PUBLICAR EN MERCADO SOLIDARIO"}
        </button>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
