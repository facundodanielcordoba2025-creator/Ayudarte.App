"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake, Trophy, Calendar, BookOpen, ChevronRight, X, Target, Footprints, Users, Heart, RefreshCw, Star, Smile, Shield, Eye, Rocket, Send, Quote, Sparkles } from "lucide-react";

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
  const [reclamarModal, setReclamarModal] = useState<{ title: string; image: string } | null>(null);
  
  return (
    <div className="pb-28 animate-in fade-in duration-500">
      {/* HEADER / HERO */}
      <section className="px-6 pt-16 pb-8 bg-surface-2 border-b border-line relative overflow-hidden">


        <h1 className="sr-only">FACUTEAYUDA</h1>
        <div className="relative z-10 mb-4 w-64 mx-auto md:mx-0 flex justify-center md:justify-start">
          {/* Luz de fondo naranja */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-star/40 blur-[45px] rounded-full pointer-events-none"></div>
          
          <img 
            src="/logo.jpg" 
            alt="FACUTEAYUDA Logo" 
            className="relative w-full h-auto rounded-[2rem] drop-shadow-[0_0_25px_rgba(255,102,0,0.5)] border border-white/5"
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted relative z-10 max-w-[80%]">
          Conectamos personas con un sueño pendiente con una comunidad dispuesta a ayudar. 
          Creemos en que, trabajando juntos, los sueños se hacen realidad.
        </p>
        
        <div className="mt-5 relative z-10 flex flex-row w-full gap-3">
          <button
            onClick={() => setShowOrigen(true)}
            className="flex-1 inline-flex justify-center items-center gap-1.5 text-[10px] sm:text-xs font-bold text-white transition-colors bg-star hover:bg-star/90 px-2 py-3 rounded-full shadow-[0_2px_10px_rgba(255,102,0,0.3)] active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            EL ORIGEN
          </button>
          <Link
            href="/libro"
            className="flex-1 inline-flex justify-center items-center gap-1.5 text-[10px] sm:text-xs font-bold text-white transition-colors bg-star hover:bg-star/90 px-2 py-3 rounded-full shadow-[0_2px_10px_rgba(255,102,0,0.3)] active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            MI CONSEJO
          </Link>
        </div>
      </section>

      {/* SECCIÓN: MOTIVATE (Carrusel de Frases) */}
      <section className="px-6 py-12 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="w-6 h-6 text-warmth" />
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

      {/* REGALOS DISPONIBLES */}
      <section className="px-6 py-8">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmth"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
          <h2 className="font-display text-xl font-bold text-cream">Regalos Disponibles</h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Cosas hermosas que la comunidad quiere regalar. Si sos un soñador y lo necesitas, ¡puedes reclamarlo!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Regalo 1 */}
          <div className="bg-surface rounded-2xl border border-line p-3 shadow-sm flex flex-col group overflow-hidden">
            <div className="w-full h-28 relative rounded-xl overflow-hidden mb-3 border border-line/50">
              <img 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80" 
                alt="Bicicleta Infantil"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="font-bold text-cream text-sm">Bicicleta Infantil</h3>
            <p className="text-xs text-muted mt-1 mb-3">Usada en muy buen estado. Rodado 16.</p>
            <button 
              onClick={() => setReclamarModal({ title: "Bicicleta Infantil", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&auto=format&fit=crop&q=80" })}
              className="mt-auto w-full bg-star/10 text-star font-bold text-xs py-2 rounded-lg hover:bg-star/20 transition-colors"
            >
              Reclamar
            </button>
          </div>

          {/* Regalo 2 */}
          <div className="bg-surface rounded-2xl border border-line p-3 shadow-sm flex flex-col group overflow-hidden">
            <div className="w-full h-28 relative rounded-xl overflow-hidden mb-3 border border-line/50">
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80" 
                alt="Lote de Libros"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="font-bold text-cream text-sm">Lote de Libros</h3>
            <p className="text-xs text-muted mt-1 mb-3">Libros de cuentos y manuales escolares.</p>
            <button 
              onClick={() => setReclamarModal({ title: "Lote de Libros", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80" })}
              className="mt-auto w-full bg-star/10 text-star font-bold text-xs py-2 rounded-lg hover:bg-star/20 transition-colors"
            >
              Reclamar
            </button>
          </div>
        </div>
      </section>

      {/* SORTEO Y GANADORES */}
      <section className="px-6 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-warmth" />
          <h2 className="font-display text-xl font-bold text-cream">Sorteos y Adjudicados</h2>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
          <div className="bg-star/10 px-5 py-4 border-b border-line flex justify-between items-center">
            <span className="text-sm font-bold text-star uppercase tracking-wide">Último Ganador</span>
            <span className="text-xs font-semibold text-muted bg-surface px-2 py-1 rounded-md">Mayo 2026</span>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-cream text-lg">Micaela Fernández</h3>
            <p className="text-sm text-muted mt-1">San Miguel de Tucumán, Tucumán</p>
            <p className="mt-3 text-sm text-cream bg-surface-2 p-3 rounded-xl border border-line">
              "Gracias a todos, pude conseguir la silla de ruedas deportiva para volver a jugar al básquet."
            </p>
          </div>
          <div className="bg-surface-2 px-5 py-3 border-t border-line flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Próximo sorteo: <strong>15 de Junio</strong></span>
            </div>
          </div>
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
                  Así nació <strong>Facuteayuda</strong>. Una plataforma para conectar a quienes necesitan un empujón con aquellos que tienen ganas de darlo. 
                </p>
                <p>
                  Pero esta plataforma es solo una parte de mi viaje. A lo largo de mi vida aprendí lecciones muy duras, cometí errores, caí y me volví a levantar. Para inspirar a más personas y dejarle un legado a mi hija, decidí escribir un libro contando cada paso y cada desafío.
                </p>
                <p className="font-bold text-center mt-6 text-cream">
                  Ese libro se llama "Mi Consejo", y te invito a leerlo en la sección oficial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: RECLAMAR */}
      {reclamarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-line rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-4 border-b border-line bg-surface-2">
              <h3 className="font-bold text-cream">
                {reclamarModal.submitted ? '¡Solicitud Aprobada!' : 'Reclamar Regalo'}
              </h3>
              <button 
                onClick={() => setReclamarModal(null)}
                className="w-8 h-8 rounded-full bg-line/50 flex items-center justify-center text-muted hover:text-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-line/50">
                  <img src={reclamarModal.image} alt={reclamarModal.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-cream text-lg">{reclamarModal.title}</h4>
                  <p className="text-xs text-muted">
                    {reclamarModal.submitted ? 'El donante aceptó entregártelo.' : 'Serás conectado con el donante.'}
                  </p>
                </div>
              </div>
              
              {!reclamarModal.submitted ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-cream mb-2">¿Por qué lo necesitas?</label>
                    <p className="text-xs text-muted mb-2">
                      Escribe un mensaje breve al donante explicando por qué este regalo te ayudaría.
                    </p>
                    <textarea 
                      rows={4}
                      placeholder="Hola! Este regalo me sería súper útil porque..."
                      className="w-full bg-surface-2 border border-line rounded-xl px-4 py-3 text-sm text-cream placeholder:text-muted/50 focus:outline-none focus:border-star transition-colors resize-none"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setReclamarModal({ ...reclamarModal, submitted: true })}
                    className="w-full bg-star text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Solicitud
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-warmth/10 border border-warmth/30 p-4 rounded-xl text-center">
                    <p className="text-sm text-cream font-medium">
                      (Simulación) Cuando el dueño apruebe tu solicitud en la vida real, te aparecerá este botón:
                    </p>
                  </div>
                  <button 
                    onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                    className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.3)] hover:bg-[#22bf5b] active:scale-95 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                    Contactar por WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
