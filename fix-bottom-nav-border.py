with open('components/BottomNav.tsx', 'r') as f:
    c = f.read()

c = c.replace('border-t border-line', '')

with open('components/BottomNav.tsx', 'w') as f:
    f.write(c)
