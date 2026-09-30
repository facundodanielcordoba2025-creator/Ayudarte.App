with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('    </div>\n  );\n}', '      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n    </div>\n  );\n}')
with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
