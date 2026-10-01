with open('app/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('text-warmth', 'text-star')

with open('app/page.tsx', 'w') as f:
    f.write(c)
