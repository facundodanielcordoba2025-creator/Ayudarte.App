with open('app/manifest.ts', 'r') as f:
    c = f.read()

c = c.replace('background_color: "#0F1115"', 'background_color: "#1a0e4f"')
c = c.replace('theme_color: "#0F1115"', 'theme_color: "#1a0e4f"')

with open('app/manifest.ts', 'w') as f:
    f.write(c)

