"use client";

import { useState, useEffect } from "react";
import { CreditCard, Save, ChevronDown, ChevronUp, UserCheck, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BankDataSectionProps {
  userId: string;
  userData: any;
}

export function BankDataSection({ userId, userData }: BankDataSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [alias, setAlias] = useState(userData?.alias || "");
  const [cbu, setCbu] = useState(userData?.cbu || "");
  const [bankOwnerName, setBankOwnerName] = useState(userData?.bankOwnerName || userData?.name || "");
  const [bankOwnerDni, setBankOwnerDni] = useState(userData?.bankOwnerDni || "");
  const [bankName, setBankName] = useState(userData?.bankName || "");

  useEffect(() => {
    if (userData) {
      if (userData.alias) setAlias(userData.alias);
      if (userData.cbu) setCbu(userData.cbu);
      if (userData.bankOwnerName) setBankOwnerName(userData.bankOwnerName);
      else if (userData.name && !bankOwnerName) setBankOwnerName(userData.name);
      if (userData.bankOwnerDni) setBankOwnerDni(userData.bankOwnerDni);
      if (userData.bankName) setBankName(userData.bankName);
    }
  }, [userData]);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        alias: alias.trim(),
        cbu: cbu.trim(),
        bankOwnerName: bankOwnerName.trim(),
        bankOwnerDni: bankOwnerDni.trim(),
        bankName: bankName.trim(),
        updatedAt: Date.now(),
      });
      toast.success("¡Datos bancarios guardados con éxito!");
    } catch (err) {
      console.error("Error guardando datos bancarios:", err);
      toast.error("No se pudieron guardar los datos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-3xl p-5 sm:p-6 shadow-sm">
      {/* Encabezado colapsable */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-star/15 border border-star/30 flex items-center justify-center text-star shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-cream text-base">Datos de Cobro Directo</h3>
            <p className="text-xs text-muted">Alias, CBU, Nombre y DNI del titular de la cuenta</p>
          </div>
        </div>
        <button 
          type="button" 
          className="text-muted hover:text-cream p-1 transition-colors"
          aria-label={isOpen ? "Ocultar" : "Mostrar"}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-4 pt-4 border-t border-line/50 animate-in fade-in">
          <div className="bg-night/60 border border-line rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-star shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted leading-relaxed">
              Cuando alguien quiera ayudarte, verá estos datos para confirmar en su app bancaria o billetera que la transferencia va a tu nombre y DNI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Alias */}
            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Alias (CBU / CVU)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="ej: mateo.ruedas.mp"
                className="w-full bg-night border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              />
            </div>

            {/* CBU / CVU numérico opcional */}
            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                CBU / CVU (22 dígitos)
              </label>
              <input
                type="text"
                value={cbu}
                onChange={(e) => setCbu(e.target.value)}
                placeholder="0000003100098472619022"
                className="w-full bg-night border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors font-mono text-xs"
              />
            </div>

            {/* Nombre y Apellido del Titular */}
            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Nombre y Apellido del titular
              </label>
              <input
                type="text"
                value={bankOwnerName}
                onChange={(e) => setBankOwnerName(e.target.value)}
                placeholder="Tal como figura en el banco"
                className="w-full bg-night border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              />
            </div>

            {/* DNI o CUIL */}
            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                DNI / CUIT del titular
              </label>
              <input
                type="text"
                value={bankOwnerDni}
                onChange={(e) => setBankOwnerDni(e.target.value)}
                placeholder="ej: 34.567.890"
                className="w-full bg-night border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              />
            </div>

            {/* Banco / Billetera */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                Banco o Billetera Virtual (opcional)
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="ej: Mercado Pago, Banco Nación, Galicia, Ualá"
                className="w-full bg-night border border-line focus:border-star text-cream text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="w-full mt-2 py-3 bg-star hover:bg-star-dim disabled:opacity-50 text-night font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <Save className="w-4 h-4 text-night" />
            {isSaving ? "Guardando datos..." : "Guardar datos de cobro"}
          </button>
        </div>
      )}
    </div>
  );
}
