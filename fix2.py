with open('app/page.tsx', 'r') as f:
    c = f.read()

import re

# Remove the faulty injections in the middle of JSX
c = c.replace('<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />\n      {false && (', '{reclamarModal && (')

# Remove the broken onClick injection
broken_onclick = """onClick={() => {
                  const userId = localStorage.getItem("ayudarte_user_id");
                  if (!userId) {
                    alert("Para reclamar un regalo, primero debes registrarte.");
                    setIsAuthOpen(true);
                  } else {
                    setIntentionItem({ id: gift.id, title: gift.title });
                  }
                }}"""
c = c.replace(broken_onclick, 'onClick={() => setReclamarModal({ id: gift.id, title: gift.title, image: gift.image || "" })}')

# Replace reclamarModal logic completely
c = c.replace('const [reclamarModal, setReclamarModal] = useState<{ title: string; image: string; submitted?: boolean } | null>(null);', 'const [intentionItem, setIntentionItem] = useState<{id: string, title: string} | null>(null);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);')

# Now add the proper onClick
c = c.replace('onClick={() => setReclamarModal({ id: gift.id, title: gift.title, image: gift.image || "" })}', 'onClick={() => {\n                  const userId = localStorage.getItem("ayudarte_user_id");\n                  if (!userId) {\n                    setIsAuthOpen(true);\n                  } else {\n                    setIntentionItem({ id: gift.id, title: gift.title });\n                  }\n                }}')

# Now remove the whole {reclamarModal && (...)} and replace with new modals
c = re.sub(r'\{reclamarModal && \([\s\S]*?\}\)', '<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />', c)

with open('app/page.tsx', 'w') as f:
    f.write(c)

