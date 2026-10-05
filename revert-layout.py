with open('app/layout.tsx', 'r') as f:
    c = f.read()

# Revert the outer body black on desktop, and centered max-w-md container
c = c.replace('<body className="min-h-full bg-black flex justify-center overscroll-none md:py-4">\n        <div className="w-full max-w-md bg-night min-h-screen relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] md:rounded-[2.5rem] md:border-4 md:border-surface overflow-x-hidden">', '<body className="min-h-full flex flex-col bg-night overscroll-none">')

c = c.replace('</div>\n      </body>', '</body>')

with open('app/layout.tsx', 'w') as f:
    f.write(c)

with open('components/BottomNav.tsx', 'r') as f:
    nav = f.read()

# Restore BottomNav to full width
nav = nav.replace('className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] md:rounded-b-[2.2rem] md:border-x-4 md:border-b-4 md:border-surface md:mb-4"', 'className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"')

# Wait, previously I removed border-t border-line from BottomNav. Let's make sure I'm replacing the current exact string.
