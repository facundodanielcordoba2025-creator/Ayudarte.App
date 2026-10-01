with open('app/layout.tsx', 'r') as f:
    c = f.read()

# Make the outer body black on desktop, and create a centered max-w-md container that looks like a phone
c = c.replace('<body className="min-h-full flex flex-col bg-night">', '<body className="min-h-full bg-black flex justify-center overscroll-none md:py-4">\n        <div className="w-full max-w-md bg-night min-h-screen relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[2.5rem] md:border-4 md:border-surface overflow-x-hidden">')

c = c.replace('<main className="flex-1 pb-24">{children}</main>', '<main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">{children}</main>')

c = c.replace('</body>', '</div>\n      </body>')

with open('app/layout.tsx', 'w') as f:
    f.write(c)

with open('components/BottomNav.tsx', 'r') as f:
    nav = f.read()

# Make BottomNav respect the phone frame constraint
nav = nav.replace('className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"', 'className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] md:rounded-b-[2.2rem] md:border-x-4 md:border-b-4 md:border-surface md:mb-4"')

with open('components/BottomNav.tsx', 'w') as f:
    f.write(nav)
