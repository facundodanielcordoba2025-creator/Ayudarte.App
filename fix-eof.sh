sed -i '' 's/    <\/div>\n  );\n}/      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} \/>\n    <\/div>\n  );\n}/g' app/perfil/page.tsx
