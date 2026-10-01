with open('app/suenos/page.tsx', 'r') as f:
    c = f.read()

# Replace the false && block
start = c.find('{false && (')
if start != -1:
    end = c.find('    </div>\n  );\n}', start)
    if end != -1:
        c = c[:start] + c[end:]

with open('app/suenos/page.tsx', 'w') as f:
    f.write(c)
