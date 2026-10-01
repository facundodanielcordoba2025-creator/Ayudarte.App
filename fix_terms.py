with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    c = f.read()

# Add state
c = c.replace('const [isAuthOpen, setIsAuthOpen] = useState(false);', 'const [isAuthOpen, setIsAuthOpen] = useState(false);\n  const [showTerms, setShowTerms] = useState(true);')

# Add modal at the beginning of the return statement
terms_modal = """
      {/* MODAL DE TERMINOS Y CONDICIONES (REQUISITOS) */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-night/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-surface border border-star/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_30px_rgba(255,182,72,0.15)] relative animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-star" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream mb-2">Requisitos Excluyentes</h2>
              <p className="text-sm text-muted mb-6">
                Antes de contar tu sueño, debes comprometerte a cumplir con las siguientes reglas para poder ser beneficiario:
              </p>
              
              <div className="text-left space-y-3 mb-8 bg-surface-2 p-4 rounded-2xl border border-line">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-star/20 text-star flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</div>
                  <p className="text-sm text-cream">Ser <strong>mayor de edad</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-star/20 text-star flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</div>
                  <p className="text-sm text-cream"><strong>Seguirnos</strong> en todas nuestras redes sociales.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-star/20 text-star flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</div>
                  <p className="text-sm text-cream"><strong>Etiquetar a un amigo/a</strong> en nuestras redes.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-star/20 text-star flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">4</div>
                  <p className="text-sm text-cream"><strong>Compartir</strong> algún tipo de publicación nuestra.</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowTerms(false)}
                  className="w-full bg-star text-night font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform"
                >
                  Acepto los requisitos
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

with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(c)
