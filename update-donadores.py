with open('app/donadores/page.tsx', 'r') as f:
    c = f.read()

# Add a new state for companies
c = c.replace('const [ranking, setRanking] = useState<any[]>([]);', 'const [ranking, setRanking] = useState<any[]>([]);\n  const [companies, setCompanies] = useState<any[]>([]);')

# Inside useEffect, update the parsing
user_scores_logic = """
        const userScores: Record<string, { name: string, score: number, provincia: string }> = {};
        const companiesList: any[] = [];
        
        usersSnap.forEach(u => {
          const data = u.data();
          userScores[u.id] = { name: data.name || "Héroe Anónimo", score: 0, provincia: data.provincia || "" };
          if (data.isCompany) {
            companiesList.push({ id: u.id, ...data, score: 0 });
          }
        });
"""
c = c.replace('const userScores: Record<string, { name: string, score: number, provincia: string }> = {};\n        \n        usersSnap.forEach(u => {\n          userScores[u.id] = { name: u.data().name || "Héroe Anónimo", score: 0, provincia: u.data().provincia || "" };\n        });', user_scores_logic)

# update companies score
score_logic = """
        connsSnap.forEach(c => {
          const userId = c.data().userId;
          if (userScores[userId]) {
            userScores[userId].score += 10;
          }
          const comp = companiesList.find(comp => comp.id === userId);
          if (comp) {
            comp.score += 10;
          }
        });

        // Filter companies that have actually helped (score > 0)
        setCompanies(companiesList.filter(c => c.score > 0).sort((a,b) => b.score - a.score));
"""
c = c.replace('connsSnap.forEach(c => {\n          const userId = c.data().userId;\n          if (userScores[userId]) {\n            userScores[userId].score += 10;\n          }\n        });', score_logic)

# Replace the dummy Empresas Solidarias UI with real dynamic UI
old_empresas_ui = """
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors">
            <div className="w-16 h-16 bg-surface-2 rounded-full mb-3 flex items-center justify-center text-muted font-bold">
              LOGO
            </div>
            <h3 className="text-sm font-bold text-cream">Tu Empresa Aquí</h3>
            <p className="text-[10px] text-muted mt-1">Sponsor Oficial</p>
          </div>
          <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors">
            <div className="w-16 h-16 bg-surface-2 rounded-full mb-3 flex items-center justify-center text-muted font-bold">
              LOGO
            </div>
            <h3 className="text-sm font-bold text-cream">Súmate</h3>
            <p className="text-[10px] text-muted mt-1">Contáctanos</p>
          </div>
        </div>
"""

new_empresas_ui = """
        <div className="grid grid-cols-2 gap-4">
          {companies.length === 0 ? (
            <div className="col-span-2 bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors">
              <div className="w-16 h-16 bg-surface-2 rounded-full mb-3 flex items-center justify-center text-muted font-bold">
                LOGO
              </div>
              <h3 className="text-sm font-bold text-cream">Tu Empresa Aquí</h3>
              <p className="text-[10px] text-muted mt-1">Sé la primera empresa en ayudar</p>
            </div>
          ) : (
            companies.map(comp => (
              <div key={comp.id} className="bg-surface border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-star/50 transition-colors relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-star/20 text-star text-[10px] font-bold px-2 py-1 rounded-md">
                  {comp.score} pts
                </div>
                {comp.companyLogo ? (
                  <img src={comp.companyLogo} alt={comp.companyName} className="w-16 h-16 rounded-2xl mb-3 object-cover border border-line" />
                ) : (
                  <div className="w-16 h-16 bg-surface-2 rounded-2xl mb-3 flex items-center justify-center text-muted font-bold border border-line">
                    {comp.companyName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-sm font-bold text-cream">{comp.companyName}</h3>
                <p className="text-[10px] text-muted mt-1">{comp.provincia}</p>
              </div>
            ))
          )}
        </div>
"""

c = c.replace(old_empresas_ui, new_empresas_ui)

with open('app/donadores/page.tsx', 'w') as f:
    f.write(c)
