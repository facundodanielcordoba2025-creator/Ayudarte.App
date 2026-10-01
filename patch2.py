with open('app/regalar/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('import { ArrowLeft', 'import { AuthModal } from "@/components/AuthModal";\nimport { ArrowLeft')

with open('app/regalar/page.tsx', 'w') as f:
    f.write(c)
