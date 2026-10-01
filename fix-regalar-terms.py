with open('app/regalar/page.tsx', 'r') as f:
    c = f.read()

# Add state
c = c.replace('const [isAuthOpen, setIsAuthOpen] = useState(false);', 'const [isAuthOpen, setIsAuthOpen] = useState(false);\n  const [showTerms, setShowTerms] = useState(true);')

# Add Modal
terms_modal = """
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-star/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(255,182,72,0.15)] relative animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-star" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream mb-2">Regalar un Objeto</h2>
              <div className="text-sm text-muted mb-8 text-left leading-relaxed bg-surface-2 p-5 rounded-2xl border border-line">
                <p>
                  Al completar este formulario, el artículo quedará publicado en nuestra sección de Regalos Disponibles.
                </p>
                <p className="mt-4 text-cream font-medium">
                  <strong>Importante:</strong> Cuando un soñador lo solicite, nosotros (el equipo de Ayudarte.App) nos pondremos en contacto con vos para coordinar el retiro o el envío de manera 100% segura. No tendrás que lidiar con desconocidos.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowTerms(false)}
                  className="w-full bg-star text-night font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform"
                >
                  Entendido, quiero donar
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full bg-surface-2 text-muted font-semibold py-3.5 rounded-xl border border-line hover:text-cream active:scale-95 transition-all"
                >
                  Cancelar y volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
"""

c = c.replace('return (\n    <div className="pb-28 min-h-screen bg-surface-2 flex flex-col">', 'return (\n    <div className="pb-28 min-h-screen bg-surface-2 flex flex-col">' + terms_modal)

with open('app/regalar/page.tsx', 'w') as f:
    f.write(c)
