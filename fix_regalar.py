with open('app/regalar/page.tsx', 'r') as f:
    c = f.read()

if 'import { AuthModal }' not in c:
    c = c.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { AuthModal } from "@/components/AuthModal";')

with open('app/regalar/page.tsx', 'w') as f:
    f.write(c)
