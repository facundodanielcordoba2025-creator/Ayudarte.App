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
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('import { toast } from "react-hot-toast"')) {
    fs.writeFileSync(f, 'import { toast } from "react-hot-toast";\n' + content);
  }
});
