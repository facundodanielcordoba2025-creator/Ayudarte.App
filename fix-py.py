import re
with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    content = f.read()

# Replace step 2 content with the proper inputs
step2 = """        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <p className="text-sm text-cream leading-relaxed">
              Una imagen o un video vale más que mil palabras. Las historias con fotos tienen un <span className="text-star font-semibold">70% más de chances</span> de cumplirse (Máx 60s o 4 archivos).
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors cursor-pointer">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <Camera className="w-8 h-8" />
                <span className="text-xs font-medium">Sacar Foto</span>
              </label>
              
              <label className="flex flex-col items-center justify-center gap-3 bg-surface border border-line border-dashed rounded-2xl p-6 text-muted hover:border-star hover:text-star transition-colors cursor-pointer">
                <input type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <Video className="w-8 h-8" />
                <span className="text-xs font-medium">Grabar Video</span>
              </label>
            </div>
            
            <label className="w-full flex items-center justify-center gap-2 bg-surface-2 border border-line rounded-xl p-4 text-cream hover:bg-surface transition-colors cursor-pointer">
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
              <UploadCloud className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium">Subir desde la galería</span>
            </label>

            {/* Previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {mediaPreviews.map((url, idx) => (
                  <div key={idx} className="w-full h-32 rounded-2xl border border-line/50 relative overflow-hidden group">
                    {url.includes("video") || url.startsWith("data:video") ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt="Previsualización" className="w-full h-full object-cover" />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}"""

content = re.sub(r'\{step === 2 && \((.*?)\)\}', step2, content, flags=re.DOTALL)
with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(content)
