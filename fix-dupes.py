import re

with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

# Using regex to remove the entire section from <div className="px-6 mt-10 mb-8"> to </details>\n      </div>
pattern = r'      <div className="px-6 mt-10 mb-8">\n        <div className="flex items-center gap-2 mb-4">\n          <ShieldCheck className="w-5 h-5 text-star" />\n          <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Términos y Condiciones</h2>\n        </div>\n        \n        <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">.*?</details>\n      </div>\n'
c = re.sub(pattern, '', c, flags=re.DOTALL)

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
