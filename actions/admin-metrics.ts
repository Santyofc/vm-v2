"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import os from "os";

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "SUPERADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function getAdminHealthMetrics() {
  await requireSuperAdmin(); // Protección de seguridad

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [stripeErrors, emailFailures, totalTenants] = await Promise.all([
    // Errores de Stripe (Webhooks que no pudieron procesarse)
    prisma.webhookEvent.count({
      where: { processedAt: { gte: last24h }, type: { contains: "error" } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: last24h }, emailVerified: null },
    }),
    prisma.tenant.count(),
  ]);

  // Métricas de la VM
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);
  const cpuLoad = os.loadavg()[0]; // Carga en el último minuto

  return {
    stripeErrors,
    emailFailures,
    totalTenants,
    memUsage,
    cpuLoad: cpuLoad.toFixed(2),
    status: memUsage > 85 ? "CRITICAL" : memUsage > 70 ? "WARNING" : "HEALTHY",
  };
}
