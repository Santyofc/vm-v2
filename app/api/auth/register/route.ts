import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma"; 
import { Resend } from "resend";
import * as z from "zod";

// Schema de validación con Zod
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validar los datos de entrada
    const { email, password, name } = registerSchema.parse(body);

    // 1. Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 2. Hashear password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. Enviar email (Instanciación segura en Runtime)
    // Se instancia dentro de la función para que el build de Next.js no falle si falta la API Key
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "ZonaSur Tech <noreply@zonasurtech.online>",
          to: email,
          subject: "Bienvenido a ZonaSur Tech",
          html: `
            <h1>Hola ${name}</h1>
            <p>Tu cuenta ha sido creada con éxito en nuestra plataforma de citas.</p>
            <p>Ya puedes iniciar sesión con tu correo: <strong>${email}</strong></p>
          `,
        });
      } catch (emailError) {
        // No bloqueamos el registro si falla el envío de email, pero lo logueamos
        console.error("Resend error:", emailError);
      }
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Usamos .issues para cumplir con el tipado estricto de Zod
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("REGISTRATION_ERROR:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
