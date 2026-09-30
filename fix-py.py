with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    c = f.read()
c = c.replace('    </div>\n  );\n}', '      <AuthModal isOpen={isAuthOpen} onClose={() => { setIsAuthOpen(false); setIsLoggedIn(true); }} />\n    </div>\n  );\n}')
with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(c)
