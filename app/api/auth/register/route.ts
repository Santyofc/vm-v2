import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, businessName } = await req.json();

    // 1️⃣ Validación básica
    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generar slug limpio sin dependencia externa
    const baseSlug = businessName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    // 5️⃣ Crear Tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: businessName,
        slug: uniqueSlug,
      },
    });

    // 6️⃣ Crear usuario owner del tenant
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUPERADMIN",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
