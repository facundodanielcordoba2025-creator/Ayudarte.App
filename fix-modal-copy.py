with open('components/IntentionModal.tsx', 'r') as f:
    c = f.read()

# Add Copy to imports if not there
if 'Copy' not in c:
    c = c.replace('import { X, MessageSquareHeart', 'import { X, MessageSquareHeart, Copy')

# Replace the banking data block with copy buttons
old_bank_data = """
                  {amount && Number(amount) > 0 && (
                    <div className="bg-surface-2 border border-line p-4 rounded-xl animate-in fade-in zoom-in-95">
                      <p className="text-xs text-muted mb-2 font-bold uppercase">Datos Bancarios para transferir:</p>
                      <p className="text-sm text-cream mb-1">CBU: <strong>00000031000000000000</strong></p>
                      <p className="text-sm text-cream mb-3">Alias: <strong>AYUDARTE.APP.SOLIDARIO</strong></p>
                      <p className="text-xs text-star font-medium">Recaudaremos el dinero en este pozo seguro. Cuando cubramos la meta, procederemos a cumplir el sueño y verás la actualización en tu perfil.</p>
                    </div>
                  )}
"""

new_bank_data = """
                  {amount && Number(amount) > 0 && (
                    <div className="bg-surface-2 border border-line p-4 rounded-xl animate-in fade-in zoom-in-95">
                      <p className="text-xs text-muted mb-3 font-bold uppercase">Datos Bancarios para transferir:</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between bg-night/50 border border-line rounded-lg p-2 px-3">
                          <span className="text-xs text-muted">CBU</span>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-cream font-mono">00000031000000000000</strong>
                            <button onClick={() => {
                              navigator.clipboard.writeText("00000031000000000000");
                              alert("CBU copiado al portapapeles");
                            }} className="p-1.5 hover:bg-star/20 rounded-md transition-colors text-star">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-night/50 border border-line rounded-lg p-2 px-3">
                          <span className="text-xs text-muted">Alias</span>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-cream font-mono">AYUDARTE.APP.SOLIDARIO</strong>
                            <button onClick={() => {
                              navigator.clipboard.writeText("AYUDARTE.APP.SOLIDARIO");
                              alert("Alias copiado al portapapeles");
                            }} className="p-1.5 hover:bg-star/20 rounded-md transition-colors text-star">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-star font-medium leading-tight">Recaudaremos el dinero en este pozo seguro. Cuando cubramos la meta, procederemos a cumplir el sueño y verás la actualización en tu perfil.</p>
                    </div>
                  )}
"""

c = c.replace(old_bank_data.strip(), new_bank_data.strip())

with open('components/IntentionModal.tsx', 'w') as f:
    f.write(c)
