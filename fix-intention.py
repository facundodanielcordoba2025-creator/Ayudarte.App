with open('components/IntentionModal.tsx', 'r') as f:
    c = f.read()

# Add CheckCircle2 to imports
c = c.replace('import { X, MessageSquareHeart } from "lucide-react";', 'import { X, MessageSquareHeart, CheckCircle2 } from "lucide-react";')

# Replace Emoji with Lucide icon
c = c.replace('<span className="text-3xl">🤝</span>', '<CheckCircle2 className="w-8 h-8 text-star" />')

with open('components/IntentionModal.tsx', 'w') as f:
    f.write(c)
