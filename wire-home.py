with open('app/page.tsx', 'r') as f:
    c = f.read()

# Imports
c = c.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { AuthModal } from "@/components/AuthModal";\nimport { IntentionModal } from "@/components/IntentionModal";')

# State
c = c.replace('const [reclamarModal, setReclamarModal] = useState<{ title: string; image: string } | null>(null);', 'const [intentionItem, setIntentionItem] = useState<{id: string, title: string} | null>(null);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);')

# Button
c = c.replace('onClick={() => setReclamarModal({ title: gift.title, image: gift.image || "" })}', 'onClick={() => {\n                  const userId = localStorage.getItem("ayudarte_user_id");\n                  if (!userId) {\n                    alert("Para reclamar un regalo, primero debes registrarte.");\n                    setIsAuthOpen(true);\n                  } else {\n                    setIntentionItem({ id: gift.id, title: gift.title });\n                  }\n                }}')

# Modals
c = c.replace('{reclamarModal && (', '<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />\n      {false && (')

with open('app/page.tsx', 'w') as f:
    f.write(c)
