const fs = require('fs');
const files = [
  'app/contar-mi-sueno/page.tsx',
  'app/suenos/page.tsx',
  'app/perfil/page.tsx',
  'app/regalar/page.tsx',
  'app/page.tsx',
  'app/ayuda-eventual/page.tsx',
  'components/IntentionModal.tsx',
  'components/AuthModal.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"use client";') || content.includes("'use client';")) {
    // Remove all use client directives
    content = content.replace(/"use client";\n?/g, '');
    content = content.replace(/'use client';\n?/g, '');
    // Prepend use client
    content = '"use client";\n' + content;
    fs.writeFileSync(f, content);
  }
});
