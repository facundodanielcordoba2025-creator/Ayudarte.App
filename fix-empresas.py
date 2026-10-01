with open('app/donadores/page.tsx', 'r') as f:
    c = f.read()

empresas_ui = """
      <div className="px-6 pt-10 pb-4 border-t border-line mt-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-star/20 flex items-center justify-center">
            <span className="text-lg">🤝</span>
          </div>
          <h2 className="font-display text-xl font-bold text-cream">Empresas Solidarias</h2>
        </div>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          Marcas comprometidas que donan sus excedentes de stock para hacer realidad los sueños de nuestra comunidad.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors">
            <div className="w-16 h-16 bg-surface-2 rounded-full mb-3 flex items-center justify-center text-muted font-bold">
              LOGO
            </div>
            <h3 className="text-sm font-bold text-cream">Tu Empresa Aquí</h3>
            <p className="text-[10px] text-muted mt-1">Sponsor Oficial</p>
          </div>
          <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors">
            <div className="w-16 h-16 bg-surface-2 rounded-full mb-3 flex items-center justify-center text-muted font-bold">
              LOGO
            </div>
            <h3 className="text-sm font-bold text-cream">Súmate</h3>
            <p className="text-[10px] text-muted mt-1">Contáctanos</p>
          </div>
        </div>
      </div>
"""

c = c.replace('      </div>\n    </div>\n  );\n}', '      </div>\n' + empresas_ui + '    </div>\n  );\n}')

with open('app/donadores/page.tsx', 'w') as f:
    f.write(c)
