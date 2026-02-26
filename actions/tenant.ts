"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// ─────────────────────────────────────────────
// Internal auth helper — single source of truth
// ─────────────────────────────────────────────

type AuthenticatedUser = {
  tenantId: string;
  userId: string;
  role: string;
};

/**
 * Validates the current session and confirms the caller is either a
 * TENANT_ADMIN or a SUPERADMIN with an associated tenant.
 * Throws on any failure — call sites never see a partial state.
 */
async function requireTenantAdmin(): Promise<AuthenticatedUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthenticated: no active session");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      tenantId: true,
      tenant: {
        select: {
          subscription: true,
        },
      },
    },
  });

  if (!user?.tenantId) {
    throw new Error("No tenant associated with this account");
  }

if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    throw new Error("Forbidden: insufficient role");
  }

  return {
    tenantId: user.tenantId,
    userId: user.id,
    role: user.role,
  };
}

// ─────────────────────────────────────────────
// Exported server actions
// ─────────────────────────────────────────────

export async function getTenantConfig() {
  // Single auth() call — no redundant session lookup
  const { tenantId, userId } = await requireTenantAdmin();

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
  const { tenantId } = await requireTenantAdmin();

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
  const { tenantId } = await requireTenantAdmin();

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
  const { tenantId } = await requireTenantAdmin();

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
  const { tenantId } = await requireTenantAdmin();
  return prisma.client.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getServices() {
  const { tenantId } = await requireTenantAdmin();
  return prisma.service.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}
