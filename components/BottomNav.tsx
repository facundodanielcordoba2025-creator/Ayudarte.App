"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, CircleUserRound, Heart, MessageCircle } from "lucide-react";

const TABS = [
  { href: "/", label: "Inicio", icon: Home },
  
  { href: "/donadores", label: "Superhéroes", icon: Heart },
  { href: "/perfil", label: "Mi Cuenta", icon: CircleUserRound },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-3 items-center py-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          // Coincidencia exacta para Inicio, y parcial para las demás rutas
          const active = href === "/" ? pathname === href : pathname?.startsWith(href);
          
          return (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active 
                    ? "text-star bg-star/5 scale-105" 
                    : "text-muted hover:text-star/70 active:scale-95"
                }`}
              >
                <Icon 
                  className="h-6 w-6" 
                  strokeWidth={active ? 2.5 : 2} 
                />
                <span className="text-[11px] font-medium tracking-wide">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
