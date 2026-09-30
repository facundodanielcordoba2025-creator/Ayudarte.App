sed -i '' 's/import { Camera, Video, UploadCloud, ChevronRight, Star, X } from "lucide-react";/import { Camera, Video, UploadCloud, ChevronRight, Star, X } from "lucide-react";\nimport { AuthModal } from "\@\/components\/AuthModal";/g' app/contar-mi-sueno/page.tsx

sed -i '' 's/const \[isPublishing, setIsPublishing\] = useState(false);/const [isPublishing, setIsPublishing] = useState(false);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);\n  const [isLoggedIn, setIsLoggedIn] = useState(false); \/\/ Mock/g' app/contar-mi-sueno/page.tsx

# In handleSubmit, intercept if not logged in
sed -i '' '/setIsPublishing(true);/i \
    if (!isLoggedIn) {\
      alert("Para publicar tu sueño y poder contactarte si alguien quiere ayudar, primero debes registrarte o iniciar sesión.");\
      setIsAuthOpen(true);\
      return;\
    }\
' app/contar-mi-sueno/page.tsx

# Add AuthModal at the end
sed -i '' 's/    <\/div>\n  );\n}/      <AuthModal isOpen={isAuthOpen} onClose={() => { setIsAuthOpen(false); setIsLoggedIn(true); }} \/>\n    <\/div>\n  );\n}/g' app/contar-mi-sueno/page.tsx
