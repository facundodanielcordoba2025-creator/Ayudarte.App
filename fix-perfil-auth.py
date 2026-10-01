with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

import re

# Add state and effect for userData
c = c.replace('const [userId, setUserId] = useState<string | null>(null);', 'const [userId, setUserId] = useState<string | null>(null);\n  const [userData, setUserData] = useState<any>(null);')

effect = """  useEffect(() => {
    const uid = localStorage.getItem("ayudarte_user_id");
    setUserId(uid);
    if (uid) {
      const q = query(collection(db, "dreams"), where("userId", "==", uid));
      const unsubDreams = onSnapshot(q, (snap) => setMyDreams(snap.docs.map(d => ({id: d.id, ...d.data()}))));
      
      const unsubUser = onSnapshot(doc(db, "users", uid), (docSnap) => {
        if (docSnap.exists()) setUserData(docSnap.data());
      });
      return () => { unsubDreams(); unsubUser(); };
    }
  }, []);"""

c = re.sub(r'  useEffect\(\(\) => \{[\s\S]*?  \}, \[\]\);', effect, c)

# Replace the login card and button
old_ui = """      {/* TARJETA DE USUARIO (Placeholder) */}
      <div className="px-6 mt-6">
        <div className="bg-surface border border-line rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center shrink-0 border-2 border-line">
            <CircleUserRound className="w-8 h-8 text-muted" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-cream text-lg">Ingresá a tu cuenta</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Iniciá sesión para publicar un sueño o reclamar un regalo disponible.
            </p>
          </div>
        </div>
        <button onClick={() => setIsAuthOpen(true)} className="w-full mt-4 bg-star text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform">
          INICIAR SESIÓN / REGISTRARSE
        </button>
      </div>"""

new_ui = """      {/* TARJETA DE USUARIO */}
      <div className="px-6 mt-6">
        {userId ? (
          <div className="space-y-4">
            <div className="bg-surface border border-star/30 rounded-3xl p-6 shadow-[0_0_15px_rgba(255,182,72,0.1)] flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-star/20 flex items-center justify-center shrink-0 border-2 border-star/50">
                <CircleUserRound className="w-8 h-8 text-star" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-cream text-lg">¡Hola, {userData?.name || 'Superhéroe'}!</h2>
                <p className="text-xs text-star mt-1 leading-relaxed font-semibold">
                  Sesión iniciada correctamente.
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("ayudarte_user_id");
                setUserId(null);
                setUserData(null);
                window.location.reload();
              }} 
              className="w-full bg-surface-2 text-muted font-bold py-3.5 rounded-xl border border-line active:scale-95 transition-transform"
            >
              CERRAR SESIÓN
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-surface border border-line rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center shrink-0 border-2 border-line">
                <CircleUserRound className="w-8 h-8 text-muted" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-cream text-lg">Ingresá a tu cuenta</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Iniciá sesión para publicar un sueño o reclamar un regalo disponible.
                </p>
              </div>
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full mt-4 bg-star text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform">
              INICIAR SESIÓN / REGISTRARSE
            </button>
          </div>
        )}
      </div>"""

c = c.replace(old_ui, new_ui)

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
