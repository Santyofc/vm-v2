import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // 1️⃣ Crear el Tenant maestro/sistema
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: "zonasur-admin" },
    update: {},
    create: {
      name: "Zona Sur Tech Admin",
      slug: "zonasur-admin",
      subdomain: "admin",
    },
  });

  console.log(`✅ Tenant del sistema asegurado: ${systemTenant.name}`);

  // 2️⃣ Hashear contraseña del admin
  // Usa variables de entorno en el futuro, pero para el seed inicial un string directo funciona
  const adminEmail = process.env.ADMIN_EMAIL || "admin@zonasurtech.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 3️⃣ Crear el usuario Super Admin vinculado al Tenant del sistema
  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // No actualizamos nada si ya existe, para no sobreescribir contraseñas si el admin las cambia
    create: {
      email: adminEmail,
      name: "Super Administrador",
      password: hashedPassword,
      role: "SUPERADMIN",
      tenantId: systemTenant.id, // 🔥 Esto resuelve el error de TypeScript
      emailVerified: new Date(), // Lo marcamos como verificado por defecto
    },
  });

  console.log(`✅ Usuario SUPERADMIN asegurado: ${superAdmin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error ejecutando el seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
