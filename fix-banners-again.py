with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

action_banners = """
      {/* PANELES DE ACCION */}
      {userId && userData && (
        <div className="px-6 mt-8 space-y-4">
          {!userData.isCompany && (
            <button 
              onClick={() => {
                if (myDreams.length >= 2) {
                  alert("Ya tienes 2 sueños publicados. Para publicar uno nuevo, debes eliminar alguno de los anteriores.");
                } else {
                  router.push('/contar-mi-sueno');
                }
              }}
              className="w-full bg-surface border-2 border-star/50 rounded-3xl p-6 text-left relative overflow-hidden active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                <div className="w-12 h-12 bg-star text-night rounded-2xl flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cream text-lg">Contar Mi Sueño</h3>
                  <p className="text-xs text-muted mt-1">
                    {myDreams.length >= 2 ? "Has alcanzado el límite (2/2)" : "Pide ayuda a la comunidad"}
                  </p>
                </div>
              </div>
            </button>
          )}

          <button 
            onClick={() => router.push('/regalar')}
            className="w-full bg-gradient-to-br from-star/20 to-surface border-2 border-star/50 rounded-3xl p-6 text-left relative overflow-hidden active:scale-95 transition-transform"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none"></div>
            <div className="flex items-center gap-4 relative z-10 pointer-events-none">
              <div className="w-12 h-12 bg-star text-night rounded-2xl flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-cream text-lg">Quiero Ser Superhéroe</h3>
                <p className="text-xs text-muted mt-1">Dona objetos o apoya a otros</p>
              </div>
            </div>
          </button>
        </div>
      )}
"""

# Find PREGUNTAS FRECUENTES and inject above it
c = c.replace('      {/* PREGUNTAS FRECUENTES (Inspirado en UNICEF) */}', action_banners + '\n      {/* PREGUNTAS FRECUENTES (Inspirado en UNICEF) */}')

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
