with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

# Imports
c = c.replace('import { AuthModal } from "@/components/AuthModal";', 'import { AuthModal } from "@/components/AuthModal";\nimport { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";\nimport { db } from "@/lib/firebase";\nimport { Trash2 } from "lucide-react";\nimport { useEffect } from "react";')

# State
c = c.replace('const [isAuthOpen, setIsAuthOpen] = useState(false);', 'const [isAuthOpen, setIsAuthOpen] = useState(false);\n  const [myDreams, setMyDreams] = useState<any[]>([]);\n  const [userId, setUserId] = useState<string | null>(null);\n\n  useEffect(() => {\n    const uid = localStorage.getItem("ayudarte_user_id");\n    setUserId(uid);\n    if (uid) {\n      const q = query(collection(db, "dreams"), where("userId", "==", uid));\n      return onSnapshot(q, (snap) => setMyDreams(snap.docs.map(d => ({id: d.id, ...d.data()}))));\n    }\n  }, []);')

# Add My Dreams section before FAQ
my_dreams_ui = """
      {userId && (
        <div className="px-6 mt-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-star" />
            <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Mis Sueños Publicados</h2>
          </div>
          
          {myDreams.length === 0 ? (
            <div className="bg-surface border border-line rounded-2xl p-6 text-center">
              <p className="text-sm text-muted">Aún no has publicado ningún sueño.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myDreams.map(dream => (
                <div key={dream.id} className="bg-surface border border-line rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-cream text-sm">{dream.title}</h3>
                    <p className="text-xs text-muted mt-1 truncate max-w-[200px]">{dream.history}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if(confirm("¿Seguro que quieres borrar este sueño?")) {
                        deleteDoc(doc(db, "dreams", dream.id));
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

"""
c = c.replace('      {/* PREGUNTAS FRECUENTES */}', my_dreams_ui + '      {/* PREGUNTAS FRECUENTES */}')
c = c.replace('import { ShieldCheck', 'import { Star, ShieldCheck')

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
