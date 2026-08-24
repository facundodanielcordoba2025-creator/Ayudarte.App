"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <WifiOff className="h-8 w-8 text-muted" />
      <h1 className="font-display mt-4 text-lg font-semibold text-cream">
        Sin conexión por ahora
      </h1>
      <p className="mt-2 text-sm text-muted">
        Revisá tu conexión a internet. Las historias y sueños necesitan
        estar online para cargar.
      </p>
    </div>
  );
}
