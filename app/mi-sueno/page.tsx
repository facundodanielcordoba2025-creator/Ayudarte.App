export default function MiSuenoPage() {
  return (
    <div className="px-6 pt-10">
      <h1 className="font-display text-xl font-semibold text-cream">Mi sueño</h1>
      <p className="mt-2 text-sm text-muted">
        Panel personal del usuario: estado de su sueño, actualizaciones y
        mensajes recibidos. Requiere sesión (Firebase Auth).
      </p>
    </div>
  );
}
