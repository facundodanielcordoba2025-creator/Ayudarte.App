const fs = require('fs');

let content = fs.readFileSync('app/admin/page.tsx', 'utf8');

// Add import
if (!content.includes('Package')) {
    content = content.replace('Gift, Search, Trash2, Shield, HandHeart', 'Gift, Search, Trash2, Shield, HandHeart, Package, CheckCircle');
}

// Add state
if (!content.includes('const [offers, setOffers] = useState<any[]>([])')) {
    content = content.replace('const [eventual, setEventual] = useState<EventualHelp[]>([]);', 'const [eventual, setEventual] = useState<EventualHelp[]>([]);\n  const [offers, setOffers] = useState<any[]>([]);');
}

// Add listener
if (!content.includes('collection(db, "companyOffers")')) {
    const listener = `
    const qOffers = query(collection(db, "companyOffers"), orderBy("createdAt", "desc"));
    const unsubOffers = onSnapshot(qOffers, (snap) => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });`;
    content = content.replace('return () => {', `${listener}\n    return () => {`);
    content = content.replace('unsubEventual(); };', 'unsubEventual(); unsubOffers(); };');
}

// Add tabs UI
if (!content.includes('activeTab === "offers"')) {
    const tabBtn = `
        <button 
          onClick={() => setActiveTab("offers")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors \${activeTab === "offers" ? "bg-star text-night" : "bg-surface text-muted"}\`}
        >
          <Package className="w-4 h-4" /> Mercado Solidario ({offers.filter(o => o.status === 'activa').length})
        </button>`;
    content = content.replace('</div>\n\n      {/* Content */}', `${tabBtn}\n      </div>\n\n      {/* Content */}`);
}

// Add content UI
if (!content.includes('activeTab === "offers" &&')) {
    const contentUi = `
        {activeTab === "offers" && (
          <div className="space-y-4">
            {offers.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">No hay stock publicado.</p>
            ) : (
              <div className="space-y-4">
                {offers.map(o => {
                  const companyUser = users.find(u => u.id === o.userId);
                  const postulantes = connections.filter(c => c.itemId === o.id && c.type === "reclamar");
                  
                  return (
                    <div key={o.id} className="p-4 bg-surface-2 rounded-xl border border-line/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={\`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md \${o.status === 'activa' ? 'bg-star/20 text-star' : 'bg-surface text-muted'}\`}>
                              {o.status === 'activa' ? 'ACTIVA' : 'ENTREGADA'}
                            </span>
                            <span className="text-xs text-muted font-bold">{o.companyName}</span>
                          </div>
                          <h4 className="font-bold text-cream text-sm">{o.title}</h4>
                          <p className="text-xs text-muted mt-1 whitespace-pre-line">{o.description}</p>
                          
                          {companyUser && (
                            <p className="text-xs text-muted mt-2">Contacto empresa: {companyUser.phone}</p>
                          )}

                          {postulantes.length > 0 && (
                            <div className="mt-4 p-3 bg-surface rounded-lg border border-line">
                              <h5 className="text-xs font-bold text-star mb-2 uppercase tracking-wider">{postulantes.length} Postulantes:</h5>
                              <ul className="space-y-2">
                                {postulantes.map(p => {
                                  const u = users.find(usr => usr.id === p.userId);
                                  return (
                                    <li key={p.id} className="text-xs text-cream flex justify-between items-center bg-surface-2 p-2 rounded border border-line/50">
                                      <span>{u ? \`\${u.name} (\${u.provincia})\` : 'Usuario'} - {u?.phone}</span>
                                      <span className="text-muted italic line-clamp-1 max-w-[40%] text-right">{p.message}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={async () => {
                            if (confirm("¿Borrar este ofrecimiento?")) {
                              await deleteDoc(doc(db, "companyOffers", o.id));
                            }
                          }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {o.status === 'activa' && (
                            <button onClick={async () => {
                              if (confirm("¿Marcar como entregado?")) {
                                await updateDoc(doc(db, "companyOffers", o.id), { status: 'entregada' });
                              }
                            }} className="p-2 bg-star/20 text-star rounded-lg hover:bg-star/30" title="Marcar entregada">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
`;
    // Find the end of eventual tab and insert
    content = content.replace('        {activeTab === "eventuales" && (', `${contentUi}\n        {activeTab === "eventuales" && (` );
}

fs.writeFileSync('app/admin/page.tsx', content);
