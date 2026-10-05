with open('components/BottomNav.tsx', 'r') as f:
    nav = f.read()

nav = nav.replace('className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40  bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] md:rounded-b-[2.2rem] md:border-x-4 md:border-b-4 md:border-surface md:mb-4"', 'className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"')

with open('components/BottomNav.tsx', 'w') as f:
    f.write(nav)
