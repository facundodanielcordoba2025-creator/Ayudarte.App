"use client";

import { CircleUserRound, Settings, HelpCircle, ChevronDown, Bell, LogOut, ShieldCheck, Heart, Gift } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

export default function PerfilPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  return (
    <div className="pb-28 min-h-screen bg-surface-2 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-10">
        <h1 className="font-display text-2xl font-bold text-cream">Mi Cuenta</h1>
        <p className="text-sm text-muted mt-1">Gestioná tu perfil y resolvé tus dudas.</p>
      </div>

      {/* TARJETA DE USUARIO (Placeholder) */}
      <div className="px-6 mt-6">
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

      {/* TÉRMINOS Y CONDICIONES (Inspirado en TECHO) */}
      <div className="px-6 mt-10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-star" />
          <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Términos y Condiciones</h2>
        </div>
        
        <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
          <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none bg-surface-2">
            <h3 className="font-bold text-cream text-sm">Leer Términos, Bases y Condiciones</h3>
            <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
          </summary>
          <div className="p-5 border-t border-line mt-2 text-xs leading-relaxed text-muted space-y-4 max-h-[300px] overflow-y-auto">
            <h4 className="font-bold text-cream uppercase tracking-wider text-[10px]">1. Objeto de la Plataforma</h4>
            <p>Ayudarte.app es una red solidaria sin fines de lucro que actúa como nexo entre personas con sueños pendientes e individuos o empresas dispuestas a colaborar económicamente o mediante la donación de objetos. Al utilizar nuestra plataforma, aceptas estos términos en su totalidad.</p>
            
            <h4 className="font-bold text-cream uppercase tracking-wider text-[10px] mt-4">2. Políticas de Donación y Fondos</h4>
            <p>Los aportes económicos realizados mediante tarjeta de crédito, débito o transferencia se destinan al fondo solidario de Ayudarte.app. Estos fondos son administrados para la ejecución de los sueños verificados y la logística de los sorteos mensuales (Superhéroes). Las donaciones son voluntarias y definitivas.</p>
            
            <h4 className="font-bold text-cream uppercase tracking-wider text-[10px] mt-4">3. Cancelación de Aportes Recurrentes</h4>
            <p>El usuario (Socio Donante) tiene el derecho de solicitar la baja de su aporte mensual en cualquier momento. La baja se puede realizar directamente desde el panel de usuario o comunicándose por correo electrónico. No se generarán cargos posteriores a la fecha efectiva de baja, pero no se realizarán reembolsos por períodos ya debitados.</p>
            
            <h4 className="font-bold text-cream uppercase tracking-wider text-[10px] mt-4">4. Privacidad y Protección de Datos</h4>
            <p>Ayudarte.app respeta la privacidad de todos sus usuarios. La información personal recopilada (nombre, correo, datos de contacto) será utilizada única y exclusivamente para mantener la comunicación sobre el impacto de su donación, envío de novedades y gestión de sorteos. Nunca comercializaremos tus datos personales con terceros (Ley de Protección de Datos Personales N° 25.326).</p>
            
            <h4 className="font-bold text-cream uppercase tracking-wider text-[10px] mt-4">5. Veracidad de los Sueños y Objetos</h4>
            <p>Los usuarios que postulen "Sueños" o publiquen objetos para regalar se comprometen a brindar información veraz y fotos reales. Ayudarte.app se reserva el derecho de eliminar perfiles o publicaciones que infrinjan las normas de convivencia, contengan contenido inapropiado o resulten fraudulentas.</p>
          </div>
        </details>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
