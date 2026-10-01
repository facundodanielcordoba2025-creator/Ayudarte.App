with open('components/AuthModal.tsx', 'r') as f:
    c = f.read()

# Add state
c = c.replace('const [phone, setPhone] = useState("");', 'const [phone, setPhone] = useState("");\n  const [dni, setDni] = useState("");')

# Add to validation
c = c.replace('if (!name || !phone || !provincia) {', 'if (!name || !phone || !dni || !provincia) {')

# Add to Firestore payload
c = c.replace('name,\n        phone,\n        provincia,', 'name,\n        dni,\n        phone,\n        provincia,')

# Add UI field
new_ui = """
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Nombre completo</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">DNI / CUIT (Seguridad)</label>
                  <input type="text" value={dni} onChange={e=>setDni(e.target.value)} placeholder="Sin puntos ni espacios" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>
"""
c = c.replace("""
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Nombre completo</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                </div>""", new_ui)

with open('components/AuthModal.tsx', 'w') as f:
    f.write(c)
