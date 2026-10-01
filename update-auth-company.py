with open('components/AuthModal.tsx', 'r') as f:
    c = f.read()

# Add states
c = c.replace('const [phone, setPhone] = useState("");', 'const [phone, setPhone] = useState("");\n  const [isCompany, setIsCompany] = useState(false);\n  const [companyName, setCompanyName] = useState("");\n  const [companyLogoUrl, setCompanyLogoUrl] = useState("");')

# Wait, instead of complicated file upload for the logo right inside AuthModal, let's keep it simple. 
# Oh they explicitly asked: "incluso subir el logotipo de la empresa".
# Okay, I will add a file input for the logo and upload it to Storage, just like in contar-mi-sueno.
# First, import ref, uploadBytesResumable, getDownloadURL from storage if not there.
imports = 'import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";\nimport { storage } from "@/lib/firebase";'
if 'from "firebase/storage"' not in c:
    c = c.replace('import { db } from "@/lib/firebase";', 'import { db, storage } from "@/lib/firebase";\nimport { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";')

# State for logo file
c = c.replace('const [companyLogoUrl, setCompanyLogoUrl] = useState("");', 'const [companyLogo, setCompanyLogo] = useState<File | null>(null);\n  const [uploadingLogo, setUploadingLogo] = useState(false);')

# Modify handleCompleteProfile to upload logo if company
handle_complete_old = """
  const handleCompleteProfile = async () => {
    if (!name || !phone || !provincia) {
      return alert("Por favor completa todos los campos");
    }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email,
        name,
        phone,
        provincia,
        createdAt: Date.now()
      });
"""

handle_complete_new = """
  const handleCompleteProfile = async () => {
    if (!name || !phone || !provincia) {
      return alert("Por favor completa todos los campos personales");
    }
    if (isCompany && !companyName) {
      return alert("Por favor ingresa el nombre de tu empresa");
    }
    
    setLoading(true);
    try {
      let logoUrl = "";
      if (isCompany && companyLogo) {
        const logoRef = ref(storage, `logos/${Date.now()}_${companyLogo.name}`);
        const uploadTask = await uploadBytesResumable(logoRef, companyLogo);
        logoUrl = await getDownloadURL(uploadTask.ref);
      }

      const docRef = await addDoc(collection(db, "users"), {
        email,
        name,
        phone,
        provincia,
        isCompany,
        companyName: isCompany ? companyName : null,
        companyLogo: isCompany ? logoUrl : null,
        createdAt: Date.now()
      });
"""

c = c.replace(handle_complete_old, handle_complete_new)

# Modify Step 3 UI
ui_old = """
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Provincia</label>
                  <select value={provincia} onChange={e=>setProvincia(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none">
                    <option value="">Selecciona tu provincia...</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="CABA">CABA</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleCompleteProfile}
                disabled={loading}
"""

ui_new = """
                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Provincia</label>
                  <select value={provincia} onChange={e=>setProvincia(e.target.value)} className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none">
                    <option value="">Selecciona tu provincia...</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="CABA">CABA</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Tucumán">Tucumán</option>
                    <option value="Mendoza">Mendoza</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-line mt-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface border border-line rounded-xl hover:border-star transition-colors">
                    <input type="checkbox" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} className="w-5 h-5 accent-star rounded" />
                    <div>
                      <span className="text-sm font-bold text-cream block">Represento a una Empresa</span>
                      <span className="text-xs text-muted">Quiero donar en nombre de mi marca</span>
                    </div>
                  </label>
                </div>

                {isCompany && (
                  <div className="space-y-3 bg-star/5 border border-star/20 p-4 rounded-xl animate-in fade-in zoom-in-95">
                    <div>
                      <label className="text-xs font-bold text-star uppercase tracking-wider mb-1 block">Nombre de la Empresa</label>
                      <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Ej: Zapatillas Juan" className="w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-cream focus:border-star focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-star uppercase tracking-wider mb-1 block">Logotipo (Opcional)</label>
                      <input type="file" accept="image/*" onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)} className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-star/20 file:text-star hover:file:bg-star/30 cursor-pointer" />
                      {companyLogo && <p className="text-[10px] text-green-400 mt-1">Logo seleccionado: {companyLogo.name}</p>}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleCompleteProfile}
                disabled={loading}
"""

c = c.replace(ui_old, ui_new)

with open('components/AuthModal.tsx', 'w') as f:
    f.write(c)
