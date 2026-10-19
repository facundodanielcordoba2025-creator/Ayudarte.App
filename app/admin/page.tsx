"use client";

import { useEffect, useState } from "react";
import { 
  Users, Star, Gift, Search, Trash2, Shield, HandHeart, Package, CheckCircle, 
  Briefcase, UserCheck, ShieldCheck, AlertCircle, Sparkles, MessageSquare,
  Plus, X, UserPlus, Bell, Send, Smartphone, CheckCheck, Radio, Volume2,
  CheckCircle2, ExternalLink, CreditCard, MessageCircle, Phone
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { 
  type EventualHelp, type EventualStatus, categoryInfo, EVENTUAL_STATUS_LABEL,
  URGENCY_LEVELS, getUrgencyInfo 
} from "@/hooks/useEventualHelps";
import { getSocialUrl } from "@/lib/verification";
import { db } from "@/lib/firebase";

function UrgencyRatingBlock({
  itemId,
  currentStars,
  currentLabel,
  currentNotes,
  evaluatorName,
  evaluatedAt,
  onSave,
}: {
  itemId: string;
  currentStars?: number;
  currentLabel?: string;
  currentNotes?: string;
  evaluatorName?: string;
  evaluatedAt?: number;
  onSave: (stars: number, notes: string) => Promise<void>;
}) {
  const [selectedStars, setSelectedStars] = useState(currentStars || 0);
  const [notes, setNotes] = useState(currentNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedStars(currentStars || 0);
    setNotes(currentNotes || "");
  }, [currentStars, currentNotes]);

  const activeLevel = getUrgencyInfo(selectedStars);

  return (
    <div className="mt-4 p-4 bg-surface rounded-2xl border border-line shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-star fill-star" />
          <span className="text-xs font-bold text-cream">Triage del Equipo (Calificar Urgencia)</span>
        </div>
        {currentStars ? (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${activeLevel?.badgeBg} ${activeLevel?.textColor} ${activeLevel?.borderColor} flex items-center gap-1.5`}>
            <span>{"⭐".repeat(currentStars)}</span>
            <span>{currentLabel || activeLevel?.label}</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-line">
            ⚠️ Pendiente de calificar
          </span>
        )}
      </div>

      {/* 5 estrellas interactivas */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <div className="flex items-center gap-1 bg-surface-2 p-1.5 rounded-xl border border-line/60">
          {[1, 2, 3, 4, 5].map((s) => {
            const isFilled = selectedStars >= s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStars(s)}
                className={`p-1.5 rounded-lg transition-transform active:scale-90 ${isFilled ? "text-star scale-105" : "text-muted hover:text-cream"}`}
                title={`${s} estrellas: ${URGENCY_LEVELS[s - 1]?.label}`}
              >
                <Star className={`w-5 h-5 ${isFilled ? "fill-star text-star" : ""}`} />
              </button>
            );
          })}
        </div>

        {selectedStars > 0 && activeLevel && (
          <span className={`text-xs font-bold ${activeLevel.textColor}`}>
            {selectedStars} ⭐ — {activeLevel.label}
          </span>
        )}
      </div>

      {/* Nota interna y botón de guardar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nota interna de auditoría (ej. Receta verificada, corte inminente)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="flex-1 bg-surface-2 border border-line rounded-xl px-3 py-2 text-xs text-cream placeholder:text-muted focus:outline-none focus:border-star"
        />
        <button
          type="button"
          disabled={isSaving || selectedStars === 0}
          onClick={async () => {
            setIsSaving(true);
            await onSave(selectedStars, notes);
            setIsSaving(false);
          }}
          className="px-4 py-2 bg-star text-night font-bold text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          {isSaving ? "Guardando..." : "Guardar Calificación ⭐"}
        </button>
      </div>

      {evaluatorName && evaluatedAt && (
        <p className="text-[10px] text-muted mt-2.5 flex items-center gap-1.5">
          <span>✓ Auditado por <strong className="text-cream">{evaluatorName}</strong></span>
          <span>•</span>
          <span>{new Date(evaluatedAt).toLocaleString("es-AR")}</span>
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("eventuales");
  const [users, setUsers] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [eventual, setEventual] = useState<EventualHelp[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Búsquedas
  const [userSearch, setUserSearch] = useState("");
  const [rrhhSearch, setRrhhSearch] = useState("");

  // Alta de nuevo empleado / colaborador
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpPhone, setNewEmpPhone] = useState("");
  const [newEmpProvincia, setNewEmpProvincia] = useState("Salta");
  const [newEmpRole, setNewEmpRole] = useState<"evaluador" | "admin">("evaluador");
  const [isAddingEmp, setIsAddingEmp] = useState(false);

  // Notificaciones Push
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushUrl, setPushUrl] = useState("/");
  const [isSendingPush, setIsSendingPush] = useState(false);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpEmail.trim() || !newEmpName.trim()) {
      return toast("Por favor ingresa nombre y correo electrónico.");
    }

    setIsAddingEmp(true);
    try {
      const cleanEmail = newEmpEmail.trim().toLowerCase();
      const existing = users.find(u => u.email?.toLowerCase() === cleanEmail);
      if (existing) {
        await updateDoc(doc(db, "users", existing.id), {
          role: newEmpRole,
          name: newEmpName.trim(),
          phone: newEmpPhone.trim() || existing.phone,
          provincia: newEmpProvincia || existing.provincia,
          roleUpdatedAt: Date.now()
        });
        toast.success(`El colaborador ya existía y fue actualizado a ${newEmpRole === "admin" ? "Administrador 👑" : "Evaluador / Captador ⭐"}!`);
      } else {
        await addDoc(collection(db, "users"), {
          name: newEmpName.trim(),
          email: cleanEmail,
          phone: newEmpPhone.trim(),
          provincia: newEmpProvincia,
          role: newEmpRole,
          createdAt: Date.now(),
          createdBy: currentUser?.email || "Admin",
        });
        toast.success(`¡Colaborador ${newEmpName} dado de alta como ${newEmpRole === "admin" ? "Admin 👑" : "Evaluador ⭐"}!`);
      }

      setShowAddEmployeeModal(false);
      setNewEmpName("");
      setNewEmpEmail("");
      setNewEmpPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar colaborador.");
    } finally {
      setIsAddingEmp(false);
    }
  };

  useEffect(() => {
    // Escuchar Usuarios
    const qUsers = query(collection(db, "users"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(loaded);

      // Obtener usuario actual desde localStorage
      const uid = localStorage.getItem("ayudarte_user_id");
      if (uid) {
        const found = loaded.find(u => u.id === uid);
        if (found) setCurrentUser(found);
      }
      setIsAuthChecking(false);
    });

    // Escuchar Sueños
    const qDreams = query(collection(db, "dreams"), orderBy("createdAt", "desc"));
    const unsubDreams = onSnapshot(qDreams, (snap) => {
      setDreams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qConns = query(collection(db, "connections"), orderBy("createdAt", "desc"));
    const unsubConns = onSnapshot(qConns, (snap) => {
      setConnections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qEventual = query(collection(db, "eventualHelps"), orderBy("createdAt", "desc"));
    const unsubEventual = onSnapshot(qEventual, (snap) => {
      setEventual(snap.docs.map(d => ({ id: d.id, ...d.data() }) as EventualHelp));
    });

    const qOffers = query(collection(db, "companyOffers"), orderBy("createdAt", "desc"));
    const unsubOffers = onSnapshot(qOffers, (snap) => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Escuchar Suscriptores de Notificaciones Push
    const qPush = query(collection(db, "push_subscriptions"), orderBy("createdAt", "desc"));
    const unsubPush = onSnapshot(qPush, (snap) => {
      setSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUsers(); unsubDreams(); unsubConns(); unsubEventual(); unsubOffers(); unsubPush(); };
  }, []);

  const handleSendBroadcastPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      return toast.error("Por favor completá el título y el mensaje.");
    }
    setIsSendingPush(true);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pushTitle.trim(),
          body: pushBody.trim(),
          url: pushUrl.trim() || "/"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      toast.success(`¡Notificación enviada! Llegó a ${data.sentCount} dispositivo(s).`);
      setPushTitle("");
      setPushBody("");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error al enviar la notificación.");
    } finally {
      setIsSendingPush(false);
    }
  };

  const deleteDream = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este sueño?")) {
      await deleteDoc(doc(db, "dreams", id));
      toast.success("Sueño eliminado.");
    }
  };

  const setEventualStatus = async (id: string, status: EventualStatus) => {
    await updateDoc(doc(db, "eventualHelps", id), { status, reviewedAt: Date.now() });
    toast.success(`Estado cambiado a: ${EVENTUAL_STATUS_LABEL[status] ?? status}`);
  };

  const deleteEventual = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este pedido de ayuda?")) {
      await deleteDoc(doc(db, "eventualHelps", id));
      toast.success("Pedido eliminado.");
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este usuario? Perderá el acceso.")) {
      await deleteDoc(doc(db, "users", id));
      toast.success("Usuario eliminado.");
    }
  };

  // Guardar calificación de estrellas para Ayudas Eventuales
  const handleSaveEventualUrgency = async (id: string, stars: number, notes: string) => {
    const info = getUrgencyInfo(stars);
    try {
      await updateDoc(doc(db, "eventualHelps", id), {
        urgencyStars: stars,
        urgencyLabel: info?.label || "",
        urgencyNotes: notes,
        urgencyEvaluatorName: currentUser?.name || currentUser?.email || "Captador Ayudarte",
        urgencyEvaluatorId: currentUser?.id || "equipo",
        urgencyEvaluatedAt: Date.now(),
      });
      toast.success(`¡Calificado con ${stars} estrellas (${info?.shortLabel})!`);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar calificación.");
    }
  };

  // Guardar calificación de estrellas para Sueños
  const handleSaveDreamUrgency = async (id: string, stars: number, notes: string) => {
    const info = getUrgencyInfo(stars);
    try {
      await updateDoc(doc(db, "dreams", id), {
        urgencyStars: stars,
        urgencyLabel: info?.label || "",
        urgencyNotes: notes,
        urgencyEvaluatorName: currentUser?.name || currentUser?.email || "Captador Ayudarte",
        urgencyEvaluatorId: currentUser?.id || "equipo",
        urgencyEvaluatedAt: Date.now(),
      });
      toast.success(`¡Sueño calificado con ${stars} estrellas!`);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar calificación.");
    }
  };

  // Cambiar rol de usuario en RRHH
  const updateUserRole = async (userId: string, newRole: "admin" | "evaluador" | "usuario") => {
    try {
      await updateDoc(doc(db, "users", userId), { 
        role: newRole,
        roleUpdatedAt: Date.now()
      });
      const roleText = newRole === "admin" ? "Administrador 👑" : newRole === "evaluador" ? "Evaluador / Captador ⭐" : "Usuario Regular 👤";
      toast.success(`Rol actualizado a: ${roleText}`);
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar rol de RRHH.");
    }
  };

  // Validar o revocar la verificación oficial del usuario por parte del equipo
  const toggleUserVerification = async (targetUser: any) => {
    try {
      const nextVerified = !targetUser.isVerified;
      await updateDoc(doc(db, "users", targetUser.id), {
        isVerified: nextVerified,
        verifiedBy: currentUser?.name || currentUser?.email || "Equipo Auditor",
        verifiedAt: Date.now(),
      });
      toast.success(
        nextVerified 
          ? `¡${targetUser.name || targetUser.email} validado como Verificado!` 
          : `Verificación revocada para ${targetUser.name || targetUser.email}`
      );
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar estado de verificación.");
    }
  };

  const pendingEventual = eventual.filter(h => h.status === "pendiente").length;

  const filteredUsers = users.filter(u => {
    if (!userSearch.trim()) return true;
    const term = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.provincia?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term)
    );
  });

  const filteredRrhhUsers = users.filter(u => {
    if (!rrhhSearch.trim()) return true;
    const term = rrhhSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term) ||
      u.provincia?.toLowerCase().includes(term)
    );
  });

  const isAuthorized = 
    currentUser?.role === "admin" || 
    currentUser?.role === "evaluador" || 
    currentUser?.email?.toLowerCase() === "facundodanielcordoba@gmail.com" ||
    currentUser?.email?.toLowerCase() === "facundodanielcordoba2025@gmail.com" ||
    currentUser?.email?.toLowerCase().endsWith("@ayudarte.app");

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-star border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-surface-2 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-line flex items-center justify-center mb-4 text-star shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-cream mb-2">Panel de Control</h2>
        <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
          Debes iniciar sesión con tu cuenta de administrador o evaluador para acceder a la gestión interna de Ayudarte.App.
        </p>
        <a href="/perfil" className="px-6 py-3 bg-star text-night font-bold rounded-xl text-sm shadow-md active:scale-95 transition-transform">
          Ingresar a Mi Cuenta
        </a>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-surface-2 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-500 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-cream mb-2">Acceso Restringido</h2>
        <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
          Tu cuenta (<strong className="text-cream">{currentUser.email}</strong>) no tiene asignado un rol de evaluación o administración.
        </p>
        <a href="/" className="px-6 py-3 bg-star text-night font-bold rounded-xl text-sm shadow-md active:scale-95 transition-transform">
          Volver al Inicio
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-2 p-4 sm:p-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cream">Panel de Control</h1>
            <p className="text-sm text-muted">Centro de mando, auditoría y RRHH de Ayudarte.App</p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-line text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-muted">Conectado como:</span>
            <strong className="text-cream">{currentUser.name || currentUser.email}</strong>
            <span className="px-1.5 py-0.5 rounded-md bg-star/20 text-star text-[10px] font-bold uppercase">
              {currentUser.role || "Admin"}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <button 
          onClick={() => setActiveTab("eventuales")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "eventuales" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <HandHeart className="w-4 h-4" /> Ayudas Eventuales (Triage)
          {pendingEventual > 0 && <span className="bg-warmth text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingEventual}</span>}
        </button>

        <button 
          onClick={() => setActiveTab("suenos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "suenos" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Star className="w-4 h-4" /> Sueños Activos ({dreams.length})
        </button>

        <button 
          onClick={() => setActiveTab("rrhh")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "rrhh" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Briefcase className="w-4 h-4" /> RRHH / Equipo ({users.filter(u => u.role === "evaluador" || u.role === "admin").length})
        </button>

        <button 
          onClick={() => setActiveTab("usuarios")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "usuarios" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Users className="w-4 h-4" /> Todos los Usuarios ({users.length})
        </button>

        <button 
          onClick={() => setActiveTab("offers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "offers" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Package className="w-4 h-4" /> Mercado Solidario ({offers.filter(o => o.status === 'activa').length})
        </button>

        <button 
          onClick={() => setActiveTab("conexiones")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "conexiones" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <MessageSquare className="w-4 h-4" /> Mensajes / Conexiones ({connections.length})
        </button>

        <button 
          onClick={() => setActiveTab("push")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "push" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Bell className="w-4 h-4" /> Notificaciones Push ({subscribers.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-surface border border-line rounded-3xl p-5 shadow-xl">
        
        {/* TAB 1: AYUDAS EVENTUALES (CON CALIFICADOR DE URGENCIAS) */}
        {activeTab === "eventuales" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line">
              <div>
                <h3 className="font-bold text-cream text-base">Auditoría y Triage de Ayudas Eventuales</h3>
                <p className="text-xs text-muted">
                  Los captadores y evaluadores califican de 1 a 5 estrellas para determinar la urgencia real antes de publicar.
                </p>
              </div>
              <span className="text-xs text-muted font-bold">
                Total: {eventual.length} pedidos
              </span>
            </div>

            {eventual.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay pedidos de ayuda eventual.</p>
            ) : (
              eventual.map(h => {
                const user = users.find(u => u.id === h.userId);
                const cat = categoryInfo(h.category);
                return (
                  <div key={h.id} className="p-4 bg-surface-2 rounded-2xl border border-line/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-star/20 text-star">
                            {(() => {
                              const Icon = cat.icon;
                              return <Icon className="w-3 h-3" />;
                            })()}
                            {cat.label}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${h.status === "pendiente" ? "bg-warmth/20 text-warmth" : h.status === "rechazada" ? "bg-red-500/15 text-red-400" : "bg-surface text-muted"}`}>
                            {EVENTUAL_STATUS_LABEL[h.status] ?? h.status}
                          </span>
                          {h.urgencyStars && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              ⭐ {h.urgencyStars}/5 Urgencia
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-cream text-sm">{h.title}</h4>
                        <p className="text-xs text-muted mt-1 whitespace-pre-line">{h.description}</p>
                        {h.amountNeeded ? <p className="text-xs text-cream mt-2">Monto aprox.: <strong className="text-star">${h.amountNeeded.toLocaleString("es-AR")}</strong></p> : null}
                        {h.media?.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {h.media.map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt="Comprobante" className="w-16 h-16 object-cover rounded-lg border border-line" />
                              </a>
                            ))}
                          </div>
                        )}
                        {user && (
                          <div className="mt-3 text-xs text-muted">
                            <p><strong className="text-cream">De:</strong> {user.name} ({user.provincia}) {h.isForMe ? "" : "— pide para otra persona"}</p>
                            <p><strong className="text-cream">WhatsApp:</strong> {user.phone}</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => deleteEventual(h.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 shrink-0" title="Borrar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Calificador interactivo de 1 a 5 estrellas */}
                    <UrgencyRatingBlock
                      itemId={h.id}
                      currentStars={h.urgencyStars}
                      currentLabel={h.urgencyLabel}
                      currentNotes={h.urgencyNotes}
                      evaluatorName={h.urgencyEvaluatorName}
                      evaluatedAt={h.urgencyEvaluatedAt}
                      onSave={(stars, notes) => handleSaveEventualUrgency(h.id, stars, notes)}
                    />

                    {/* Acciones de estado */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-line/40">
                      {h.status !== "aprobada" && h.status !== "cubierta" && (
                        <button onClick={() => setEventualStatus(h.id, "aprobada")} className="px-3 py-2 rounded-lg bg-star text-night text-xs font-bold shadow hover:bg-star/90 transition-colors">
                          Aprobar y publicar
                        </button>
                      )}
                      {h.status === "aprobada" && (
                        <button onClick={() => setEventualStatus(h.id, "cubierta")} className="px-3 py-2 rounded-lg bg-star text-night text-xs font-bold shadow hover:bg-star/90 transition-colors">
                          Marcar cubierta
                        </button>
                      )}
                      {h.status === "pendiente" && (
                        <button onClick={() => setEventualStatus(h.id, "rechazada")} className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/25 transition-colors">
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SUEÑOS (TAMBIÉN CON CALIFICADOR DE URGENCIAS) */}
        {activeTab === "suenos" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line">
              <div>
                <h3 className="font-bold text-cream text-base">Sueños y Causas de la Comunidad</h3>
                <p className="text-xs text-muted">
                  Audita y califica el nivel de prioridad de cada causa para destacarla en la portada.
                </p>
              </div>
              <span className="text-xs text-muted font-bold">
                Total: {dreams.length} sueños
              </span>
            </div>

            {dreams.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay sueños publicados.</p>
            ) : (
              <div className="space-y-4">
                {dreams.map(d => (
                  <div key={d.id} className="p-4 bg-surface-2 rounded-2xl border border-line/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-star">{d.userName || "Usuario Anónimo"}</span>
                          <span className="text-[10px] text-muted">• {d.userProvincia || "Argentina"}</span>
                          {d.urgencyStars && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-star/20 text-star border border-star/30">
                              ⭐ {d.urgencyStars}/5
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-cream text-sm">{d.title}</h4>
                        <p className="text-xs text-muted mt-1 line-clamp-3">{d.history}</p>
                      </div>
                      <button onClick={() => deleteDream(d.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 shrink-0 ml-3" title="Borrar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <UrgencyRatingBlock
                      itemId={d.id}
                      currentStars={d.urgencyStars}
                      currentLabel={d.urgencyLabel}
                      currentNotes={d.urgencyNotes}
                      evaluatorName={d.urgencyEvaluatorName}
                      evaluatedAt={d.urgencyEvaluatedAt}
                      onSave={(stars, notes) => handleSaveDreamUrgency(d.id, stars, notes)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RRHH / EQUIPO DE CAPTADORES Y ROLES */}
        {activeTab === "rrhh" && (
          <div className="space-y-6">
            {/* Banner explicativo y métricas */}
            <div className="bg-gradient-to-r from-star/10 via-surface-2 to-surface-2 p-5 rounded-2xl border border-star/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-star/20 rounded-xl flex items-center justify-center text-star shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cream text-base">Gestión de RRHH y Equipo de Captadores</h3>
                    <p className="text-xs text-muted">
                      Asigna roles a tus colaboradores para que puedan auditar historias y determinar la urgencia (1 a 5 estrellas).
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="px-4 py-2.5 bg-star text-night font-bold text-xs rounded-xl shadow-lg hover:bg-star/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  Dar de alta empleado / colaborador
                </button>
              </div>

              {/* Contadores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-line/60">
                <div className="bg-surface p-3 rounded-xl border border-line text-center">
                  <p className="text-[11px] text-muted uppercase font-bold">Administradores</p>
                  <p className="text-xl font-bold text-star mt-0.5">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-line text-center">
                  <p className="text-[11px] text-muted uppercase font-bold">Evaluadores / Captadores</p>
                  <p className="text-xl font-bold text-warmth mt-0.5">
                    {users.filter(u => u.role === "evaluador").length}
                  </p>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-line text-center">
                  <p className="text-[11px] text-muted uppercase font-bold">Total Usuarios</p>
                  <p className="text-xl font-bold text-cream mt-0.5">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal para dar de alta nuevo empleado */}
            {showAddEmployeeModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-surface border border-line rounded-3xl p-6 max-w-md w-full relative shadow-2xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-star" />
                      <h3 className="font-bold text-cream text-base">Dar de alta Colaborador</h3>
                    </div>
                    <button
                      onClick={() => setShowAddEmployeeModal(false)}
                      className="p-1.5 text-muted hover:text-cream rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1.5">Nombre y Apellido *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Martín Gómez"
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        className="w-full bg-surface-2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-star"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted mb-1.5">Correo Electrónico (Gmail) *</label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@gmail.com"
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        className="w-full bg-surface-2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-star"
                      />
                      <p className="text-[11px] text-muted mt-1">Con este correo el colaborador iniciará sesión en la app.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1.5">Teléfono / WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="387..."
                          value={newEmpPhone}
                          onChange={(e) => setNewEmpPhone(e.target.value)}
                          className="w-full bg-surface-2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-star"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted mb-1.5">Provincia</label>
                        <input
                          type="text"
                          placeholder="Salta, Bs As..."
                          value={newEmpProvincia}
                          onChange={(e) => setNewEmpProvincia(e.target.value)}
                          className="w-full bg-surface-2 border border-line rounded-xl px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-star"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted mb-1.5">Rol inicial</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewEmpRole("evaluador")}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${newEmpRole === "evaluador" ? "bg-warmth/20 border-warmth text-cream shadow" : "bg-surface-2 border-line text-muted"}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-warmth">
                            <Star className="w-3.5 h-3.5 fill-warmth" />
                            <span>Evaluador ⭐</span>
                          </div>
                          <p className="text-[10px] text-muted font-normal">Auditar y calificar urgencias.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewEmpRole("admin")}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${newEmpRole === "admin" ? "bg-star/20 border-star text-cream shadow" : "bg-surface-2 border-line text-muted"}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-star">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin 👑</span>
                          </div>
                          <p className="text-[10px] text-muted font-normal">Acceso total a todo el panel.</p>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                      <button
                        type="button"
                        onClick={() => setShowAddEmployeeModal(false)}
                        className="px-4 py-2 text-xs font-bold text-muted hover:text-cream rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isAddingEmp}
                        className="px-5 py-2.5 bg-star text-night font-bold text-xs rounded-xl shadow-lg hover:bg-star/90 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        {isAddingEmp ? "Guardando..." : "Dar de Alta"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Buscador de Colaboradores */}
            <div className="relative">
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar colaborador por nombre, email o provincia..." 
                value={rrhhSearch}
                onChange={(e) => setRrhhSearch(e.target.value)}
                className="w-full bg-surface-2 border border-line rounded-xl pl-11 pr-4 py-3 text-sm text-cream focus:outline-none focus:border-star" 
              />
            </div>

            {/* Lista de usuarios con asignador de roles */}
            <div className="space-y-3">
              {filteredRrhhUsers.length === 0 ? (
                <p className="text-center text-muted py-8 text-sm">No se encontraron usuarios.</p>
              ) : (
                filteredRrhhUsers.map(u => {
                  const role = u.role || "usuario";
                  return (
                    <div key={u.id} className="p-4 bg-surface-2 rounded-2xl border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-cream text-sm">{u.name || "Sin nombre registrado"}</h4>
                          {role === "admin" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-star/20 text-star border border-star/30 flex items-center gap-1">
                              👑 Administrador General
                            </span>
                          )}
                          {role === "evaluador" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warmth/20 text-warmth border border-warmth/30 flex items-center gap-1">
                              🛡️ Evaluador / Captador
                            </span>
                          )}
                          {role === "usuario" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface text-muted border border-line">
                              👤 Usuario Regular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted truncate">{u.email}</p>
                        <p className="text-xs text-muted mt-0.5">{u.provincia || "Argentina"} • Tel: {u.phone || "No indicado"}</p>
                      </div>

                      {/* Botones de acción de rol */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {role !== "evaluador" && (
                          <button
                            onClick={() => updateUserRole(u.id, "evaluador")}
                            className="px-3 py-1.5 rounded-xl bg-warmth/15 text-warmth hover:bg-warmth/25 border border-warmth/30 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-warmth" />
                            Hacer Evaluador
                          </button>
                        )}
                        {role !== "admin" && (
                          <button
                            onClick={() => updateUserRole(u.id, "admin")}
                            className="px-3 py-1.5 rounded-xl bg-star/15 text-star hover:bg-star/25 border border-star/30 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Hacer Admin
                          </button>
                        )}
                        {role !== "usuario" && (
                          <button
                            onClick={() => updateUserRole(u.id, "usuario")}
                            className="px-3 py-1.5 rounded-xl bg-surface hover:bg-line text-muted text-xs font-bold transition-all border border-line"
                          >
                            Quitar Rol
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 4: USUARIOS */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar usuario por nombre o email..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-surface-2 border border-line rounded-xl pl-11 pr-4 py-3 text-sm text-cream focus:outline-none focus:border-star" 
              />
            </div>

            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No se encontraron usuarios.</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(u => {
                  const phoneDigits = u.phone ? u.phone.replace(/\D/g, "") : "";
                  const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}` : null;

                  return (
                    <div key={u.id} className="p-4 sm:p-5 bg-surface-2 rounded-2xl border border-line/60 space-y-3 shadow-sm">
                      {/* Fila principal del usuario */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-bold text-cream text-base">{u.name || u.email}</h4>
                            
                            {u.isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-star/15 text-star border border-star/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 fill-star text-night shrink-0" />
                                Perfil Verificado
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-night/60 text-muted border border-line">
                                Sin verificar
                              </span>
                            )}

                            {u.verificationStars ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-night text-star border border-line">
                                {"⭐".repeat(u.verificationStars)} ({u.verificationStars}/5 redes)
                              </span>
                            ) : null}

                            {u.role === "evaluador" && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-warmth/20 text-warmth">Evaluador</span>
                            )}
                            {u.role === "admin" && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-star/20 text-star">Admin</span>
                            )}
                            {u.isCompany && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400">Empresa</span>
                            )}
                          </div>

                          <p className="text-xs text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span>{u.provincia || "Argentina"}</span>
                            <span>•</span>
                            <span>Email: <strong className="text-cream font-medium">{u.email}</strong></span>
                            {u.phone && (
                              <>
                                <span>•</span>
                                <span>Tel: <strong className="text-cream font-medium">{u.phone}</strong></span>
                              </>
                            )}
                            {u.dni && (
                              <>
                                <span>•</span>
                                <span>DNI: <strong className="text-cream font-medium">{u.dni}</strong></span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Botones de acción del evaluador */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                              title="Contactar al usuario por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleUserVerification(u)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              u.isVerified 
                                ? "bg-night text-muted hover:text-red-400 border border-line" 
                                : "bg-star hover:bg-star-dim text-night shadow-sm"
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {u.isVerified ? "Revocar Verificación" : "Validar y Verificar"}
                          </button>

                          <button 
                            onClick={() => deleteUser(u.id)} 
                            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all" 
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Bloque de auditoría: Datos bancarios y Redes si existen */}
                      {(u.alias || u.cbu || u.bankOwnerName || u.socials) && (
                        <div className="pt-2 border-t border-line/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Datos bancarios para cotejo */}
                          <div className="bg-night/50 p-3 rounded-xl border border-line/40 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted flex items-center gap-1.5 mb-1">
                              <CreditCard className="w-3.5 h-3.5 text-star" />
                              Datos Bancarios Registrados
                            </span>
                            {u.alias ? (
                              <p className="text-cream text-xs font-mono">
                                Alias: <strong className="text-star">{u.alias}</strong>
                              </p>
                            ) : null}
                            {u.cbu ? (
                              <p className="text-muted text-[11px] font-mono">
                                CBU: {u.cbu}
                              </p>
                            ) : null}
                            {u.bankOwnerName ? (
                              <p className="text-muted text-[11px]">
                                Titular: <strong className="text-cream">{u.bankOwnerName}</strong> {u.bankOwnerDni ? `(DNI: ${u.bankOwnerDni})` : ""} {u.bankName ? `• ${u.bankName}` : ""}
                              </p>
                            ) : null}
                            {!u.alias && !u.cbu && !u.bankOwnerName && (
                              <p className="text-muted text-[11px] italic">Aún no cargó datos de cobro.</p>
                            )}
                          </div>

                          {/* Redes sociales para auditar con 1 clic */}
                          <div className="bg-night/50 p-3 rounded-xl border border-line/40 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted flex items-center gap-1.5 mb-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-star" />
                              Redes Sociales Auditables
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {u.socials?.whatsapp?.value && (
                                <a
                                  href={getSocialUrl("whatsapp", u.socials.whatsapp.value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg bg-surface text-[10px] text-cream hover:text-star border border-line flex items-center gap-1"
                                >
                                  WA: {u.socials.whatsapp.value}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                              {u.socials?.instagram?.value && (
                                <a
                                  href={getSocialUrl("instagram", u.socials.instagram.value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg bg-surface text-[10px] text-cream hover:text-star border border-line flex items-center gap-1"
                                >
                                  IG: {u.socials.instagram.value}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                              {u.socials?.facebook?.value && (
                                <a
                                  href={getSocialUrl("facebook", u.socials.facebook.value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg bg-surface text-[10px] text-cream hover:text-star border border-line flex items-center gap-1"
                                >
                                  FB: {u.socials.facebook.value}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                              {u.socials?.tiktok?.value && (
                                <a
                                  href={getSocialUrl("tiktok", u.socials.tiktok.value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg bg-surface text-[10px] text-cream hover:text-star border border-line flex items-center gap-1"
                                >
                                  TT: {u.socials.tiktok.value}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                              {u.socials?.email?.value && (
                                <a
                                  href={getSocialUrl("email", u.socials.email.value)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-lg bg-surface text-[10px] text-cream hover:text-star border border-line flex items-center gap-1"
                                >
                                  Email: {u.socials.email.value}
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                              {(!u.socials || Object.keys(u.socials).length === 0) && (
                                <p className="text-muted text-[11px] italic">No cargó redes sociales aún.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MERCADO SOLIDARIO */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            {offers.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay stock publicado.</p>
            ) : (
              <div className="space-y-4">
                {offers.map(o => {
                  const companyUser = users.find(u => u.id === o.userId);
                  const postulantes = connections.filter(c => c.itemId === o.id && c.type === "reclamar");
                  
                  return (
                    <div key={o.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${o.status === 'activa' ? 'bg-star/20 text-star' : 'bg-surface text-muted'}`}>
                              {o.status === 'activa' ? 'ACTIVA' : 'ENTREGADA'}
                            </span>
                            <span className="text-xs text-muted font-bold">{o.companyName}</span>
                          </div>
                          <h4 className="font-bold text-cream text-sm">{o.title}</h4>
                          <p className="text-xs text-muted mt-1 whitespace-pre-line">{o.description}</p>
                          
                          {companyUser && (
                            <p className="text-xs text-muted mt-2">Contacto empresa: {companyUser.phone}</p>
                          )}

                          {postulantes.length > 0 && (
                            <div className="mt-4 p-3 bg-surface rounded-lg border border-line">
                              <h5 className="text-xs font-bold text-star mb-2 uppercase tracking-wider">{postulantes.length} Postulantes:</h5>
                              <ul className="space-y-2">
                                {postulantes.map(p => {
                                  const u = users.find(usr => usr.id === p.userId);
                                  return (
                                    <li key={p.id} className="text-xs text-cream flex justify-between items-center bg-surface-2 p-2 rounded border border-line/50">
                                      <span>{u ? `${u.name} (${u.provincia})` : 'Usuario'} - {u?.phone}</span>
                                      <span className="text-muted italic line-clamp-1 max-w-[40%] text-right">{p.message}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={async () => {
                            if (confirm("¿Borrar este ofrecimiento?")) {
                              await deleteDoc(doc(db, "companyOffers", o.id));
                              toast.success("Ofrecimiento eliminado.");
                            }
                          }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {o.status === 'activa' && (
                            <button onClick={async () => {
                              if (confirm("¿Marcar como entregado?")) {
                                await updateDoc(doc(db, "companyOffers", o.id), { status: 'entregada' });
                                toast.success("Marcado como entregado.");
                              }
                            }} className="p-2 bg-star/20 text-star rounded-lg hover:bg-star/30" title="Marcar entregada">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CONEXIONES / MENSAJES */}
        {activeTab === "conexiones" && (
          <div className="space-y-4">
            {connections.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay mensajes pendientes.</p>
            ) : (
              <div className="space-y-3">
                {connections.map(c => {
                  const user = users.find(u => u.id === c.userId);
                  return (
                    <div key={c.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${c.type === 'ayudar' ? 'bg-star/20 text-star' : 'bg-warmth/20 text-warmth'}`}>
                            {c.type === 'ayudar' ? 'Quiere Ayudar' : 'Reclama Regalo'}
                          </span>
                          <h4 className="font-bold text-cream text-sm mt-2">{c.itemTitle}</h4>
                          <p className="text-sm text-cream mt-2 bg-surface p-3 rounded-lg border border-line">"{c.message}"</p>
                          {user && (
                            <div className="mt-3 text-xs text-muted">
                              <p><strong className="text-cream">De:</strong> {user.name} ({user.provincia})</p>
                              <p><strong className="text-cream">WhatsApp:</strong> {user.phone}</p>
                            </div>
                          )}
                        </div>
                        <button onClick={async () => {
                          await deleteDoc(doc(db, "connections", c.id));
                          toast.success("Mensaje completado.");
                        }} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 shrink-0 ml-3 text-xs font-bold">
                          Marcar Listo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: NOTIFICACIONES PUSH */}
        {activeTab === "push" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line">
              <div>
                <h3 className="font-bold text-cream text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-star" />
                  Centro de Emisión de Notificaciones Push
                </h3>
                <p className="text-xs text-muted">
                  Enviá alertas y avisos en tiempo real directo a la pantalla de los usuarios, incluso con la app cerrada.
                </p>
              </div>
              <span className="text-xs text-star font-bold bg-star/15 px-3 py-1 rounded-full border border-star/30 self-start sm:self-auto">
                {subscribers.length} dispositivo(s) suscripto(s)
              </span>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-surface-2 p-4 rounded-2xl border border-line">
                <div className="flex items-center justify-between text-muted mb-1 text-xs">
                  <span>Total Suscriptores</span>
                  <Smartphone className="w-4 h-4 text-star" />
                </div>
                <p className="text-2xl font-black text-cream">{subscribers.length}</p>
                <p className="text-[11px] text-muted mt-1">Dispositivos listos para recibir</p>
              </div>

              <div className="bg-surface-2 p-4 rounded-2xl border border-line">
                <div className="flex items-center justify-between text-muted mb-1 text-xs">
                  <span>En Android</span>
                  <Smartphone className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl font-black text-cream">
                  {subscribers.filter(s => s.platform === "android").length}
                </p>
                <p className="text-[11px] text-muted mt-1">Celulares con la App instalada</p>
              </div>

              <div className="bg-surface-2 p-4 rounded-2xl border border-line">
                <div className="flex items-center justify-between text-muted mb-1 text-xs">
                  <span>En Web / PC</span>
                  <Radio className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-cream">
                  {subscribers.filter(s => s.platform !== "android").length}
                </p>
                <p className="text-[11px] text-muted mt-1">Navegadores Chrome, Safari, Edge</p>
              </div>
            </div>

            {/* Formulario de Envío de Push */}
            <div className="bg-surface-2 p-5 rounded-3xl border border-line space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-cream text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-star" />
                  Redactar Notificación Masiva
                </h4>
                <span className="text-[11px] text-muted">Llegará como notificación del sistema</span>
              </div>

              {/* Plantillas rápidas */}
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Plantillas Rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPushTitle("🚨 Caso Urgente en Ayudarte.App");
                      setPushBody("Un soñador en situación crítica necesita apoyo de la comunidad. ¿Podés colaborar?");
                      setPushUrl("/?tab=urgentes");
                    }}
                    className="px-3 py-1.5 bg-surface hover:bg-line text-xs font-semibold text-cream rounded-xl border border-line transition-all active:scale-95"
                  >
                    🚨 Caso Crítico
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPushTitle("✨ ¡Sueño Cumplido con Éxito!");
                      setPushBody("Gracias a la comunidad se acaba de hacer realidad un nuevo sueño. Mirá la historia.");
                      setPushUrl("/suenos");
                    }}
                    className="px-3 py-1.5 bg-surface hover:bg-line text-xs font-semibold text-cream rounded-xl border border-line transition-all active:scale-95"
                  >
                    ✨ Sueño Cumplido
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPushTitle("🎁 Nuevo Objeto Disponible para Donar");
                      setPushBody("Un vecino publicó un nuevo regalo en el Mercado Solidario. ¡Entrá a verlo!");
                      setPushUrl("/regalar");
                    }}
                    className="px-3 py-1.5 bg-surface hover:bg-line text-xs font-semibold text-cream rounded-xl border border-line transition-all active:scale-95"
                  >
                    🎁 Nuevo Regalo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendBroadcastPush} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-cream mb-1">Título de la Notificación</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 🚨 ¡Alerta Solidaria! Necesitamos tu ayuda"
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-xs text-cream placeholder:text-muted focus:outline-none focus:border-star font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cream mb-1">Mensaje / Contenido</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribí aquí el texto que verán los usuarios en la pantalla de bloqueo de su celular..."
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    className="w-full bg-surface border border-line rounded-xl p-3 text-xs text-cream placeholder:text-muted focus:outline-none focus:border-star resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-cream mb-1">Enlace al hacer Clic (Destino)</label>
                  <input
                    type="text"
                    placeholder="Ej. / o /suenos o /ayuda-eventual"
                    value={pushUrl}
                    onChange={(e) => setPushUrl(e.target.value)}
                    className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-xs text-cream placeholder:text-muted focus:outline-none focus:border-star font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSendingPush || subscribers.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-star hover:bg-star-dim text-night font-extrabold text-xs rounded-xl shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingPush ? "Enviando a todos los dispositivos..." : `Enviar Notificación Push a ${subscribers.length} Usuarios`}
                  </button>

                  {subscribers.length === 0 && (
                    <p className="text-xs text-warmth font-semibold">
                      Aún no hay dispositivos suscriptos. Activá las notificaciones desde tu perfil o Home para probar.
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Dispositivos Registrados */}
            <div className="space-y-3">
              <h4 className="font-bold text-cream text-xs uppercase tracking-wider text-muted">
                Dispositivos Conectados ({subscribers.length}):
              </h4>

              {subscribers.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-line rounded-2xl">
                  <p className="text-xs text-muted">Aún no hay usuarios suscriptos a notificaciones push.</p>
                </div>
              ) : (
                <div className="divide-y divide-line/40 border border-line rounded-2xl overflow-hidden bg-surface-2">
                  {subscribers.slice(0, 10).map((sub) => (
                    <div key={sub.id} className="p-3 sm:p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-line text-star">
                          {sub.platform === "android" ? <Smartphone className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-cream">{sub.userName || sub.userEmail || "Usuario Anónimo"}</p>
                          <p className="text-[10px] text-muted">
                            Plataforma: <strong className="text-cream capitalize">{sub.platform || "Web"}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted">
                        {sub.createdAt?.seconds ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString("es-AR") : "Activo"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
