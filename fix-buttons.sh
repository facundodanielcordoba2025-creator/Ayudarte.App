sed -i '' 's/<button onClick={() => cameraInputRef.current?.click()}/<label/g' app/contar-mi-sueno/page.tsx
sed -i '' 's/<button onClick={() => videoInputRef.current?.click()}/<label/g' app/contar-mi-sueno/page.tsx
sed -i '' 's/<button onClick={() => fileInputRef.current?.click()}/<label/g' app/contar-mi-sueno/page.tsx
sed -i '' 's/<\/button>/<\/label>/g' app/contar-mi-sueno/page.tsx
