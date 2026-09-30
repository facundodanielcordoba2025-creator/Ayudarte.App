sed -i '' 's/<label className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors">/<label className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors cursor-pointer">\n<input type="file" accept="image\/*" capture="environment" className="hidden" onChange={handleFileChange} />/g' app/contar-mi-sueno/page.tsx

sed -i '' 's/<span className="text-xs font-medium">Sacar Foto<\/span>/<span className="text-xs font-medium">Sacar Foto<\/span>/g' app/contar-mi-sueno/page.tsx

