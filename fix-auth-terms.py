with open('components/AuthModal.tsx', 'r') as f:
    c = f.read()

# Add states for accepting terms
c = c.replace('const [dni, setDni] = useState("");', 'const [dni, setDni] = useState("");\n  const [acceptTerms, setAcceptTerms] = useState(false);')

# Add to validation
c = c.replace('if (!name || !phone || !dni || !provincia) {', 'if (!name || !phone || !dni || !provincia) {\n      return alert("Por favor completa todos los campos personales");\n    }\n    if (!acceptTerms) {\n      return alert("Debes aceptar los Términos y Condiciones para crear tu cuenta.");\n    }\n    // Ignore old alert to prevent double')
c = c.replace('\n    if (isCompany && !companyName) {', '\n    if (isCompany && !companyName) {')

# Remove the old alert condition if it duplicated (the replace above did it safely)

# Add to Firestore payload
c = c.replace('isCompany,', 'isCompany,\n        acceptedTerms: true,\n        acceptedTermsAt: Date.now(),')

# Inject UI checkbox just before the Submit button
ui_checkbox = """
              <div className="pt-2 border-t border-line mt-4">
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-night/50 border border-line rounded-xl hover:border-star/50 transition-colors">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-5 h-5 accent-star rounded mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-cream block leading-tight">
                      He leído y acepto los <a href="/legales" target="_blank" className="text-star hover:underline font-bold">Términos y Condiciones</a>, Política de Privacidad y Uso de Datos de Ayudarte.App.
                    </span>
                  </div>
                </label>
              </div>
              
              <button 
                onClick={handleCompleteProfile}
"""

c = c.replace('              <button \n                onClick={handleCompleteProfile}', ui_checkbox)

with open('components/AuthModal.tsx', 'w') as f:
    f.write(c)
