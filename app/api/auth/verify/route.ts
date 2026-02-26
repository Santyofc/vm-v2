// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Buscar el token de verificación en la tabla correcta
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 400 }
      );
    }

    // 2️⃣ Actualizar el usuario asociado (usando el identifier como email u otro ID)
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { 
        emailVerified: new Date(),
        // is_verified: true, // <- Descomenta esto si usas un booleano aparte de emailVerified
      },
    });

    // 3️⃣ Eliminar el token usado
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
