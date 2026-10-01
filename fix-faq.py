with open('app/perfil/page.tsx', 'r') as f:
    c = f.read()

old_faq = """
          {/* FAQ 3 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿Puedo darme de baja como donante mensual?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>Por supuesto. Podés cancelar tu aporte mensual en cualquier momento y sin ningún tipo de cargo adicional. Solo tenés que iniciar sesión en esta misma sección ("Mi Cuenta") y hacer clic en "Cancelar Suscripción".</p>
            </div>
          </details>
"""

new_faq = """
          {/* FAQ 3 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-star shrink-0" />
                <h3 className="font-bold text-cream text-sm pr-4">¿Tengo alguna obligación mensual si dono?</h3>
              </div>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0 border-t border-line mt-2 text-xs leading-relaxed text-muted">
              <p>¡Para nada! Ayudarte.App no tiene abonos ni suscripciones mensuales obligatorias. Cada aporte económico o material que decidas hacer es único y 100% voluntario. Si deseas donar todos los meses por amor a la causa, puedes hacerlo por tu cuenta, pero no existe ninguna obligación o cargo automático con la aplicación.</p>
            </div>
          </details>
"""

c = c.replace(old_faq.strip(), new_faq.strip())

with open('app/perfil/page.tsx', 'w') as f:
    f.write(c)
