with open('hooks/useDreams.ts', 'r') as f:
    c = f.read()

c = c.replace('  createdAt: number;\n}', '  createdAt: number;\n  userId?: string;\n  userName?: string;\n  userProvincia?: string;\n}')

with open('hooks/useDreams.ts', 'w') as f:
    f.write(c)
