with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

# Add states for connections
c = c.replace('const [userData, setUserData] = useState<any>(null);', 'const [userData, setUserData] = useState<any>(null);\n  const [myHelps, setMyHelps] = useState<any[]>([]);')

# Add query for connections
query_helps = """
      const qHelps = query(collection(db, "connections"), where("userId", "==", uid));
      const unsubHelps = onSnapshot(qHelps, (snap) => {
        setMyHelps(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
      return () => { unsubDreams(); unsubUser(); unsubHelps(); };
"""
c = c.replace('return () => { unsubDreams(); unsubUser(); };', query_helps)

# Inject the dashboard before PREGUNTAS FRECUENTES
dashboard = """
      {/* SUEÑOS EN PROCESO (DASHBOARD DEL DONANTE) */}
      {userId && myHelps.length > 0 && (
        <div className="px-6 mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-star" />
            <h2 className="font-display text-lg font-bold text-cream uppercase tracking-wide">Mis Sueños Apoyados</h2>
          </div>
          <p className="text-xs text-muted mb-4">Llevamos el registro de tu solidaridad. Aquí verás el estado de los sueños que estás ayudando a cumplir.</p>
          
          <div className="space-y-4">
            {myHelps.map(help => (
              <div key={help.id} className="bg-surface border border-line rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-cream text-sm flex-1 pr-2 line-clamp-2">{help.itemTitle || "Sueño"}</h3>
                  <div className="bg-star/20 text-star text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                    {help.helpMode === "economico" ? "Aporte Eco." : help.helpMode === "objeto" ? "Objeto" : "Completo"}
                  </div>
                </div>
                
                {help.helpMode === "economico" && help.amount && (
                  <div className="mb-3">
                    <p className="text-xs text-muted mb-1">Tu aporte voluntario:</p>
                    <p className="font-display font-bold text-lg text-star">${help.amount.toLocaleString()}</p>
                  </div>
                )}

                <div className="bg-surface-2 rounded-xl p-3 border border-line/50">
                  <p className="text-[11px] font-medium text-cream mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-star" />
                    Estado de la Gestión
                  </p>
                  <p className="text-[10px] text-muted leading-relaxed">
                    {help.status === "pending" 
                      ? "Estamos procesando tu intención de ayuda. Pronto nos pondremos en contacto contigo."
                      : help.status === "in_progress" 
                      ? "¡En marcha! Estamos coordinando los detalles para hacer la entrega oficial."
                      : "¡Sueño cumplido exitosamente! Gracias a tu apoyo."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
"""

c = c.replace('      {/* PREGUNTAS FRECUENTES (Inspirado en UNICEF) */}', dashboard + '\n      {/* PREGUNTAS FRECUENTES (Inspirado en UNICEF) */}')

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
