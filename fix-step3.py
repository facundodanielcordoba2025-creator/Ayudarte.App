with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    c = f.read()

step3_content = """        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center py-4">
            <div className="w-16 h-16 bg-star/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-star" fill="currentColor" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-cream">
              ¡Casi listo!
            </h2>
            
            <div className="bg-surface border border-star/30 rounded-2xl p-5 mt-6 text-left shadow-[0_0_15px_rgba(255,182,72,0.1)]">
              <h3 className="font-bold text-star text-sm uppercase tracking-wider mb-3">Recordatorio Excluyente</h3>
              <p className="text-xs text-muted mb-3 leading-relaxed">
                Una vez que finalices el proceso de carga de tu sueño, recuerda que debes cumplir con estos requisitos para poder recibir tu sueño en caso de ser beneficiario:
              </p>
              <ul className="text-sm text-cream space-y-2 font-medium">
                <li className="flex items-center gap-2"><span>1.</span> Ser mayor de edad.</li>
                <li className="flex items-center gap-2"><span>2.</span> Seguirnos en redes sociales.</li>
                <li className="flex items-center gap-2"><span>3.</span> Etiquetar a un amigo/a en nuestras redes.</li>
                <li className="flex items-center gap-2"><span>4.</span> Compartir algún tipo de publicación.</li>
              </ul>
            </div>
          </div>
        )}"""

# Replace the existing step 3
import re
c = re.sub(r'\{step === 3 && \((.*?)\)\}', step3_content, c, flags=re.DOTALL)

with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(c)
