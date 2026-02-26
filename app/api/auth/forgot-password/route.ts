// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // 💡 INICIALIZACIÓN PEREZOSA (RUNTIME)
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Lógica para enviar el correo (ajusta las URLs y dominios según tu proyecto)
    /* await resend.emails.send({
      from: "Zona Sur Tech <onboarding@resend.dev>",
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">aquí</a> para recuperar tu contraseña.</p>`,
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
