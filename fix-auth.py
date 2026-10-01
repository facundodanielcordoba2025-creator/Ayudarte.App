import re

# Update contar-mi-sueno/page.tsx
with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    sueno = f.read()

sueno = sueno.replace('setIsPublishing(true);\n\n    if (!isLoggedIn) {', 'setIsPublishing(true);\n\n    const userId = localStorage.getItem("ayudarte_user_id");\n    if (!userId) {')
sueno = sueno.replace('setIsLoggedIn(true)', 'window.location.reload()')
sueno = sueno.replace('media: uploadedUrls,\n        createdAt: Date.now(),', 'media: uploadedUrls,\n        createdAt: Date.now(),\n        userId,')

with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(sueno)

# Update regalar/page.tsx
with open('app/regalar/page.tsx', 'r') as f:
    regalar = f.read()

# Add AuthModal logic to regalar
regalar = regalar.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { AuthModal } from "@/components/AuthModal";')
regalar = regalar.replace('const [isPublishing, setIsPublishing] = useState(false);', 'const [isPublishing, setIsPublishing] = useState(false);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);')
regalar = regalar.replace('const handleSubmit = async () => {\n    if', 'const handleSubmit = async () => {\n    const userId = localStorage.getItem("ayudarte_user_id");\n    if (!userId) {\n      alert("Para regalar, primero debes registrarte.");\n      setIsAuthOpen(true);\n      return;\n    }\n    if')
regalar = regalar.replace('createdAt: Date.now(),\n      });', 'createdAt: Date.now(),\n        userId,\n      });')
regalar = regalar.replace('    </div>\n  );\n}', '      <AuthModal isOpen={isAuthOpen} onClose={() => window.location.reload()} />\n    </div>\n  );\n}')

with open('app/regalar/page.tsx', 'w') as f:
    f.write(regalar)

