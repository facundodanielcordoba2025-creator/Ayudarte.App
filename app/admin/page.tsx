"use client";

import { useEffect, useState } from "react";
import { Users, Star, Gift, Search, Trash2, Shield, HandHeart } from "lucide-react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { type EventualHelp, type EventualStatus, categoryInfo, EVENTUAL_STATUS_LABEL } from "@/hooks/useEventualHelps";
import { db } from "@/lib/firebase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [users, setUsers] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [eventual, setEventual] = useState<EventualHelp[]>([]);

  useEffect(() => {
    // Escuchar Usuarios
    const qUsers = query(collection(db, "users"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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

    return () => { unsubUsers(); unsubDreams(); unsubConns(); unsubEventual(); };
  }, []);

  const deleteDream = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este sueño?")) {
      await deleteDoc(doc(db, "dreams", id));
    }
  };

  const setEventualStatus = async (id: string, status: EventualStatus) => {
    await updateDoc(doc(db, "eventualHelps", id), { status, reviewedAt: Date.now() });
  };

  const deleteEventual = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este pedido de ayuda?")) {
      await deleteDoc(doc(db, "eventualHelps", id));
    }
  };

  const pendingEventual = eventual.filter(h => h.status === "pendiente").length;

  const deleteUser = async (id: string) => {
    if (confirm("¿Seguro que quieres borrar este usuario? Perderá el acceso.")) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  return (
    <div className="min-h-screen bg-surface-2 p-6 pb-28">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Panel de Control</h1>
          <p className="text-sm text-muted">Centro de mando de Ayudarte.App</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <button 
          onClick={() => setActiveTab("usuarios")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "usuarios" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Users className="w-4 h-4" /> Usuarios ({users.length})
        </button>
                <button 
          onClick={() => setActiveTab("suenos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "suenos" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Star className="w-4 h-4" /> Sueños Activos ({dreams.length})
        </button>
        <button 
          onClick={() => setActiveTab("eventuales")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "eventuales" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <HandHeart className="w-4 h-4" /> Ayudas Eventuales
          {pendingEventual > 0 && <span className="bg-warmth text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingEventual}</span>}
        </button>
      </div>

      {/* Content */}
      <div className="bg-surface border border-line rounded-3xl p-5 shadow-xl">
        
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Buscar usuario..." className="w-full bg-surface-2 border border-line rounded-xl pl-11 pr-4 py-3 text-sm text-cream focus:outline-none focus:border-star" />
            </div>

            {users.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">Todavía no hay usuarios registrados.</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-line/50">
                    <div>
                      <h4 className="font-bold text-cream text-sm">{u.name || u.email}</h4>
                      <p className="text-xs text-muted mt-1">{u.provincia} • {u.telefono}</p>
                    </div>
                    <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "suenos" && (
          <div className="space-y-4">
            {dreams.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay sueños publicados.</p>
            ) : (
              <div className="space-y-3">
                {dreams.map(d => (
                  <div key={d.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-cream text-sm">{d.title}</h4>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{d.history}</p>
                      </div>
                      <button onClick={() => deleteDream(d.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 shrink-0 ml-3">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {activeTab === "eventuales" && (
          <div className="space-y-3">
            {eventual.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay pedidos de ayuda eventual.</p>
            ) : (
              eventual.map(h => {
                const user = users.find(u => u.id === h.userId);
                const cat = categoryInfo(h.category);
                return (
                  <div key={h.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
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
                      <button onClick={() => deleteEventual(h.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {h.status !== "aprobada" && h.status !== "cubierta" && (
                        <button onClick={() => setEventualStatus(h.id, "aprobada")} className="px-3 py-2 rounded-lg bg-star text-night text-xs font-bold">Aprobar y publicar</button>
                      )}
                      {h.status === "aprobada" && (
                        <button onClick={() => setEventualStatus(h.id, "cubierta")} className="px-3 py-2 rounded-lg bg-star text-night text-xs font-bold">Marcar cubierta</button>
                      )}
                      {h.status === "pendiente" && (
                        <button onClick={() => setEventualStatus(h.id, "rechazada")} className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold">Rechazar</button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

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
                        <button onClick={() => deleteDoc(doc(db, "connections", c.id))} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 shrink-0 ml-3 text-xs font-bold">
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
      </div>
    </div>
  );
}
