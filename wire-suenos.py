with open('app/suenos/page.tsx', 'r') as f:
    c = f.read()

# Imports
c = c.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { AuthModal } from "@/components/AuthModal";\nimport { IntentionModal } from "@/components/IntentionModal";')

# State
c = c.replace('const [modalAyudar, setModalAyudar] = useState<string | null>(null);', 'const [intentionItem, setIntentionItem] = useState<{id: string, title: string} | null>(null);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);')

# Button
c = c.replace('onClick={() => setModalAyudar(s.title)}', 'onClick={() => {\n                const userId = localStorage.getItem("ayudarte_user_id");\n                if (!userId) {\n                  alert("Para ayudar, primero debes registrarte.");\n                  setIsAuthOpen(true);\n                } else {\n                  setIntentionItem({ id: s.id, title: s.title });\n                }\n              }}')

# Modals
c = c.replace('{modalAyudar && (', '<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="ayudar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />\n      {false && (')

with open('app/suenos/page.tsx', 'w') as f:
    f.write(c)
