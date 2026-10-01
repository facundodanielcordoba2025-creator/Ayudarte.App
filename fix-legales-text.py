with open('app/legales/page.tsx', 'r') as f:
    c = f.read()

old_terminos = """          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Términos y Condiciones de Uso</h2>
            </div>
            <p className="mb-4">1. <strong>Naturaleza del Servicio:</strong> Ayudarte.App actúa exclusivamente como plataforma intermediaria de vinculación solidaria entre donantes y beneficiarios. No somos responsables del estado de los bienes materiales donados ni garantizamos la entrega inmediata de aportes económicos, los cuales están sujetos a los tiempos de recaudación y logística.</p>
            <p className="mb-4">2. <strong>Veracidad de la Información:</strong> Todo usuario que publica un sueño (beneficiario) declara bajo juramento que su situación de vulnerabilidad o necesidad es real. La plataforma se reserva el derecho de eliminar sueños, expulsar usuarios y tomar acciones legales ante casos de fraude, estafa o suplantación de identidad.</p>
            <p className="mb-4">3. <strong>Aportes Voluntarios:</strong> Las donaciones económicas no constituyen una compra, inversión ni abono. Son transferencias voluntarias y no reembolsables. Ayudarte.App retiene únicamente el 5% de lo recaudado de forma mensual y transparente para financiar los sorteos y mantener la infraestructura operativa, siendo el resto destinado íntegramente a las causas solidarias.</p>
            <p>4. <strong>Logística y Entregas:</strong> Para salvaguardar la integridad física de las partes, los donantes y beneficiarios no se contactarán directamente de manera inicial. El equipo de Ayudarte actuará como mediador oficial para coordinar el retiro y la entrega de bienes materiales.</p>
          </div>"""

new_terminos = """          <div className="animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-star" />
              <h2 className="text-lg font-bold text-cream">Términos y Condiciones de Uso</h2>
            </div>
            <p className="mb-4">1. <strong>Objeto de la Plataforma:</strong> Ayudarte.app es una red solidaria sin fines de lucro que actúa como nexo entre personas con sueños pendientes e individuos o empresas dispuestas a colaborar económicamente o mediante la donación de objetos. Al utilizar nuestra plataforma, aceptas estos términos en su totalidad.</p>
            <p className="mb-4">2. <strong>Políticas de Donación y Fondos:</strong> Los aportes económicos realizados mediante tarjeta de crédito, débito o transferencia se destinan al fondo solidario de Ayudarte.app. Estos fondos son administrados para la ejecución de los sueños verificados y la logística de los sorteos mensuales (Superhéroes). Las donaciones son voluntarias y definitivas.</p>
            <p className="mb-4">3. <strong>Cancelación de Aportes Recurrentes:</strong> El usuario (Socio Donante) tiene el derecho de solicitar la baja de su aporte mensual en cualquier momento. La baja se puede realizar directamente desde el panel de usuario o comunicándose por correo electrónico. No se generarán cargos posteriores a la fecha efectiva de baja, pero no se realizarán reembolsos por períodos ya debitados.</p>
            <p className="mb-4">4. <strong>Privacidad y Protección de Datos:</strong> Ayudarte.app respeta la privacidad de todos sus usuarios. La información personal recopilada (nombre, correo, datos de contacto) será utilizada única y exclusivamente para mantener la comunicación sobre el impacto de su donación, envío de novedades y gestión de sorteos. Nunca comercializaremos tus datos personales con terceros (Ley de Protección de Datos Personales N° 25.326).</p>
            <p>5. <strong>Veracidad de los Sueños y Objetos:</strong> Los usuarios que postulen "Sueños" o publiquen objetos para regalar se comprometen a brindar información veraz y fotos reales. Ayudarte.app se reserva el derecho de eliminar perfiles o publicaciones que infrinjan las normas de convivencia, contengan contenido inapropiado o resulten fraudulentas.</p>
          </div>"""

c = c.replace(old_terminos.strip(), new_terminos.strip())

with open('app/legales/page.tsx', 'w') as f:
    f.write(c)
