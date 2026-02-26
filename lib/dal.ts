import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";

export type AuthContext = {
  userId: string;
  role: string;
  tenantId: string | undefined;
};

export const verifySession = cache(async (): Promise<AuthContext> => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return {
    userId: session.user.id,
    role: (session.user as any).role as string,
    tenantId: (session.user as any).tenantId as string | undefined,
  };
});

export async function requireTenantAccess() {
  const session = await verifySession();

  if (!session.tenantId && session.role !== "SUPERADMIN") {
    throw new Error("Tenant access denied");
  }

  return session;
}

export async function requireSuperAdmin() {
  const session = await verifySession();

  if (session.role !== "SUPERADMIN") {
    throw new Error("SuperAdmin required");
  }

  return session;
}

export function scopedPrisma(tenantId: string) {
  return {
    client: {
      findMany: (args?: any) =>
        prisma.client.findMany({
          ...args,
          where: {
            ...args?.where,
            tenantId,
          },
        }),
    },
  };
}
