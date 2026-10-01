with open('app/donadores/page.tsx', 'r') as f:
    c = f.read()

# Add Building2 to imports
if 'Building2' not in c:
    c = c.replace('import { Trophy, Star, Gift, Medal } from "lucide-react";', 'import { Trophy, Star, Gift, Medal, Building2 } from "lucide-react";')

# Replace emoji with Building2 icon
c = c.replace('<span className="text-lg">🤝</span>', '<Building2 className="w-5 h-5 text-star" />')

with open('app/donadores/page.tsx', 'w') as f:
    f.write(c)
