// app/api/auth/resend/route.ts
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
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "El correo ya está verificado" },
        { status: 400 }
      );
    }

    // 1️⃣ Limpiar tokens anteriores
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // 2️⃣ Generar nuevo token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 3️⃣ INICIALIZACIÓN EN RUNTIME
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 4️⃣ Enviar correo
    /*
    await resend.emails.send({
      from: "Zona Sur Tech <onboarding@resend.dev>",
      to: email,
      subject: "Verifica tu correo electrónico",
      html: `<p>Haz clic <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}">aquí</a> para verificar tu cuenta.</p>`,
    });
    */

    return NextResponse.json({ success: true, message: "Correo reenviado" });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

