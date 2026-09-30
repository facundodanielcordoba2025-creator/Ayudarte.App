sed -i '' 's/import { ShieldCheck, Heart, Settings, Gift, ChevronDown, HelpCircle, LogIn, User } from "lucide-react";/import { ShieldCheck, Heart, Settings, Gift, ChevronDown, HelpCircle, LogIn, User } from "lucide-react";\nimport { AuthModal } from "\@\/components\/AuthModal";\nimport { useState } from "react";/g' app/perfil/page.tsx

sed -i '' 's/export default function PerfilPage() {/export default function PerfilPage() {\n  const [isAuthOpen, setIsAuthOpen] = useState(false);/g' app/perfil/page.tsx

sed -i '' 's/<button className="w-full bg-star text-white font-bold py-4 rounded-xl shadow-\[0_4px_14px_rgba(255,102,0,0.3)\] active:scale-95 transition-transform mt-6 uppercase tracking-wider text-sm">/<button onClick={() => setIsAuthOpen(true)} className="w-full bg-star text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(255,102,0,0.3)] active:scale-95 transition-transform mt-6 uppercase tracking-wider text-sm">/g' app/perfil/page.tsx

sed -i '' 's/<\/div>\n  );\n}/<\/div>\n      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} \/>\n    <\/div>\n  );\n}/g' app/perfil/page.tsx
