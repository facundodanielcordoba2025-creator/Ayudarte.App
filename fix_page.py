with open('app/page.tsx', 'r') as f:
    c = f.read()

import re

# We know {reclamarModal && ( ... )} spans from some line to the end.
start = c.find('{reclamarModal && (')
if start != -1:
    end = c.find('    </div>\n  );\n}', start)
    if end != -1:
        c = c[:start] + '<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />\n      <IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />\n' + c[end:]

with open('app/page.tsx', 'w') as f:
    f.write(c)

