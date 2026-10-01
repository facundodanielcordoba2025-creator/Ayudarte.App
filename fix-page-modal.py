with open('app/page.tsx', 'r') as f:
    c = f.read()

# Update state type
c = c.replace('const [intentionItem, setIntentionItem] = useState<{id: string, title: string} | null>(null);', 'const [intentionItem, setIntentionItem] = useState<{id: string, title: string, type: "ayudar" | "reclamar"} | null>(null);')

# Update Dream button
c = c.replace('setIntentionItem({ id: dream.id, title: dream.title });', 'setIntentionItem({ id: dream.id, title: dream.title, type: "ayudar" });')

# Update Gift button
c = c.replace('setIntentionItem({ id: gift.id, title: gift.title });', 'setIntentionItem({ id: gift.id, title: gift.title, type: "reclamar" });')

# Update Modal props
c = c.replace('<IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type="reclamar" itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />', '<IntentionModal isOpen={!!intentionItem} onClose={() => setIntentionItem(null)} type={intentionItem?.type || "reclamar"} itemId={intentionItem?.id || ""} itemTitle={intentionItem?.title || ""} />')

with open('app/page.tsx', 'w') as f:
    f.write(c)
