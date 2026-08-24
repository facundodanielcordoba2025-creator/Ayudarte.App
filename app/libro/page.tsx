"use client";

import { BookOpen, ChevronLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function HistoriaPage() {
  return (
    <div className="pb-28 min-h-screen bg-surface-2 animate-in slide-in-from-right-8 duration-300 selection:bg-star/30">
      {/* HEADER / BACK BUTTON */}
      <div className="px-6 pt-10 pb-6 bg-surface border-b border-line sticky top-0 z-10 flex items-center gap-3">
        <Link href="/" className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-cream active:scale-95 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-star" />
          <h1 className="font-display text-xl font-bold text-cream">Mi Consejo</h1>
        </div>
      </div>

      {/* SECCIÓN: EL LIBRO */}
      <section className="px-6 py-8">
        <p className="text-xs text-muted mb-6 text-center">Haz clic en los capítulos a continuación para leer la obra completa.</p>

        {/* Acordeón de Capítulos */}
        <div className="space-y-4">
          
          {/* DEDICATORIA */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
              <h3 className="font-bold text-cream">Dedicatoria</h3>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-5 pt-0 border-t border-line mt-2 text-sm leading-relaxed text-muted space-y-4">
              <p className="italic mt-4 text-center">Para Nicolle y para todos los que caminaron conmigo.</p>
              <p>Mientras escribo estas primeras palabras, estás acostada, durmiendo, a pocos metros de mí. Yo estaba trabajando en la App, concentrado, intentando resolver problemas y avanzar con todas esas cosas que muchas veces ocupan mi cabeza.</p>
              <p>Hace un rato te hice un llamado de atención. Quizás fue uno de esos momentos en los que papá se olvida de que también tiene que aprender a tener paciencia. Y, a pesar de eso, antes de irte a dormir viniste y me diste un beso.</p>
              <p>¿Cómo no amarte? ¿Cómo no querer dejarte algo que pueda acompañarte durante toda tu vida? Vos sacás lo mejor de mí. Y quizás por eso este libro existe.</p>
              <p>También quiero dedicar estas páginas a mi sobrino Romeo; a Guadalupe, Abel, Mateo, Jean y Martina; a mi mamá, Claudia, Ángeles, Miguel, Rosario y Benjamín; a Karen, a Milagros, a mi tío Lalo, a mi tía Estela y a mis primos Mario, Alberto y Mariela. Y a todos aquellos que, de una manera u otra, hicieron y siguen haciendo de mi vida un mundo mejor.</p>
              <p>Algunos estuvieron en mis mejores momentos. Otros estuvieron cuando las cosas no salían bien. Algunos me enseñaron con sus palabras; otros, simplemente estando. Y también hubo quienes me enseñaron a través de sus ausencias. Todos forman parte de esta historia.</p>
              <p className="font-bold text-cream mt-6 text-center">Este no es un libro de autoayuda.<br/>Tampoco pretende enseñarte finanzas.</p>
              <p>No vas a encontrar fórmulas mágicas para hacerte rico o tal vez SI, por que yo si logre ser millonario en dinero, pero pobre en corazón por mucho tiempo, no hago promesas de éxito rápido. Lo que vas a encontrar son historias, historias reales - Historias de mi vida.</p>
              <p>Y para que Nicolle, algún día, pueda entender que detrás de cada una de estas páginas hubo un padre que solamente quiso dejarle algo que el dinero jamás podría comprar: una parte de su vida.</p>
              <p className="font-bold text-cream text-right mt-6">Con amor, Tu Papá.</p>
            </div>
          </details>

          {/* INTRODUCCIÓN */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
              <h3 className="font-bold text-cream">Introducción</h3>
              <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-5 pt-0 border-t border-line mt-2 text-sm leading-relaxed text-muted space-y-4">
              <blockquote className="border-l-4 border-star pl-4 italic mt-4 text-cream">
                “Si querés encontrar al Estafador, primero tenés que aprender qué significa ser libre. Porque el peor estafador no es el que te quita tu dinero. Es el que consigue que entregues tu libertad sin darte cuenta.”
              </blockquote>
              <p>Mi nombre es Facundo Daniel Córdoba, y hace apenas unos meses logré recuperar mi libertad. Estuve detenido durante tres años y seis meses en la Alcaldía General N.º 1 de la provincia de Salta, buscando eso tan preciado que muchas personas tienen todos los días frente a sus ojos y, sin embargo, rara vez se detienen a valorar: la libertad.</p>
              <p>Los motivos por los cuales estuve encerrado serán, probablemente, motivo para un segundo libro. Jajaja. En este quiero hablarte de algo mucho más importante: de todo aquello que aprendí durante mi vida y, especialmente, de aquellas cosas que me hubiera gustado comprender mucho antes.</p>
              <p>Privado de mi libertad entendí algo que antes pocas veces me había preguntado: ¿qué significa realmente ser libre? Muchas personas naturalizan su libertad porque nacieron con ella...</p>
              <p>Durante gran parte de mi vida pensé que estaba buscando riqueza. Corría detrás del dinero, de las empresas, de las cosas materiales. El dinero es importante, pero también aprendí que existe una diferencia enorme entre tener dinero y ser libre.</p>
              <p>El dinero puede comprar bienestar, pero no compra salud. Puede hacer más sencilla la convivencia, pero jamás comprará amor. Puede pagar una casa, pero no puede llenar de felicidad una familia que ya no se ama.</p>
              <p>Una de las cicatrices que me marcaron para toda la vida fue el fallecimiento de mi madre. Mientras estaba detenido, el sistema penitenciario y el Poder Judicial ni siquiera me llevaron a su velorio para poder despedirme de ella. Son cosas simples, pero cuando entendés que jamás volverás a tener esa oportunidad, descubrís que eran algunas de las cosas más valiosas que poseías.</p>
              <p>Por eso este libro es para vos, Nicolle. Podría heredarte dinero, casas, empresas o cualquier otra cosa material. De nada sirve heredar una empresa si no sabés administrarla. Y de nada sirve conseguir muchas cosas materiales si, en el camino, perdés tu salud, tu familia, tus valores o tu libertad.</p>
              <p className="font-bold text-cream text-center mt-6">Quiero dejarte conocimiento.</p>
              <p>Este libro contiene 17 lecciones de vida. No quiero que las memorices como si fueran las reglas de un examen. Quiero que las entiendas. Quiero que aprendas a ganar dinero, pero también a cuidarlo. Y, sobre todas las cosas, quiero que seas libre.</p>
            </div>
          </details>

          {/* LECCIÓN 1 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex flex-col p-5 cursor-pointer list-none select-none relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-star uppercase tracking-wider mb-1">Lección 1</span>
                <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 absolute right-5 top-7" />
              </div>
              <h3 className="font-bold text-cream pr-8">Pagate a vos misma primero</h3>
            </summary>
            <div className="p-5 pt-0 border-t border-line mt-2 text-sm leading-relaxed text-muted space-y-4">
              <p className="mt-4">¿Sabés que tuviste una bisabuela que era boliviana? Se llamaba Claudina. Llegó a la Argentina huyendo de la guerra, sin nada, pero absolutamente nada. Durante muchos años, esa fue su realidad: apenas alcanzaba para comer. Sin embargo, el esfuerzo le permitió construir, poco a poco, una vida mejor.</p>
              <p>Tu bisabuela era emprendedora. Ella comenzó lavando sábanas y manteles para un hotel de Tartagal. Después empezó a limpiar sus habitaciones y, con el paso del tiempo, logró poner un pequeño kiosco en su propia casa. Cuando ese negocio comenzó a funcionar, le agregó una verdulería. Después empezó a vender pollos y, finalmente, comenzó a criarlos ella misma.</p>
              <p>Así fue construyendo su pequeño imperio. Y hay algo que quiero que recuerdes siempre, hija: las cosas que realmente valen la pena suelen requerir esfuerzo.</p>
              <p>La situación económica del país comenzó a empeorar, las ventas bajaron. Fue en medio de aquella situación cuando tu abuela quedó embarazada de mí. Y para complicar todavía más las cosas, su pareja decidió pedirle que me abortara. Tu abuela se negó. Él decidió separarse de ella. Así que vine a este mundo con una gran madre, pero sin un padre.</p>
              <p>Mi madre me transmitió desde muy pequeño algo que terminaría acompañándome durante toda mi vida: el valor del trabajo. Fue así que, aproximadamente a tu edad, yo empujaba un carro con pan casero que vendía puerta a puerta.</p>
              <p>Una de las enseñanzas que me dio mi madre fue que, de todo lo que vendiera, debía separar dos pesos para mí. Ese era mi pequeño sueldo. Mamá quería que aprendiera algo que en aquel momento yo todavía no comprendía del todo: <span className="font-bold text-cream">antes de gastar el dinero que uno gana, debe aprender a reservar una parte para sí mismo.</span></p>
              <p>Al principio, si bien yo me pagaba mi pequeño sueldo diario, mamá no me decía qué debía hacer con ese dinero. Y entonces hice exactamente lo que probablemente haría cualquier niño de diez años que recibe dinero por primera vez. Me lo gasté.</p>
              <p>Hasta que un día mi madre me hizo una pregunta muy sencilla: "¿Cuánto dinero tenés ahorrado?"</p>
              <p>Me quedé callado. Todo lo había gastado. Mis dos pesos habían desaparecido entre caramelos y chocolates. Finalmente tuve que decirlo: "No tengo nada".</p>
              <p>Aquel día entendí algo que parece sencillo, pero que puede cambiar completamente la vida de una persona: No alcanza con ganar dinero. Tenés que aprender a conservar una parte de lo que ganás. Porque cada vez que gastás todo lo que tenés, estás diciendo que el presente merece absolutamente todo tu esfuerzo y que tu futuro puede esperar. Y tu futuro, hija, también merece una parte de lo que hoy estás construyendo.</p>
            </div>
          </details>

          {/* LECCIÓN 2 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex flex-col p-5 cursor-pointer list-none select-none relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-star uppercase tracking-wider mb-1">Lección 2</span>
                <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 absolute right-5 top-7" />
              </div>
              <h3 className="font-bold text-cream pr-8">Controlá tus gastos</h3>
            </summary>
            <div className="p-5 pt-0 border-t border-line mt-2 text-sm leading-relaxed text-muted space-y-4">
              <p className="mt-4">Como te conté, ya había aprendido que primero lo primero: “Pagate a vos misma primero”. Pero la vida, sin embargo, no siempre respeta nuestros planes. Cortaron el videocable. Después se llevaron el televisor. Entonces apareció mi tío Lalo con un televisor viejo y yo inventé una antena con la tapa metálica de una olla. ¡Mirá si atraía un rayo! Pero funcionó, podíamos ver Dragon Ball.</p>
              <p>Pero la felicidad duró poco. Cortaron la luz.</p>
              <p>No recuerdo cuántos días estuvimos sin electricidad. Inventé una especie de antorcha utilizando kerosene, un trapo y un frasco. Hoy te digo: no hagas jamás algo parecido. Era extremadamente peligroso.</p>
              <p>Si tan solo hubiera controlado mis gastos, tendría dinero suficiente para pagar la luz y volver a mirar mis dibujos. Y así apareció una nueva enseñanza. Tenía que comenzar a guardar dinero. Pero esta vez necesitaba entender algo más: aprender qué eran los gastos.</p>
              <p>Esperé hasta la noche, cuando mamá volvió de trabajar. "Mamá, ¿cuáles son los gastos de la casa?" Ella me respondió que yo era muy pequeño y que no me preocupara. Pero esa noche mamá no durmió. La escuché llorar durante casi toda la noche. Fue tal vez la primera vez que sentí que algo no estaba bien. Descubrí que los adultos también tienen miedo, se preocupan, se sienten impotentes y lloran.</p>
              <p>A la mañana siguiente quise sorprenderla devolviendo la electricidad. La maestra me había explicado qué era un medidor, pero mamá me dijo que la empresa se lo había llevado porque no pagamos la luz. Entonces vi dos cables que pasaban frente a nuestra casa. Armé un cable largo, me subí al techo, luego a un árbol de palta, y con un palo traté de conectarlo. Tuve suerte. Mucha. Pude haber muerto.</p>
              <p>Pero el invento funcionó, la casa se iluminó. Cuando mamá llegó, agarró un cinto y me dio una paliza que probablemente tenía la intención de darme unos diez años más de educación de una sola vez. Hoy entiendo perfectamente el miedo que debió sentir.</p>
              <p>Pero mamá todavía tenía una enseñanza más: "¿Querés mirar tus dibujos animados? Entonces vas a aprender a gastar tu dinero". A partir de ese momento, tenía que destinar una parte de mi dinero al ahorro para pagar los gastos de la casa.</p>
              <p className="font-bold text-cream text-center my-6">¿Lo quiero o lo necesito?</p>
              <p>¿Necesitaba la luz? Sí. ¿Necesitaba comer chocolates todos los días? No. Esa diferencia parece pequeña, pero puede convertirse en una de las herramientas más importantes para administrar tu vida. El problema aparece cuando comenzás a gastar tu futuro para satisfacer cada deseo del presente.</p>
            </div>
          </details>

          {/* LECCIÓN 3 */}
          <details className="group bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex flex-col p-5 cursor-pointer list-none select-none relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-star uppercase tracking-wider mb-1">Lección 3</span>
                <ChevronDown className="w-5 h-5 text-muted transition-transform group-open:rotate-180 absolute right-5 top-7" />
              </div>
              <h3 className="font-bold text-cream pr-8">Hacé que tu dinero trabaje para vos</h3>
            </summary>
            <div className="p-5 pt-0 border-t border-line mt-2 text-sm leading-relaxed text-muted space-y-4">
              <p className="mt-4">Bueno, mi niña hermosa. Primero aprendiste a guardar dinero. Después a no gastarlo tontamente. Ahora viene una pregunta mucho más importante: ¿Qué hacemos con el dinero que conseguimos guardar? El dinero guardado puede darte tranquilidad. Pero el dinero bien utilizado puede darte oportunidades.</p>
              <p>Recuerdo que ya tenía once o doce años. Había pasado de ser un niño que gastaba en golosinas a alguien que miraba cada moneda. Mi primer gran negocio fueron las bolillas. Compraba barato a mi abuela y las revendía en la escuela. Hasta que la maestra le mandó una nota a mamá diciendo que estaba más preocupado por vender bolillas que por estudiar. Mamá me castigó quitándome el negocio.</p>
              <p>Empecé a lavar las bicicletas de mis primos. Un día mi primo Daniel vino hablando de Dragon Ball y me dijo que no se conseguían los separadores. "No se consiguen". Esa frase fue una alarma en mi cabeza. Si muchos chicos los querían y no había, ahí había una oportunidad.</p>
              <p>Conseguí uno prestado y me puse a calcarlo usando aceite en una hoja lisa para hacerla transparente. Quedaron perfectos. Los vendía a dos pesos. Pronto estaba vendiendo todos los días.</p>
              <p>Llegué a juntar cincuenta pesos. Pero tenía un problema: si seguía haciendo todo yo solo, descuidaría la escuela y mamá me cerraría el negocio. Así que le propuse a mi amigo Martín pagarle cincuenta centavos por cada dibujo que él hiciera. Yo los vendía a dos pesos y me quedaba con un peso con cincuenta.</p>
              <p>Tu abuela me explicó que eso era lo que hacía mi bisabuela: cuando descubrió que no podía criar y limpiar todos los pollos sola, contrató a alguien. No era magia, era organización. Había descubierto que podía utilizar su dinero para comprar una herramienta que le permitiera producir más.</p>
              <p>Tu tiempo es limitado. Si querés crecer, algún día vas a necesitar aprender a utilizar también el tiempo, las habilidades y el trabajo de otras personas. No para aprovecharte de ellas, sino para que todos puedan ganar algo.</p>
              <p>Con el dinero que ahorré y produje con este sistema, junté ciento cincuenta pesos. Una boleta de luz costaba cuarenta y tres pesos. Agarré mis ahorros y pagué la boleta de luz, y fui a mostrársela a mamá. Aquel niño que se gastaba los pesos en caramelos ahora podía generar, guardar y usar su dinero para resolver un problema real de la familia.</p>
              <p>Ese fue el día en que dejé de pensar solamente en tener dinero. Y comencé a pensar en algo mucho más poderoso: cómo hacer que el dinero pudiera ayudarme a construir mi libertad.</p>
            </div>
          </details>

        </div>
      </section>
    </div>
  );
}
