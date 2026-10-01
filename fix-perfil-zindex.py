with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-10"', 'className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-40"')

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
