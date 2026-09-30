sed -i '' '90,92c\
        <h1 className="font-display text-2xl font-semibold text-cream">\
          Contá tu sueño {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "" : <span className="text-red-500 text-sm"> (Sin conexión a Base de Datos)</span>}\
        </h1>
' app/contar-mi-sueno/page.tsx
