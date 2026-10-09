import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    if (!email || !code) {
      return NextResponse.json({ error: "Email y código son obligatorios" }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a0e4f; padding: 40px; border-radius: 20px; color: #f2e2d9;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6600; margin: 0; font-size: 28px; font-weight: 800;">Ayudarte.app</h1>
        </div>
        <div style="background-color: #24195d; padding: 30px; border-radius: 16px; text-align: center; border: 1px solid rgba(255,102,0,0.3);">
          <h2 style="margin-top: 0; color: #f2e2d9; font-size: 20px;">Tu código secreto</h2>
          <p style="color: #a8a0d4; font-size: 15px; margin-bottom: 25px;">Usa este código PIN de 6 dígitos para iniciar sesión en tu cuenta. No lo compartas con nadie.</p>
          <div style="background-color: #1a0e4f; border: 2px dashed #ff6600; border-radius: 12px; padding: 15px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #ff6600; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="color: #a8a0d4; font-size: 13px; margin-top: 30px;">Si no fuiste tú quien solicitó este código, puedes ignorar este correo sin problemas.</p>
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
