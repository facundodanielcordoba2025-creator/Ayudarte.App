with open('app/page.tsx', 'r') as f:
    c = f.read()

# Add a giant donate button in the Hero
old_hero_buttons = """        <div className="mt-5 relative z-10 flex flex-row w-full gap-3">
          <button
            onClick={() => setShowOrigen(true)}
            className="flex-1 inline-flex justify-center items-center gap-1.5 text-[10px] sm:text-xs font-bold text-white transition-colors bg-star hover:bg-star/90 px-2 py-3 rounded-full shadow-[0_2px_10px_rgba(255,102,0,0.3)] active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            EL ORIGEN
          </button>
          <Link
            href="/contar-mi-sueno"
            className="flex-1 inline-flex justify-center items-center gap-1.5 text-[10px] sm:text-xs font-bold text-white transition-colors bg-star hover:bg-star/90 px-2 py-3 rounded-full shadow-[0_2px_10px_rgba(255,102,0,0.3)] active:scale-95"
          >
            <Smile className="w-4 h-4" />
            CONTAR SUEÑO
          </Link>
        </div>"""

new_hero_buttons = """        <div className="mt-5 relative z-10 grid grid-cols-2 gap-3 w-full">
          <Link
            href="/contar-mi-sueno"
            className="col-span-1 inline-flex justify-center items-center gap-1.5 text-xs font-bold text-white transition-colors bg-star hover:bg-star/90 px-2 py-3.5 rounded-2xl shadow-[0_2px_15px_rgba(0,229,45,0.4)] active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            CONTAR SUEÑO
          </Link>
          <Link
            href="/regalar"
            className="col-span-1 inline-flex justify-center items-center gap-1.5 text-xs font-bold text-night transition-colors bg-cream hover:bg-white px-2 py-3.5 rounded-2xl shadow-[0_2px_15px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <Gift className="w-4 h-4" />
            DONAR OBJETO
          </Link>
          <button
            onClick={() => setShowOrigen(true)}
            className="col-span-2 inline-flex justify-center items-center gap-2 text-xs font-bold text-cream transition-colors bg-surface border border-line hover:bg-surface-2 px-2 py-3.5 rounded-2xl active:scale-95 mt-1"
          >
            <BookOpen className="w-4 h-4 text-muted" />
            EL ORIGEN DE LA FUNDACIÓN
          </button>
        </div>"""

c = c.replace(old_hero_buttons, new_hero_buttons)

with open('app/page.tsx', 'w') as f:
    f.write(c)
