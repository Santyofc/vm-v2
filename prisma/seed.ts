import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Asegúrate de tener estas variables en tu archivo .env
  const email = process.env.AUTH_MASTER_EMAIL || "delgadoleiva60@gmail.com";
  const plainPassword =
    process.env.AUTH_MASTER_PASSWORD || "ZONA_SUR_2026_CAMBIAR";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const superadmin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "SUPERADMIN",
    },
    create: {
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
      name: "Super Admin",
    },
  });

  console.log(`✅ Superadmin configurado exitosamente: ${superadmin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
