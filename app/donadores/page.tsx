"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Gift, Medal } from "lucide-react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SuperheroesPage() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUsers = onSnapshot(query(collection(db, "users")), (usersSnap) => {
      const unsubConns = onSnapshot(query(collection(db, "connections")), (connsSnap) => {
        const userScores: Record<string, { name: string, score: number, provincia: string }> = {};
        
        usersSnap.forEach(u => {
          userScores[u.id] = { name: u.data().name || "Héroe Anónimo", score: 0, provincia: u.data().provincia || "" };
        });

        connsSnap.forEach(c => {
          const userId = c.data().userId;
          if (userScores[userId]) {
            userScores[userId].score += 10;
          }
        });

        const sorted = Object.values(userScores)
          .filter(u => u.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        setRanking(sorted);
        setLoading(false);
      });
      return () => unsubConns();
    });
    return () => unsubUsers();
  }, []);

  return (
    <div className="pb-28 min-h-screen bg-surface-2">
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-10">
        <h1 className="font-display text-2xl font-bold text-cream flex items-center gap-2">
          <Trophy className="w-6 h-6 text-star" />
          Nuestros Superhéroes
        </h1>
        <p className="text-sm text-muted mt-1">Los héroes más activos del mes. Cada vez que ofreces ayuda, sumas 10 puntos.</p>
      </div>

      <div className="px-6 pt-6 space-y-4">
        {loading ? (
          <p className="text-center text-muted">Calculando ranking...</p>
        ) : ranking.length === 0 ? (
          <div className="text-center bg-surface border border-line rounded-2xl p-8">
            <p className="text-muted text-sm">Todavía no hay superhéroes este mes.</p>
            <p className="text-star font-bold text-sm mt-2">¡Sé el primero en ayudar!</p>
          </div>
        ) : (
          ranking.map((hero, index) => (
            <div key={index} className="flex items-center gap-4 bg-surface border border-line rounded-2xl p-4 shadow-sm relative overflow-hidden">
              {index === 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-star/10 rounded-bl-full" />}
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0 ${index === 0 ? 'bg-star text-night' : index === 1 ? 'bg-gray-300 text-night' : index === 2 ? 'bg-orange-400 text-night' : 'bg-surface-2 text-cream border border-line'}`}>
                {index === 0 ? <Medal className="w-6 h-6" /> : `#${index + 1}`}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-cream">{hero.name}</h3>
                <p className="text-xs text-muted mt-0.5">{hero.provincia}</p>
              </div>
              
              <div className="text-right">
                <div className="text-star font-display font-bold text-xl">{hero.score}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Puntos</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
