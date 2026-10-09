"use client";

import { CircleUserRound, Settings, Star, HelpCircle, ChevronDown, Bell, LogOut, ShieldCheck, Heart, Gift, HandHeart } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type EventualHelp, categoryInfo, EVENTUAL_STATUS_LABEL } from "@/hooks/useEventualHelps";

export default function PerfilPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [myDreams, setMyDreams] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [myHelps, setMyHelps] = useState<any[]>([]);
  const [myEventual, setMyEventual] = useState<EventualHelp[]>([]);

  useEffect(() => {
    const uid = localStorage.getItem("ayudarte_user_id");
    setUserId(uid);
    if (uid) {
      const q = query(collection(db, "dreams"), where("userId", "==", uid));
      const unsubDreams = onSnapshot(q, (snap) => setMyDreams(snap.docs.map(d => ({id: d.id, ...d.data()}))));
      
      const unsubUser = onSnapshot(doc(db, "users", uid), (docSnap) => {
        if (docSnap.exists()) setUserData(docSnap.data());
      });
      
      const qHelps = query(collection(db, "connections"), where("userId", "==", uid));
      const unsubHelps = onSnapshot(qHelps, (snap) => {
        setMyHelps(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });

      const qEventual = query(collection(db, "eventualHelps"), where("userId", "==", uid));
      const unsubEventual = onSnapshot(qEventual, (snap) => {
        setMyEventual(
          snap.docs
            .map(d => ({ id: d.id, ...d.data() }) as EventualHelp)
            .sort((a, b) => b.createdAt - a.createdAt)
        );
      });
      return () => { unsubDreams(); unsubUser(); unsubHelps(); unsubEventual(); };

    }
  }, []);

  const hasActiveEventual = myEventual.some(h => h.status === "pendiente" || h.status === "aprobada");
  return (
    <div className="pb-28 min-h-screen bg-surface-2 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-40">
        <h1 className="font-display text-2xl font-bold text-cream">Mi Cuenta</h1>
        <p className="text-sm text-muted mt-1">Gestioná tu perfil y resolvé tus dudas.</p>
      </div>

      {/* TARJETA DE USUARIO */}
      <div className="px-6 mt-6">
        {userId ? (
          <div className="space-y-4">
            <div className="bg-surface border border-star/30 rounded-3xl p-6 shadow-[0_0_15px_rgba(255,182,72,0.1)] flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-star/20 flex items-center justify-center shrink-0 border-2 border-star/50">
                <CircleUserRound className="w-8 h-8 text-star" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-cream text-lg">¡Hola, {userData?.name || 'Superhéroe'}!</h2>
                <p className="text-xs text-star mt-1 leading-relaxed font-semibold">
                  Sesión iniciada correctamente.
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("ayudarte_user_id");
                setUserId(null);
                setUserData(null);
                window.location.reload();
              }} 
              className="w-full bg-surface-2 text-muted font-bold py-3.5 rounded-xl border border-line active:scale-95 transition-transform"
            >
              CERRAR SESIÓN
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-surface border border-line rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center shrink-0 border-2 border-line">
                <CircleUserRound className="w-8 h-8 text-muted" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-cream text-lg">Ingresá a tu cuenta</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Iniciá sesión para publicar un sueño o reclamar un regalo disponible.
                </p>
              </div>
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full mt-4 bg-star text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform">
              INICIAR SESIÓN / REGISTRARSE
            </button>
          </div>
        )}
      </div>


      {/* PANELES DE ACCION */}
      {userId && userData && (
        <div className="px-6 mt-8 space-y-4">
          {!userData.isCompany && (
            <button 
              onClick={() => {
                if (myDreams.length >= 2) {
                  alert("Ya tienes 2 sueños publicados. Para publicar uno nuevo, debes eliminar alguno de los anteriores.");
                } else {
                  router.push('/contar-mi-sueno');
                }
              }}
              className="w-full bg-surface border-2 border-star/50 rounded-3xl p-6 text-left relative overflow-hidden active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                <div className="w-12 h-12 bg-star text-night rounded-2xl flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cream text-lg">Contar Mi Sueño</h3>
                  <p className="text-xs text-muted mt-1">
                    {myDreams.length >= 2 ? "Has alcanzado el límite (2/2)" : "Pide ayuda a la comunidad"}
                  </p>
                </div>
              </div>
            </button>
          )}

          {!userData.isCompany && (
            <button 
              onClick={() => {
                if (hasActiveEventual) {
                  alert("Ya tenés un pedido de ayuda activo. Cuando se resuelva vas a poder cargar otro.");
                } else {
                  router.push('/ayuda-eventual');
                }
              }}
              className="w-full bg-surface border-2 border-star/50 rounded-3xl p-6 text-left relative overflow-hidden active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                <div className="w-12 h-12 bg-star text-night rounded-2xl flex items-center justify-center shrink-0">
                  <HandHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cream text-lg">Necesito una Ayuda</h3>
                  <p className="text-xs text-muted mt-1">
                    {hasActiveEventual ? "Tenés un pedido activo" : "Luz, alquiler, comida, medicamentos"}
                  </p>
                </div>
              </div>
            </button>
          )}

          <button 
            onClick={() => router.push('/regalar')}
            className="w-full bg-gradient-to-br from-star/20 to-surface border-2 border-star/50 rounded-3xl p-6 text-left relative overflow-hidden active:scale-95 transition-transform"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10 pointer-events-none">
              <div className="w-12 h-12 bg-star text-night rounded-2xl flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-cream text-lg">Quiero Ser Superhéroe</h3>
                <p className="text-xs text-muted mt-1">Dona objetos o apoya a otros</p>
              </div>
            </div>
          </button>
        </div>
      )}


      {/* MIS PEDIDOS DE AYUDA EVENTUAL */}
      {userId && myEventual.length > 0 && (
        <div className="px-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <HandHeart className="w-5 h-5 text-star" />
            <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Mis Pedidos de Ayuda</h2>
          </div>
          <div className="space-y-3">
            {myEventual.map(h => {
              const catInfo = categoryInfo(h.category);
              const Icon = catInfo.icon;
              return (
                <div key={h.id} className="bg-surface border border-line rounded-2xl p-4 flex items-start gap-3">
                  <div className="mt-1 bg-surface-light p-2 rounded-lg text-star">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-cream text-sm line-clamp-2">{h.title}</h3>
                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${h.status === "rechazada" ? "bg-red-500/15 text-red-400" : "bg-star/20 text-star"}`}>
                      {EVENTUAL_STATUS_LABEL[h.status] ?? h.status}
                    </span>
                  </div>
                {h.status !== "cubierta" && (
                  <button
                    onClick={async () => {
                      if (confirm("¿Querés eliminar este pedido de ayuda?")) {
                        await deleteDoc(doc(db, "eventualHelps", h.id));
                      }
                    }}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg shrink-0"
                    aria-label="Eliminar pedido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              );
            })}
          </div>
        </div>
      )}


      {/* SUEÑOS EN PROCESO (DASHBOARD DEL DONANTE) */}
      {userId && myHelps.length > 0 && (
        <div className="px-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-star" />
            <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Mis Sueños Apoyados</h2>
          </div>
          <p className="text-xs text-muted mb-4">Llevamos el registro de tu solidaridad. Aquí verás el estado de los sueños que estás ayudando a cumplir.</p>
          
          <div className="space-y-4">
            {myHelps.map(help => (
              <div key={help.id} className="bg-surface border border-line rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-cream text-sm flex-1 pr-2 line-clamp-2">{help.itemTitle || "Sueño"}</h3>
                  <div className="bg-star/20 text-star text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                    {help.helpMode === "economico" ? "Aporte Eco." : help.helpMode === "objeto" ? "Objeto" : "Completo"}
                  </div>
                </div>
                
                {help.helpMode === "economico" && help.amount && (
                  <div className="mb-3">
                    <p className="text-xs text-muted mb-1">Tu aporte voluntario:</p>
                    <p className="font-display font-bold text-lg text-star">${help.amount.toLocaleString()}</p>
                  </div>
                )}

                <div className="bg-surface-2 rounded-xl p-3 border border-line/50">
                  <p className="text-[11px] font-medium text-cream mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-star" />
                    Estado de la Gestión
                  </p>
                  <p className="text-[10px] text-muted leading-relaxed">
                    {help.status === "pending" 
                      ? "Estamos procesando tu intención de ayuda. Pronto nos pondremos en contacto contigo."
                      : help.status === "in_progress" 
                      ? "¡En marcha! Estamos coordinando los detalles para hacer la entrega oficial."
                      : "¡Sueño cumplido exitosamente! Gracias a tu apoyo."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREGUNTAS FRECUENTES (Inspirado en UNICEF) */}
      <div className="px-6 mt-10">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-star" />
          <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Preguntas Frecuentes</h2>
        </div>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          Si tenés dudas sobre cómo funcionan las donaciones, aquí te dejamos las respuestas a las consultas más habituales.
        </p>

        <div className="space-y-3">
          
          {/* FAQ 1 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿Es segura mi donación online?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>¡Sí, totalmente! Utilizamos pasarelas de pago de máxima seguridad y tecnología de cifrado (SSL) para proteger tus datos bancarios y personales. Nunca almacenamos los datos de tu tarjeta de crédito en nuestros servidores.</p>
            </div>
          </details>

          {/* FAQ 2 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿A dónde va destinado mi aporte?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>El 100% de lo recaudado se destina al fondo común de Ayudarte.app. Ese dinero se utiliza para hacer realidad los sueños publicados en nuestra plataforma (comprar sillas de ruedas, herramientas de trabajo, etc.) y para organizar los sorteos mensuales entre nuestros donantes.</p>
            </div>
          </details>

          {/* FAQ 3 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿Puedo darme de baja como donante mensual?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>Por supuesto. Podés cancelar tu aporte mensual en cualquier momento y sin ningún tipo de cargo adicional. Solo tenés que iniciar sesión en esta misma sección ("Mi Cuenta") y hacer clic en "Cancelar Suscripción".</p>
            </div>
          </details>

          {/* FAQ 4 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿Qué sucede si elijo donar un objeto físico?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>Al completar el formulario de "Regalar un Objeto", el artículo quedará publicado en nuestra sección de Regalos Disponibles. Cuando un soñador lo solicite, nos pondremos en contacto con vos para coordinar el retiro o el envío de manera segura.</p>
            </div>
          </details>

        </div>
      </div>



      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="px-6 py-10 flex justify-center">
        <button onClick={() => router.push('/legales')} className="text-xs font-bold text-muted hover:text-star transition-colors underline underline-offset-4">
          Términos, Privacidad y Políticas Legales
        </button>
      </div>
    </div>
  );
}
