"use client";
import { toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { IntentionModal } from "@/components/IntentionModal";
import Link from "next/link";
import { HeartHandshake, HandHeart, Trophy, Calendar, BookOpen, ChevronRight, X, Target, Footprints, Users, Heart, RefreshCw, Star, Smile, Shield, Eye, Rocket, ShieldCheck, Send, Quote, Sparkles, MapPin, Package, Play, CheckCircle2, Share2 } from "lucide-react";
import { useGifts } from "@/hooks/useGifts";
import { useDreams } from "@/hooks/useDreams";
import { useEventualHelps, categoryInfo, getUrgencyInfo } from "@/hooks/useEventualHelps";
import { useOffers } from "@/hooks/useOffers";
import { MediaDetailModal, type MediaDetailItem } from "@/components/MediaDetailModal";
import { ShareModal, type ShareableItem } from "@/components/ShareModal";
import { isProfileVerified } from "@/lib/verification";

const MOTIVATION_QUOTES = [
  { quote: "El futuro pertenece a aquellos que creen en la belleza de sus sueños.", author: "Eleanor Roosevelt" },
  { quote: "Haz de tu vida un sueño, y de tu sueño una realidad.", author: "Antoine de Saint-Exupéry" },
  { quote: "Nunca eres demasiado viejo para fijarte otra meta o soñar un nuevo sueño.", author: "C.S. Lewis" },
  { quote: "Todos nuestros sueños pueden hacerse realidad si tenemos el coraje de perseguirlos.", author: "Walt Disney" },
  { quote: "Un viaje de mil millas comienza con un solo paso.", author: "Lao Tse" },
  { quote: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { quote: "La única forma de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { quote: "Cree que puedes y ya estarás a medio camino.", author: "Theodore Roosevelt" },
  { quote: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar.", author: "Winston Churchill" },
  { quote: "Tu tiempo es limitado, no lo desperdicies viviendo la vida de otro.", author: "Steve Jobs" },
  { quote: "La vida es un 10% lo que te pasa y un 90% cómo reaccionas ante ello.", author: "Charles R. Swindoll" },
  { quote: "La mejor forma de predecir el futuro es creándolo.", author: "Peter Drucker" },
  { quote: "Si puedes soñarlo, puedes hacerlo.", author: "Walt Disney" },
  { quote: "No importa lo lento que vayas siempre y cuando no te detengas.", author: "Confucio" },
  { quote: "El único límite a nuestros logros de mañana serán nuestras dudas de hoy.", author: "Franklin D. Roosevelt" },
  { quote: "Solo en la oscuridad puedes ver las estrellas.", author: "Martin Luther King Jr." },
  { quote: "Haz hoy lo que otros no quieren, haz mañana lo que otros no pueden.", author: "Jerry Rice" },
  { quote: "Cae siete veces y levántate ocho.", author: "Proverbio Japonés" },
  { quote: "Todo lo que siempre has querido está al otro lado del miedo.", author: "George Addair" },
  { quote: "Si no te equivocas de vez en cuando, es que no lo intentas.", author: "Woody Allen" },
  { quote: "Las dificultades a menudo preparan a la gente común para un destino extraordinario.", author: "C.S. Lewis" },
  { quote: "La motivación nos impulsa a comenzar y el hábito nos permite continuar.", author: "Jim Ryun" },
  { quote: "Actúa como si lo que haces marca la diferencia. Lo hace.", author: "William James" },
  { quote: "Mantén tu cara hacia la luz del sol y no podrás ver la sombra.", author: "Helen Keller" },
  { quote: "Cada campeón fue alguna vez un contendiente que se negó a rendirse.", author: "Rocky Balboa" },
  { quote: "Incluso si te caes de bruces, sigues moviéndote hacia adelante.", author: "Victor Kiam" },
  { quote: "La energía y la persistencia conquistan todas las cosas.", author: "Benjamin Franklin" },
  { quote: "El fracaso es el condimento que le da al éxito su sabor.", author: "Truman Capote" },
  { quote: "Es durante nuestros momentos más oscuros cuando debemos centrarnos para ver la luz.", author: "Aristóteles" },
  { quote: "Apunta a la luna. Si fallas, podrías darle a una estrella.", author: "W. Clement Stone" },
  { quote: "El mayor riesgo es no correr ningún riesgo.", author: "Mark Zuckerberg" },
  { quote: "La perseverancia es el trabajo duro que haces después de cansarte del trabajo duro que ya hiciste.", author: "Newt Gingrich" },
  { quote: "No he fracasado. He encontrado 10.000 formas que no funcionan.", author: "Thomas A. Edison" },
  { quote: "Para tener éxito, primero debemos creer que podemos hacerlo.", author: "Nikos Kazantzakis" },
  { quote: "La vida se encoge o se expande en proporción al valor de uno.", author: "Anaïs Nin" }
];

export default function Home() {
  const [showOrigen, setShowOrigen] = useState(false);
  const [intentionItem, setIntentionItem] = useState<{id: string, title: string, type: "ayudar" | "reclamar", kind?: "dream" | "eventual" | "offer"} | null>(null);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaDetailItem | null>(null);
  const [sharingItem, setSharingItem] = useState<ShareableItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { gifts } = useGifts();
  const { dreams } = useDreams();
  const { helps: eventualHelps } = useEventualHelps();
  const approvedEventual = eventualHelps.filter(h => h.status === "aprobada");
  const { offers } = useOffers();

  // Deep linking: Abre directamente la historia si alguien entra por un enlace compartido (?historia=ID o ?sueno=ID)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("historia") || params.get("sueno") || params.get("id");
    if (!targetId) return;

    const foundDream = dreams.find((d: any) => d.id === targetId);
    if (foundDream) {
      setSelectedMediaItem({ ...foundDream, kind: "dream" });
      return;
    }

    const foundHelp = eventualHelps.find((h: any) => h.id === targetId);
    if (foundHelp) {
      setSelectedMediaItem({ ...foundHelp, kind: "eventual" });
    }
  }, [dreams, eventualHelps]);
  
  const [eventualFilter, setEventualFilter] = useState<"todos" | "urgentes">("todos");

  // Ordenar ayudas eventuales por urgencia auditada (5 estrellas primero)
  const sortedApprovedEventual = [...approvedEventual].sort((a, b) => {
    const starsA = a.urgencyStars || 0;
    const starsB = b.urgencyStars || 0;
    if (starsB !== starsA) return starsB - starsA;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const displayedEventual = eventualFilter === "urgentes"
    ? sortedApprovedEventual.filter(h => (h.urgencyStars || 0) >= 4)
    : sortedApprovedEventual;

  const countCritical = approvedEventual.filter(h => (h.urgencyStars || 0) >= 4).length;

  // Ordenar sueños por prioridad auditada (5 estrellas primero)
  const sortedDreams = [...dreams].sort((a: any, b: any) => {
    const starsA = a.urgencyStars || 0;
    const starsB = b.urgencyStars || 0;
    if (starsB !== starsA) return starsB - starsA;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  
  return (
    <div className="pb-28 animate-in fade-in duration-500">
      {/* HEADER / HERO */}
      <section className="px-6 pt-16 pb-8 relative overflow-hidden">


        <h1 className="sr-only">AYUDARTE.APP</h1>
        <div className="relative z-10 mb-6 w-full max-w-sm mx-auto md:mx-0 flex justify-center md:justify-start px-4 md:px-0">
          {/* Luz de fondo naranja */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-star/40 blur-[60px] rounded-full pointer-events-none"></div>
          
          <img 
            src="/hero_image.png" 
            alt="AYUDARTE.APP Logo" 
            className="relative w-full h-auto drop-shadow-[0_0_30px_rgba(255,102,0,0.6)]"
          />
        </div>
        
        <div className="mt-6 relative z-10 flex flex-row w-full justify-center px-6">
          <button
            onClick={() => setShowOrigen(true)}
            className="w-full max-w-[280px] inline-flex justify-center items-center gap-2 text-sm font-bold text-white transition-colors bg-star hover:bg-star/90 px-8 py-4 rounded-full shadow-[0_4px_16px_rgba(255,102,0,0.4)] active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            EL ORIGEN DE AYUDARTE
          </button>
        </div>
      </section>

      {/* SECCIÓN: MOTIVATE (Carrusel de Frases) */}
      <section className="px-6 py-12 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="w-6 h-6 text-star" />
          <h2 className="font-display text-xl font-bold text-cream">Motívate</h2>
        </div>
        
        {/* Carrusel Horizontal */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 hide-scrollbar">
          {MOTIVATION_QUOTES.map((item, index) => (
            <div 
              key={index} 
              className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-surface-2 border border-line rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col justify-center"
            >
              {/* Comillas decorativas tipo ícono */}
              <Quote className="absolute top-4 right-6 w-12 h-12 text-line opacity-30" />
              
              <p className="text-cream text-lg font-medium leading-relaxed relative z-10 mt-4 mb-6">
                "{item.quote}"
              </p>
              <div className="flex justify-end mt-auto">
                <p className="text-xs font-bold text-muted uppercase tracking-wide text-right">{item.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN SUEÑOS */}
      <section className="px-6 py-10 bg-night relative">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-star" />
          <h2 className="font-display text-xl font-bold text-cream">Sueños de la Comunidad</h2>
        </div>

        <div className="space-y-4">
          {sortedDreams.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-line rounded-2xl">
              <p className="text-muted text-sm">Aún no hay sueños publicados.</p>
            </div>
          ) : (
            sortedDreams.map((dream: any) => (
              <div key={dream.id} className="bg-surface rounded-3xl p-5 border border-line shadow-sm relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div 
                    onClick={() => setSelectedMediaItem({ ...dream, kind: "dream" })}
                    className="flex items-center gap-3 cursor-pointer group/author"
                  >
                    <div className="w-10 h-10 rounded-full bg-star/20 flex items-center justify-center shrink-0 group-hover/author:ring-2 group-hover/author:ring-star/50 transition-all">
                      <span className="text-lg font-bold text-star">{dream.userName?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-cream text-sm leading-tight group-hover/author:text-star transition-colors">
                          {dream.userName || 'Usuario Anónimo'}
                        </h3>
                        {((dream as any).isVerified || ((dream as any).socials && isProfileVerified((dream as any).socials))) && (
                          <CheckCircle2 className="w-4 h-4 text-night fill-star shrink-0" />
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-[11px] text-muted font-medium mt-0.5">
                        <MapPin className="w-3 h-3 text-muted shrink-0" />
                        <span>{dream.userProvincia || 'Argentina'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Nivel de estrellas donde antes estaba la ubicación */}
                  {dream.urgencyStars ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-line/70 bg-night/50 text-cream backdrop-blur-sm shrink-0">
                      <span className="flex items-center gap-0.5 text-star">
                        {Array.from({ length: dream.urgencyStars }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-star text-star" />
                        ))}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div 
                  onClick={() => setSelectedMediaItem({ ...dream, kind: "dream" })}
                  className="cursor-pointer group/story"
                >
                  <h4 className="font-display font-bold text-lg text-cream mb-2 leading-tight group-hover/story:text-star transition-colors">
                    {dream.title}
                  </h4>
                  <p className="text-sm text-muted mb-2 leading-relaxed line-clamp-3">
                    {dream.history}
                  </p>
                  <p className="text-xs font-semibold text-star/80 group-hover/story:text-star mb-4 flex items-center gap-1">
                    Leer historia completa →
                  </p>
                </div>

                {dream.media && dream.media.length > 0 && (() => {
                  const firstUrl = dream.media[0];
                  const isVideo = firstUrl.includes("video") || firstUrl.includes(".mp4") || firstUrl.includes(".webm") || firstUrl.includes(".mov");
                  return (
                    <div 
                      onClick={() => setSelectedMediaItem({ ...dream, kind: "dream" })}
                      className="mb-4 rounded-2xl overflow-hidden bg-night h-48 border border-line relative cursor-pointer group"
                    >
                      {isVideo ? (
                        <>
                          <video 
                            src={firstUrl} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                            muted 
                            playsInline 
                          />
                          {/* Botón Play solo para videos reales */}
                          <div className="absolute inset-0 bg-night/30 group-hover:bg-night/15 flex items-center justify-center transition-colors">
                            <div className="w-12 h-12 rounded-full bg-star text-night flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              <Play className="w-5 h-5 ml-0.5 fill-current" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={firstUrl} 
                          alt="Sueño" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      )}

                      {/* Indicador si hay múltiples fotos */}
                      {dream.media.length > 1 && (
                        <div className="absolute top-3 right-3 bg-night/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-cream border border-line flex items-center gap-1 shadow-md">
                          <span>+{dream.media.length - 1}</span>
                          <span className="text-[10px] text-muted">fotos</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const uid = localStorage.getItem("ayudarte_user_id");
                      if (!uid) {
                        setIsAuthOpen(true);
                        return;
                      }
                      if (uid === dream.userId) {
                        return toast("No puedes ayudarte a ti mismo.");
                      }
                      setIntentionItem({ id: dream.id, title: dream.title, type: "ayudar" });
                    }}
                    className="flex-1 bg-star/10 hover:bg-star/20 text-star font-bold text-sm py-3 rounded-xl transition-colors border border-star/20 text-center"
                  >
                    Ayudar a cumplir este sueño
                  </button>
                  <button
                    onClick={() => setSharingItem({ ...dream, kind: "dream" })}
                    className="p-3 bg-surface hover:bg-surface-2 text-cream hover:text-star border border-line rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
                    title="Difundir en Redes y WhatsApp"
                    aria-label="Compartir en redes"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>


      {/* SECCIÓN AYUDAS EVENTUALES (solo las aprobadas por el admin) */}
      <section className="px-6 py-10 bg-surface-2/40 border-y border-line">
        <div className="flex items-center gap-2 mb-2">
          <HandHeart className="w-6 h-6 text-star" />
          <h2 className="font-display text-xl font-bold text-cream">Ayudas del Día a Día</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <p className="text-sm text-muted">
            Necesidades básicas de la comunidad auditadas y verificadas por nuestro equipo de captadores.
          </p>

          {/* Filtros de Urgencia */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 hide-scrollbar">
            <button
              onClick={() => setEventualFilter("todos")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${eventualFilter === "todos" ? "bg-star text-night shadow" : "bg-surface text-muted border border-line"}`}
            >
              Todos ({approvedEventual.length})
            </button>
            {countCritical > 0 && (
              <button
                onClick={() => setEventualFilter("urgentes")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${eventualFilter === "urgentes" ? "bg-warmth text-night shadow" : "bg-warmth/15 text-warmth border border-warmth/30"}`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Casos Críticos</span>
                <span className="bg-surface-2 text-cream text-[10px] px-1.5 py-0.5 rounded-full font-mono">{countCritical}</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {displayedEventual.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-line rounded-2xl">
              <p className="text-muted text-sm">
                {eventualFilter === "urgentes" ? "No hay casos críticos en este momento." : "No hay pedidos de ayuda publicados por ahora."}
              </p>
            </div>
          ) : (
            displayedEventual.map(help => {
              const cat = categoryInfo(help.category);
              const urgency = getUrgencyInfo(help.urgencyStars);
              return (
                <div key={help.id} className="bg-surface rounded-3xl p-5 border border-line shadow-sm relative overflow-hidden">
                  {/* Fila Superior: Categoría a la izquierda, Estrellas a la derecha */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-star/15 text-star text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {(() => {
                        const Icon = cat.icon;
                        return <Icon className="w-3.5 h-3.5" />;
                      })()}
                      {cat.label}
                    </span>

                    {urgency && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-line/70 bg-night/50 text-cream backdrop-blur-sm">
                        <span className="flex items-center gap-0.5 text-star">
                          {Array.from({ length: help.urgencyStars || 0 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-star text-star" />
                          ))}
                        </span>
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={() => setSelectedMediaItem({ ...help, kind: "eventual" })}
                    className="cursor-pointer group/author mb-3"
                  >
                    <h4 className="font-display font-bold text-lg text-cream mb-1 leading-tight group-hover/author:text-star transition-colors">
                      {help.title}
                    </h4>
                    <div>
                      <p className="text-xs font-bold text-cream group-hover/author:text-star transition-colors">
                        {help.userName || 'Comunidad'}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-muted font-medium mt-0.5">
                        <MapPin className="w-3 h-3 text-muted shrink-0" />
                        <span>{help.userProvincia || 'Argentina'}</span>
                      </p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSelectedMediaItem({ ...help, kind: "eventual" })}
                    className="cursor-pointer group/desc mb-4"
                  >
                    <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-1">
                      {help.description}
                    </p>
                    <p className="text-xs font-semibold text-star/80 group-hover/desc:text-star flex items-center gap-1">
                      Ver detalle completo →
                    </p>
                  </div>

                  {help.amountNeeded ? (
                    <p className="text-sm text-cream mb-4">
                      Se necesitan aprox. <span className="font-bold text-star">${help.amountNeeded.toLocaleString('es-AR')}</span>
                    </p>
                  ) : null}

                  {help.media && help.media.length > 0 && (() => {
                    const firstUrl = help.media[0];
                    const isVideo = firstUrl.includes("video") || firstUrl.endsWith(".mp4") || firstUrl.endsWith(".webm") || firstUrl.endsWith(".mov");
                    return (
                      <div 
                        onClick={() => setSelectedMediaItem({ ...help, kind: "eventual" })}
                        className="group relative mb-4 rounded-xl overflow-hidden bg-night h-44 border border-line cursor-pointer"
                      >
                        {isVideo ? (
                          <>
                            <div className="w-full h-full bg-night flex items-center justify-center">
                              <video src={firstUrl} className="w-full h-full object-cover pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute inset-0 bg-night/30 group-hover:bg-night/15 flex items-center justify-center transition-colors">
                              <div className="w-12 h-12 rounded-full bg-star text-night flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <Play className="w-5 h-5 ml-0.5 fill-current" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img src={firstUrl} alt="Evidencia de ayuda" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}

                        {help.media.length > 1 && (
                          <div className="absolute top-3 right-3 bg-night/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-cream border border-line flex items-center gap-1 shadow-md">
                            <span>+{help.media.length - 1}</span>
                            <span className="text-[10px] text-muted">fotos</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const uid = localStorage.getItem("ayudarte_user_id");
                        if (!uid) {
                          setIsAuthOpen(true);
                          return;
                        }
                        if (uid === help.userId) {
                          return toast("No puedes ayudarte a ti mismo.");
                        }
                        setIntentionItem({ id: help.id, title: help.title, type: "ayudar", kind: "eventual" });
                      }}
                      className="flex-1 bg-star/10 hover:bg-star/20 text-star font-bold text-sm py-3 rounded-xl transition-colors border border-star/20 text-center"
                    >
                      Quiero ayudar
                    </button>
                    <button
                      onClick={() => setSharingItem({ ...help, kind: "eventual" })}
                      className="p-3 bg-surface hover:bg-surface-2 text-cream hover:text-star border border-line rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
                      title="Difundir en Redes y WhatsApp"
                      aria-label="Compartir en redes"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>


      {/* MERCADO SOLIDARIO (Empresas) */}
      <section className="px-6 py-8 bg-star/5">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-6 h-6 text-star" />
          <h2 className="font-display text-xl font-bold text-cream">Mercado Solidario</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Empresas que donan parte de su stock o artículos nuevos. Exclusivo para la comunidad de Ayudarte.
        </p>

        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-line rounded-2xl bg-surface">
              <p className="text-muted text-sm">Por ahora no hay stock disponible.</p>
            </div>
          ) : (
            offers.map(offer => (
              <div key={offer.id} className="bg-surface rounded-3xl p-5 border border-line shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-line">
                  {offer.companyLogo ? (
                    <img src={offer.companyLogo} alt={offer.companyName} className="w-10 h-10 rounded-xl object-cover border border-line" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-cream font-bold">
                      {offer.companyName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-cream text-sm flex items-center gap-1.5">
                      {offer.companyName}
                      <ShieldCheck className="w-3.5 h-3.5 text-star" />
                    </h3>
                    <p className="text-[10px] text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {offer.userProvincia || 'Argentina'}
                    </p>
                  </div>
                </div>

                <h4 className="font-display font-bold text-lg text-cream mb-2 leading-tight">{offer.title}</h4>
                <p className="text-sm text-muted mb-4 leading-relaxed line-clamp-3">{offer.description}</p>

                {offer.media && offer.media.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden bg-surface-2 h-40 border border-line">
                    <img src={offer.media[0]} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <button
                  onClick={() => {
                    const uid = localStorage.getItem("ayudarte_user_id");
                    if (!uid) {
                      setIsAuthOpen(true);
                      return;
                    }
                    if (uid === offer.userId) {
                      return toast("No puedes solicitar tu propio ofrecimiento.");
                    }
                    setIntentionItem({ id: offer.id, title: offer.title, type: "reclamar", kind: "offer" });
                  }}
                  className="w-full bg-star/10 hover:bg-star/20 text-star font-bold text-sm py-3 rounded-xl transition-colors border border-star/20"
                >
                  Postularme para recibir esto
                </button>
              </div>
            ))
          )}
        </div>
      </section>


      {/* REGALOS DISPONIBLES */}
      <section className="px-6 py-8">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-star"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
          <h2 className="font-display text-xl font-bold text-cream">Regalos Disponibles</h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Cosas hermosas que la comunidad quiere regalar. Si sos un soñador y lo necesitas, ¡puedes reclamarlo!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {gifts.map(gift => (
            <div key={gift.id} className="bg-surface rounded-2xl border border-line p-3 shadow-sm flex flex-col group overflow-hidden">
              <div className="w-full h-28 relative rounded-xl overflow-hidden mb-3 border border-line/50">
                <img 
                  src={gift.images[0]} 
                  alt={gift.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-cream text-sm line-clamp-1">{gift.title}</h3>
              <p className="text-xs text-muted mt-1 mb-3 line-clamp-2">{gift.description}</p>
              <button 
                onClick={() => {
                  const userId = localStorage.getItem("ayudarte_user_id");
                  if (!userId) {
                    setIsAuthOpen(true);
                  } else {
                    setIntentionItem({ id: gift.id, title: gift.title, type: "reclamar" });
                  }
                }}
                className="mt-auto w-full bg-star/10 text-star font-bold text-xs py-2 rounded-lg hover:bg-star/20 transition-colors"
              >
                Reclamar
              </button>
            </div>
          ))}
          
          {gifts.length === 0 && (
            <div className="col-span-2 text-center py-8 border-2 border-dashed border-line rounded-2xl">
              <p className="text-muted text-sm">Aún no hay regalos disponibles.</p>
            </div>
          )}
        </div>
      </section>


      {/* MODAL: EL ORIGEN DE TODO */}
      {showOrigen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-line rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-surface/90 backdrop-blur-md p-4 flex justify-end z-10">
              <button 
                onClick={() => setShowOrigen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 text-muted hover:text-cream active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 pb-8 pt-2">
              <div className="w-16 h-16 rounded-full bg-warmth/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-cream text-center mb-6">El origen de todo</h2>
              
              <div className="text-sm leading-relaxed text-muted space-y-4">
                <p>
                  Todo comenzó con un sueño simple pero poderoso: crear una red donde la solidaridad no tenga barreras. 
                  Me di cuenta de que muchas personas tienen sueños pendientes y que, a nuestro alrededor, hay una comunidad entera dispuesta a ayudar si se les da la herramienta correcta.
                </p>
                <p>
                  Así nació <strong>Ayudarte.app</strong>. Conectamos personas con un sueño pendiente con una comunidad dispuesta a ayudar. Creemos en que, trabajando juntos, los sueños se hacen realidad.
                </p>
                <p>
                  Pero esta plataforma es solo una parte de mi viaje. A lo largo de mi vida aprendí lecciones muy duras, cometí errores, caí y me volví a levantar, y cada paso me trajo hasta aquí.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: RECLAMAR */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type={intentionItem?.type || "reclamar"} itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} itemKind={intentionItem?.kind || "dream"} />

      {/* MODAL DE DETALLE MULTIMEDIA, FICHA DEL PROPIETARIO Y CBU DIRECTO */}
      <MediaDetailModal
        isOpen={!!selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        item={selectedMediaItem}
        onHelp={(it) => {
          const uid = localStorage.getItem("ayudarte_user_id");
          if (!uid) {
            setIsAuthOpen(true);
            return;
          }
          if (uid === it.userId) {
            return toast("No puedes ayudarte a ti mismo.");
          }
          setIntentionItem({
            id: it.id,
            title: it.title,
            type: "ayudar",
            kind: it.kind || "dream",
          });
        }}
        onShare={(it) => setSharingItem({ ...it, kind: it.kind || "dream" })}
      />

      {/* MODAL DE DIFUSIÓN EN REDES SOCIALES Y WHATSAPP */}
      <ShareModal
        isOpen={!!sharingItem}
        onClose={() => setSharingItem(null)}
        item={sharingItem}
      />
    </div>
  );
}