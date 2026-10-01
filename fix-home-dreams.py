with open('app/page.tsx', 'r') as f:
    c = f.read()

# Add useDreams hook
c = c.replace('import { useGifts } from "@/hooks/useGifts";', 'import { useGifts } from "@/hooks/useGifts";\nimport { useDreams } from "@/hooks/useDreams";')
c = c.replace('const { gifts } = useGifts();', 'const { gifts } = useGifts();\n  const { dreams } = useDreams();')
c = c.replace('import { HeartHandshake, Trophy, Calendar, BookOpen, ChevronRight, X, Target, Footprints, Users, Heart, RefreshCw, Star, Smile, Shield, Eye, Rocket, Send, Quote, Sparkles } from "lucide-react";', 'import { HeartHandshake, Trophy, Calendar, BookOpen, ChevronRight, X, Target, Footprints, Users, Heart, RefreshCw, Star, Smile, Shield, Eye, Rocket, Send, Quote, Sparkles, MapPin } from "lucide-react";')

# Inject dreams feed into home
dreams_feed = """
      {/* SECCIÓN SUEÑOS */}
      <section className="px-6 py-10 bg-night relative">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-star" />
          <h2 className="font-display text-xl font-bold text-cream">Sueños de la Comunidad</h2>
        </div>

        <div className="space-y-4">
          {dreams.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-line rounded-2xl">
              <p className="text-muted text-sm">Aún no hay sueños publicados.</p>
            </div>
          ) : (
            dreams.map(dream => (
              <div key={dream.id} className="bg-surface rounded-3xl p-5 border border-line shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-md text-[10px] font-bold text-muted">
                    <MapPin className="w-3 h-3" />
                    {dream.userProvincia || 'Argentina'}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-star/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-star">{dream.userName?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-cream text-sm">{dream.userName || 'Usuario Anónimo'}</h3>
                  </div>
                </div>

                <h4 className="font-display font-bold text-lg text-cream mb-2 leading-tight">
                  {dream.title}
                </h4>
                <p className="text-sm text-muted mb-4 leading-relaxed line-clamp-3">
                  {dream.history}
                </p>

                {dream.media && dream.media.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden bg-surface-2 h-40 border border-line">
                    <img src={dream.media[0]} alt="Sueño" className="w-full h-full object-cover" />
                  </div>
                )}

                <button 
                  onClick={() => {
                    const uid = localStorage.getItem("ayudarte_user_id");
                    if (!uid) {
                      setIsAuthOpen(true);
                      return;
                    }
                    if (uid === dream.userId) {
                      return alert("No puedes ayudarte a ti mismo.");
                    }
                    setIntentionItem({ id: dream.id, title: dream.title });
                  }}
                  className="w-full bg-star/10 hover:bg-star/20 text-star font-bold text-sm py-3 rounded-xl transition-colors border border-star/20"
                >
                  Ayudar a cumplir este sueño
                </button>
              </div>
            ))
          )}
        </div>
      </section>
"""

c = c.replace('      {/* REGALOS DISPONIBLES */}', dreams_feed + '\n\n      {/* REGALOS DISPONIBLES */}')

with open('app/page.tsx', 'w') as f:
    f.write(c)
