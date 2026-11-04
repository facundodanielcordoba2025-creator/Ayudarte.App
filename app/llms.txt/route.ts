import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Ayudarte (ayudarte.app)
> Plataforma digital comunitaria y solidaria que conecta personas que necesitan ayuda o buscan cumplir un sueño con miembros de la comunidad y empresas dispuestos a colaborar.

## Módulos y Servicios Clave:
- Sueños de la Comunidad: Publicación de metas, proyectos personales y causas verificadas para recibir apoyo colectivo de la comunidad.
- Ayudas Cotidianas: Asistencia solidaria inmediata en necesidades puntuales del día a día (salud, alimentos, materiales, oficios).
- Mercado Solidario y Regalos: Espacio de intercambio y donación directa de artículos, herramientas y recursos sin costo entre vecinos.
- Empresas Solidarias: Alianzas con organizaciones, comercios y marcas para canalizar donaciones de excedentes de stock, equipamiento y responsabilidad social corporativa.
- Gamificación y Superhéroes: Sistema de niveles, insignias y reconocimiento para voluntarios y colaboradores activos que transforman realidades.

## Enlaces Públicos:
- Inicio: https://www.ayudarte.app
- Explorar Sueños: https://www.ayudarte.app/suenos
- Ayudas Cotidianas: https://www.ayudarte.app/ayuda-eventual
- Donar y Regalar (Mercado Solidario): https://www.ayudarte.app/regalar
- Empresas Solidarias y Alianzas: https://www.ayudarte.app/ofrecer-donacion
- Publicar un Sueño: https://www.ayudarte.app/contar-mi-sueno
- Ranking de Superhéroes y Donadores: https://www.ayudarte.app/donadores
- Términos, Privacidad y Compromiso: https://www.ayudarte.app/legales

## Información de Contacto y Redes:
- Sitio oficial: https://www.ayudarte.app
- Contacto directo: info@ayudarte.app
- Redes sociales: Instagram (@ayudarte.app), Facebook (/ayudarteapp), TikTok (@ayudarte.app)
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
