"use client";

import React, { useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellRing, BellOff, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function PushNotificationPrompt({ compact = false }: { compact?: boolean }) {
  const { isSupported, permission, isSubscribed, loading, subscribe, unsubscribe, sendTestPush } =
    usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (!isSupported || dismissed) return null;

  // Si ya tiene permiso denegado en el navegador, no molestamos con banners invasivos
  if (permission === "denied" && !compact) return null;

  if (compact) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-star/15 border border-star/30 flex items-center justify-center shrink-0">
            {isSubscribed ? (
              <BellRing className="w-5 h-5 text-star animate-pulse" />
            ) : (
              <Bell className="w-5 h-5 text-star" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-cream text-sm">Notificaciones Push</h4>
            <p className="text-xs text-muted">
              {isSubscribed
                ? "Recibiendo novedades y casos urgentes"
                : "Enterate de sueños y casos prioritarios"}
            </p>
          </div>
        </div>

        {isSubscribed ? (
          <div className="flex items-center gap-2">
            <button
              onClick={sendTestPush}
              disabled={loading}
              className="px-3 py-1.5 bg-surface-2 hover:bg-line text-cream text-xs font-semibold rounded-xl border border-line transition-all active:scale-95"
            >
              Probar
            </button>
            <button
              onClick={unsubscribe}
              disabled={loading}
              className="p-2 text-muted hover:text-red-400 rounded-xl hover:bg-surface-2 transition-colors"
              title="Desactivar"
            >
              <BellOff className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={subscribe}
            disabled={loading}
            className="px-4 py-2 bg-star hover:bg-star-dim text-night font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
            Activar
          </button>
        )}
      </div>
    );
  }

  // Si ya está suscrito en modo normal, no mostramos el banner grande para no ocupar espacio
  if (isSubscribed) return null;

  return (
    <div className="relative bg-gradient-to-r from-surface to-surface-2 border border-star/30 rounded-3xl p-5 shadow-xl overflow-hidden my-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3.5 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-star/20 border border-star/40 flex items-center justify-center shrink-0 shadow-inner">
          <BellRing className="w-6 h-6 text-star" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-star bg-star/15 px-2 py-0.5 rounded-full border border-star/30">
              Novedades en vivo
            </span>
          </div>
          <h3 className="font-display font-bold text-cream text-base leading-snug">
            ¿Querés enterarte cuando se cumpla un sueño?
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Activá las notificaciones para recibir alertas cuando alguien cercano necesite ayuda o se logre cumplir una meta.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={subscribe}
              disabled={loading}
              className="px-5 py-2.5 bg-star hover:bg-star-dim text-night font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Activar Notificaciones
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs font-semibold text-muted hover:text-cream py-2 px-3 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
