with open('app/page.tsx', 'r') as f:
    c = f.read()

# I will find "      {/* MODAL: RECLAMAR */}"
start = c.find('      {/* MODAL: RECLAMAR */}')
if start != -1:
    c = c[:start] + '      {/* MODAL: RECLAMAR */}\n      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />\n    </div>\n  );\n}'

with open('app/page.tsx', 'w') as f:
    f.write(c)

