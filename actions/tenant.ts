"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

import { requireTenantAccess } from "@/lib/dal";

// ─────────────────────────────────────────────
// Exported server actions
// ─────────────────────────────────────────────

export async function getTenantConfig() {
  // Single auth() call — no redundant session lookup
  const { tenantId, userId } = await requireTenantAccess();

  return prisma.user.findFirst({
    where: { id: userId, tenantId },
    select: {
      name: true,
      email: true,
      tenant: {
        select: {
          name: true,
          subscription: {
            select: {
              status: true,
              currentPeriodEnd: true,
              stripeCustomerId: true,
            },
          },
        },
      },
    },
  });
}

export async function getDashboardMetrics() {
  const { tenantId } = await requireTenantAccess();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // All counts run in parallel — no sequential waterfall
  const [
    todayAppointments,
    completedThisMonth,
    completedAllTime,
    cancelledAllTime,
    topService,
  ] = await Promise.all([
    // Citas de hoy
    prisma.appointment.count({
      where: {
        tenantId,
        date: { gte: startOfDay, lte: endOfDay },
      },
    }),

    // Ingresos del mes: only fetch the price scalar, not the full object
    prisma.appointment.findMany({
      where: {
        tenantId,
        date: { gte: startOfMonth, lte: endOfDay },
        status: "COMPLETED",
      },
      select: {
        service: { select: { price: true } },
      },
    }),

    // Numerador para attendanceRate
    prisma.appointment.count({
      where: { tenantId, status: "COMPLETED" },
    }),

    // Denominador para attendanceRate (completed + cancelled)
    prisma.appointment.count({
      where: { tenantId, status: "CANCELLED" },
    }),

    // Servicio más demandado
    prisma.service.findFirst({
      where: { tenantId },
      orderBy: { appointments: { _count: "desc" } },
      select: { name: true },
    }),
  ]);

  const monthlyRevenue = completedThisMonth.reduce(
    (acc: number, appt: { service: { price: number } | null }) =>
      acc + (appt.service?.price ?? 0),
    0,
  );

  const attendanceDenominator = completedAllTime + cancelledAllTime;
  const attendanceRate =
    attendanceDenominator > 0
      ? Math.round((completedAllTime / attendanceDenominator) * 100)
      : 100;

  return {
    todayAppointments,
    monthlyRevenue,
    attendanceRate,
    topService: topService?.name ?? "Sin Servicios Configurados",
  };
}

export async function getUpcomingAppointments() {
  const { tenantId } = await requireTenantAccess();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.appointment.findMany({
    where: { tenantId, date: { gte: startOfDay } },
    include: { client: true, service: true },
    orderBy: { date: "asc" },
    take: 10,
  });
}

export async function createAppointment(
  clientId: string,
  serviceId: string,
  date: Date,
) {
  const { tenantId } = await requireTenantAccess();

  if (!tenantId) throw new Error("Tenant context not found.");

  if (!clientId || !serviceId || Number.isNaN(new Date(date).getTime())) {
    throw new Error("Invalid appointment data");
  }

  const [client, service] = await Promise.all([
    prisma.client.findFirst({
      where: { id: clientId, tenantId },
      select: { id: true },
    }),
    prisma.service.findFirst({
      where: { id: serviceId, tenantId },
      select: { id: true },
    }),
  ]);

  if (!client || !service) {
    throw new Error("Client or service does not belong to this tenant");
  }

  return prisma.appointment.create({
    data: { tenantId, clientId, serviceId, date },
  });
}

export async function getClients() {
  const { tenantId } = await requireTenantAccess();
  return prisma.client.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createClient(data: any) {
  const session = await requireTenantAccess();

  return prisma.client.create({
    data: {
      ...data,
      tenantId: session.tenantId!,
    },
  });
}

export async function getServices() {
  const { tenantId } = await requireTenantAccess();
  return prisma.service.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}
