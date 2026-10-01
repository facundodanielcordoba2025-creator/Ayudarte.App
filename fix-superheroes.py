with open('app/donadores/page.tsx', 'r') as f:
    c = f.read()

banner_ui = """
      <div className="px-6 pt-6">
        <div className="bg-gradient-to-br from-star/20 to-surface border border-star/30 rounded-3xl p-5 shadow-[0_0_20px_rgba(255,182,72,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-star/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <Gift className="w-6 h-6 text-star" />
            <h2 className="font-display text-lg font-bold text-cream">Tu ayuda vuelve en buenos actos</h2>
          </div>
          
          <div className="space-y-3 relative z-10 text-xs text-cream/90 leading-relaxed">
            <p>
              Dentro de las ayudas económicas, destinamos un mínimo porcentaje a comprar cosas: por ejemplo, una aspiradora, una notebook o hasta incluso una moto 110cc. Las mismas <strong>se sortean de manera gratuita entre los superhéroes</strong> de este ranking.
            </p>
            <p>
              La regla de oro es ocupar <strong>solo el 5%</strong> de lo recaudado en el mes. Recuerda que nuestra finalidad principal no son los sorteos, sino cumplir sueños. Pero somos muy agradecidos... y este mes, capaz tú puedas ser el suertudo ganador de una tablet.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-6 space-y-4">
"""

c = c.replace('<div className="px-6 pt-6 space-y-4">', banner_ui)

with open('app/donadores/page.tsx', 'w') as f:
    f.write(c)
