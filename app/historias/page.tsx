export default function HistoriasPage() {
  return (
    <div className="px-6 pt-10">
      <h1 className="font-display text-xl font-semibold text-cream">Historias</h1>
      <p className="mt-2 text-sm text-muted">
        Acá va a vivir el feed completo de historias, con filtros por etapa
        y búsqueda. Conectar a la colección `historias` de Firestore.
      </p>
    </div>
  );
}
