with open('app/globals.css', 'r') as f:
    c = f.read()

# Swap star and warmth
c = c.replace('--color-star: #FF6600;       /* acento primario: Naranja Nickelodeon */', '--color-star: #00E52D;       /* acento primario: Verde Slime */')
c = c.replace('--color-warmth: #00E52D;     /* acento secundario: Verde Slime */', '--color-warmth: #FF6600;     /* acento secundario: Naranja Nickelodeon */')
c = c.replace('--color-star-dim: #E55C00;', '--color-star-dim: #00CC28;')

with open('app/globals.css', 'w') as f:
    f.write(c)
