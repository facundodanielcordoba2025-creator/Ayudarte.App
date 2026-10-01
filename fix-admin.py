with open('app/admin/page.tsx', 'r') as f:
    c = f.read()

# Add activeTab connections
c = c.replace('const [users, setUsers] = useState<any[]>([]);', 'const [users, setUsers] = useState<any[]>([]);\n  const [connections, setConnections] = useState<any[]>([]);')
c = c.replace('const unsubDreams = onSnapshot(qDreams, (snap) => {\n      setDreams(snap.docs.map(d => ({ id: d.id, ...d.data() })));\n    });', 'const unsubDreams = onSnapshot(qDreams, (snap) => {\n      setDreams(snap.docs.map(d => ({ id: d.id, ...d.data() })));\n    });\n\n    const qConns = query(collection(db, "connections"), orderBy("createdAt", "desc"));\n    const unsubConns = onSnapshot(qConns, (snap) => {\n      setConnections(snap.docs.map(d => ({ id: d.id, ...d.data() })));\n    });')
c = c.replace('return () => { unsubUsers(); unsubDreams(); };', 'return () => { unsubUsers(); unsubDreams(); unsubConns(); };')

# Add tab button
tab_btn = """        <button 
          onClick={() => setActiveTab("suenos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "suenos" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Star className="w-4 h-4" /> Sueños Activos ({dreams.length})
        </button>
        <button 
          onClick={() => setActiveTab("conexiones")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "conexiones" ? "bg-star text-night" : "bg-surface text-muted"}`}
        >
          <Gift className="w-4 h-4" /> Coordinaciones ({connections.length})
        </button>"""
c = c.replace('<button \n          onClick={() => setActiveTab("suenos")}', tab_btn.split('<button \n          onClick={() => setActiveTab("suenos")}')[0] + '<button \n          onClick={() => setActiveTab("suenos")}')

# I need to be careful with replace, let's use a simpler append for the connections tab content
conn_content = """
        {activeTab === "conexiones" && (
          <div className="space-y-4">
            {connections.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay mensajes pendientes.</p>
            ) : (
              <div className="space-y-3">
                {connections.map(c => {
                  const user = users.find(u => u.id === c.userId);
                  return (
                    <div key={c.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${c.type === 'ayudar' ? 'bg-star/20 text-star' : 'bg-warmth/20 text-warmth'}`}>
                            {c.type === 'ayudar' ? 'Quiere Ayudar' : 'Reclama Regalo'}
                          </span>
                          <h4 className="font-bold text-cream text-sm mt-2">{c.itemTitle}</h4>
                          <p className="text-sm text-cream mt-2 bg-surface p-3 rounded-lg border border-line">"{c.message}"</p>
                          {user && (
                            <div className="mt-3 text-xs text-muted">
                              <p><strong className="text-cream">De:</strong> {user.name} ({user.provincia})</p>
                              <p><strong className="text-cream">WhatsApp:</strong> {user.phone}</p>
                            </div>
                          )}
                        </div>
                        <button onClick={() => deleteDoc(doc(db, "connections", c.id))} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 shrink-0 ml-3 text-xs font-bold">
                          Marcar Listo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
"""
c = c.replace('      </div>\n    </div>\n  );\n}', conn_content + '      </div>\n    </div>\n  );\n}')

with open('app/admin/page.tsx', 'w') as f:
    f.write(c)
