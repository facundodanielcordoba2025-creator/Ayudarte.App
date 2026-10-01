with open('components/IntentionModal.tsx', 'r') as f:
    c = f.read()

# Replace button 1 icon
c = c.replace('<div className="w-12 h-12 rounded-full bg-star/10 flex items-center justify-center shrink-0 group-hover:bg-star/20 transition-colors">\n                  <DollarSign className="w-6 h-6 text-star" />\n                </div>', 
              '<div className="w-12 h-12 rounded-full bg-star flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,45,0.4)]">\n                  <DollarSign className="w-6 h-6 text-night" />\n                </div>')

# Replace button 2 icon
c = c.replace('<div className="w-12 h-12 rounded-full bg-star/10 flex items-center justify-center shrink-0 group-hover:bg-star/20 transition-colors">\n                  <Package className="w-6 h-6 text-star" />\n                </div>',
              '<div className="w-12 h-12 rounded-full bg-star flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,229,45,0.4)]">\n                  <Package className="w-6 h-6 text-night" fill="currentColor" />\n                </div>')

# Fix button 3 shadow color (was using orange rgb)
c = c.replace('shadow-[0_0_15px_rgba(255,102,0,0.4)]', 'shadow-[0_0_15px_rgba(0,229,45,0.4)]')

with open('components/IntentionModal.tsx', 'w') as f:
    f.write(c)
