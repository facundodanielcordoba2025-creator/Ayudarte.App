"use client";
import { toast } from "react-hot-toast";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, HandHeart, X, ShieldCheck } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { EVENTUAL_CATEGORIES, type EventualCategory } from "@/hooks/useEventualHelps";

export default function AyudaEventualPage() {
  const router = useRouter();
  const [category, setCategory] = useState<EventualCategory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isForMe, setIsForMe] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, 3 - files.length);
    setFiles(prev => [...prev, ...selected]);
    selected.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!category) return toast("Elegí qué tipo de ayuda necesitás.");
    if (!title.trim() || !description.trim()) return toast("Completá el título y contanos tu situación.");

    const userId = localStorage.getItem("ayudarte_user_id");
    if (!userId) {
      toast("Para pedir una ayuda primero tenés que registrarte o iniciar sesión.");
      setIsAuthOpen(true);
      return;
    }

    setIsPublishing(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, addDoc, getDoc, getDocs, doc, query, where } = await import("firebase/firestore");
      const { uploadToCloudinary } = await import("@/lib/cloudinary");

      // Una sola ayuda activa por persona, para repartir el fondo de forma justa.
      const existing = await getDocs(query(collection(db, "eventualHelps"), where("userId", "==", userId)));
      const hasActive = existing.docs.some(d => ["pendiente", "aprobada"].includes(d.data().status));
      if (hasActive) {
        toast("Ya tenés un pedido de ayuda activo. Cuando se resuelva vas a poder cargar otro.");
        return;
      }

      const userSnap = await getDoc(doc(db, "users", userId));
      const user = userSnap.exists() ? userSnap.data() : {};

      const media: string[] = [];
      for (const file of files) media.push(await uploadToCloudinary(file));

      await addDoc(collection(db, "eventualHelps"), {
        category,
        title: title.trim(),
        description: description.trim(),
        amountNeeded: amount ? Number(amount) : null,
        isForMe,
        media,
        status: "pendiente",
        createdAt: Date.now(),
        userId,
        userName: user.name || null,
        userProvincia: user.provincia || null,
      });

      toast("¡Recibimos tu pedido! Nuestro equipo lo va a revisar y te avisamos cuando esté publicado.");
      router.push("/perfil");
    } catch (error) {
      console.error(error);
      toast("Hubo un error al enviar tu pedido. Probá de nuevo en unos minutos.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pb-28 min-h-screen bg-night animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 bg-surface border-b border-line sticky top-0 z-40 flex items-center gap-4">
        <Link href="/perfil" className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-cream shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-cream">Necesito una ayuda</h1>
          <p className="text-xs text-muted">Para necesidades del día a día</p>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        <div className="bg-surface border border-star/30 rounded-2xl p-4 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-star shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            Una parte de lo recaudado por la comunidad se destina a cubrir necesidades básicas. Revisamos cada pedido antes de publicarlo para que la ayuda llegue a quien realmente la necesita.
          </p>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">¿Qué necesitás?</label>
          <div className="grid grid-cols-2 gap-3">
            {EVENTUAL_CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-2 border rounded-xl px-3 py-3 text-sm font-medium text-left transition-colors ${category === c.id ? "border-star bg-star/10 text-star" : "border-line bg-surface text-muted"} ${c.id === "otro" ? "col-span-2" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Para quién */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">¿Para quién es?</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setIsForMe(true)} className={`border rounded-xl py-2.5 text-sm font-medium ${isForMe ? "border-star bg-star/10 text-star" : "border-line bg-surface text-muted"}`}>Para mí</button>
            <button type="button" onClick={() => setIsForMe(false)} className={`border rounded-xl py-2.5 text-sm font-medium ${!isForMe ? "border-star bg-star/10 text-star" : "border-line bg-surface text-muted"}`}>Para alguien más</button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Título</label>
          <input
            type="text"
            value={title}
            maxLength={80}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ej. Pagar la factura de luz de este mes"
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Contanos tu situación</label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="¿Qué está pasando y cómo te ayudaría esto?"
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted/50 focus:outline-none focus:border-star resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Monto aproximado (opcional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-surface border border-line rounded-xl pl-8 pr-4 py-3 text-cream text-sm focus:outline-none focus:border-star"
            />
          </div>
        </div>

        {/* Comprobantes */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Foto o comprobante (opcional)</label>
          <p className="text-[11px] text-muted mb-3">Una factura, receta médica o foto ayuda a verificar el pedido más rápido. Máximo 3.</p>
          {files.length < 3 && (
            <label className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-dashed border-line rounded-xl p-4 text-cream cursor-pointer">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              <Camera className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Agregar foto</span>
            </label>
          )}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-line">
                  <img src={src} alt="Comprobante" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPublishing}
          className="w-full flex items-center justify-center gap-2 bg-star text-night py-4 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          <HandHeart className="w-5 h-5" />
          {isPublishing ? "ENVIANDO..." : "ENVIAR PEDIDO DE AYUDA"}
        </button>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
