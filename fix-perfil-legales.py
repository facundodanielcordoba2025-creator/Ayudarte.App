with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

footer_link = """
      <div className="px-6 py-10 flex justify-center">
        <button onClick={() => router.push('/legales')} className="text-xs font-bold text-muted hover:text-star transition-colors underline underline-offset-4">
          Términos, Privacidad y Políticas Legales
        </button>
      </div>
    </div>
"""

c = c.replace('    </div>\n  );\n}', footer_link + '  );\n}')

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
