"use client";

import { useState } from "react";
import { ShieldCheck, Scale, FileText, Building2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LegalesPage() {
  const [activeTab, setActiveTab] = useState("terminos");

  return (
    <div className="min-h-screen bg-night pb-28 animate-in fade-in duration-500">
      
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-40">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-cream mb-4 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold">Volver</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-cream">Legal y Transparencia</h1>
        <p className="text-sm text-muted mt-1">Marco normativo y políticas de Ayudarte.App</p>
      </div>

      <div className="px-4 py-4">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          <button onClick={() => setActiveTab("terminos")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === "terminos" ? "bg-star text-night" : "bg-surface-2 text-muted border border-line"}`}>Términos y Condiciones</button>
          <button onClick={() => setActiveTab("privacidad")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === "privacidad" ? "bg-star text-night" : "bg-surface-2 text-muted border border-line"}`}>Política de Privacidad</button>
          <button onClick={() => setActiveTab("datos")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === "datos" ? "bg-star text-night" : "bg-surface-2 text-muted border border-line"}`}>Uso de Datos</button>
          <button onClick={() => setActiveTab("rse")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === "rse" ? "bg-star text-night" : "bg-surface-2 text-muted border border-line"}`}>Responsabilidad (RSE)</button>
        </div>
      </div>

      <div className="px-6 mt-2 space-y-6 text-sm text-muted leading-relaxed">
        {activeTab === "terminos" && (
          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Términos y Condiciones de Uso</h2>
            </div>
            <p className="mb-4">1. <strong>Naturaleza del Servicio:</strong> Ayudarte.App actúa exclusivamente como plataforma intermediaria de vinculación solidaria entre donantes y beneficiarios. No somos responsables del estado de los bienes materiales donados ni garantizamos la entrega inmediata de aportes económicos, los cuales están sujetos a los tiempos de recaudación y logística.</p>
            <p className="mb-4">2. <strong>Veracidad de la Información:</strong> Todo usuario que publica un sueño (beneficiario) declara bajo juramento que su situación de vulnerabilidad o necesidad es real. La plataforma se reserva el derecho de eliminar sueños, expulsar usuarios y tomar acciones legales ante casos de fraude, estafa o suplantación de identidad.</p>
            <p className="mb-4">3. <strong>Aportes Voluntarios:</strong> Las donaciones económicas no constituyen una compra, inversión ni abono. Son transferencias voluntarias y no reembolsables. Ayudarte.App retiene únicamente el 5% de lo recaudado de forma mensual y transparente para financiar los sorteos y mantener la infraestructura operativa, siendo el resto destinado íntegramente a las causas solidarias.</p>
            <p>4. <strong>Logística y Entregas:</strong> Para salvaguardar la integridad física de las partes, los donantes y beneficiarios no se contactarán directamente de manera inicial. El equipo de Ayudarte actuará como mediador oficial para coordinar el retiro y la entrega de bienes materiales.</p>
          </div>
        )}

        {activeTab === "privacidad" && (
          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Política de Privacidad</h2>
            </div>
            <p className="mb-4">De conformidad con la Ley Nacional de Protección de Datos Personales (Ley 25.326 de la República Argentina), informamos a los usuarios que sus datos personales (Nombre, DNI, Teléfono, Email y Ubicación) serán almacenados en una base de datos segura administrada exclusivamente por Ayudarte.App.</p>
            <p className="mb-4"><strong>Confidencialidad:</strong> Nos comprometemos a mantener el más estricto secreto profesional respecto a los datos recopilados. Jamás venderemos, alquilaremos ni comercializaremos las bases de datos a empresas de terceros con fines publicitarios.</p>
            <p><strong>Exposición pública:</strong> Al publicar un sueño, el usuario acepta que su primer nombre, historia, provincia y fotografías sean exhibidas públicamente en la plataforma con el único fin de facilitar la ayuda solidaria. Los datos de contacto directo (Teléfono/DNI) permanecerán siempre ocultos al público general.</p>
          </div>
        )}

        {activeTab === "datos" && (
          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Uso de Datos y Cookies</h2>
            </div>
            <p className="mb-4">Ayudarte.App recopila información técnica (como dirección IP, tipo de dispositivo y patrones de navegación) mediante el uso de cookies y tecnologías similares para garantizar el correcto funcionamiento técnico de la plataforma y prevenir ataques cibernéticos.</p>
            <p className="mb-4"><strong>Derecho al Olvido:</strong> Cualquier usuario tiene el derecho irrenunciable de solicitar la rectificación, actualización o eliminación definitiva de todos sus registros en nuestra base de datos, enviando un requerimiento a través del canal de soporte. Una vez procesado, el historial de donaciones pasará a ser completamente anónimo.</p>
          </div>
        )}

        {activeTab === "rse" && (
          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Responsabilidad Social Empresarial</h2>
            </div>
            <p className="mb-4"><strong>Empresas Solidarias:</strong> Las organizaciones o personas jurídicas que se registren en Ayudarte.App para donar stock inmovilizado o aportes de capital, consienten que su Nombre Institucional y Logotipo sean exhibidos en el muro de "Súperhéroes".</p>
            <p>Esta exhibición representa un reconocimiento público de la plataforma por su Responsabilidad Social Empresarial (RSE), pero no constituye una sociedad comercial, patrocinio oficial, ni vinculación contractual vinculante entre la Empresa y Ayudarte.App.</p>
          </div>
        )}
      </div>
    </div>
  );
}
