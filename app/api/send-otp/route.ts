import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json({ error: "Email y código son obligatorios" }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
        
        <!-- Header Image -->
        <div style="width: 100%; text-align: center; background-color: #fcfcfc; border-bottom: 3px solid #ff6600;">
          <img src="https://res.cloudinary.com/dffhpwfiz/image/upload/v1790805445/ChatGPT_Image_30_sept_2026_06_57_03_p.m._cfv8xi.png" alt="Ayudarte Banner" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />
        </div>
        
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="margin-top: 0; color: #1a0e4f; font-size: 24px; font-weight: 700;">¡Hola! Aquí está tu acceso</h2>
          <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 35px;">
            Estás a un paso de entrar a Ayudarte.app. Ingresa el siguiente código de 6 dígitos en la aplicación para confirmar tu identidad:
          </p>
          
          <!-- Code Block -->
          <div style="background-color: #fffaf5; border: 2px solid #ff6600; border-radius: 12px; padding: 20px; margin: 0 auto 35px auto; max-width: 300px;">
            <span style="font-size: 40px; font-weight: 800; color: #ff6600; letter-spacing: 8px;">${code}</span>
          </div>
          
          <p style="color: #888888; font-size: 14px; line-height: 1.5; margin-bottom: 30px;">
            Este código es seguro e intransferible. Si tú no solicitaste iniciar sesión, puedes ignorar este mensaje sin preocuparte.
          </p>
        </div>

        <!-- Footer Image -->
        <div style="width: 100%; text-align: center; background-color: #1a0e4f;">
          <img src="https://res.cloudinary.com/dffhpwfiz/image/upload/v1790798645/ChatGPT_Image_30_sept_2026_05_03_43_p.m._ue4j17.png" alt="Ayudarte Footer" style="width: 100%; max-height: 120px; object-fit: cover; display: block; opacity: 0.9;" />
        </div>

      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Ayudarte <info@ayudarte.app>',
        to: email,
        subject: `Tu código secreto de Ayudarte.app: ${code}`,
        html: htmlContent
      })
    });

    if (!resendRes.ok) {
      const errorData = await resendRes.json();
      console.error("Resend Error:", errorData);
      return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
