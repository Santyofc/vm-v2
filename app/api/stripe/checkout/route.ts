import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripeSession } from "@/lib/stripe";
import { isBillingEnabledServer } from "@/lib/billing";
import { requireTenantAccess } from "@/lib/dal";

function getAllowedPriceIds(): Set<string> {
  const envPriceIds = (process.env.STRIPE_ALLOWED_PRICE_IDS ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return new Set(envPriceIds);
}

export async function POST(req: Request) {
  try {
    if (!isBillingEnabledServer()) {
      return NextResponse.json(
        { error: "Facturacion desactivada en este entorno." },
        { status: 503 },
      );
    }

    const { userId, tenantId } = await requireTenantAccess();

    const payload = (await req.json()) as { priceId?: unknown };
    const priceId =
      typeof payload.priceId === "string" ? payload.priceId.trim() : "";

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID es requerido" },
        { status: 400 },
      );
    }

    const allowedPriceIds = getAllowedPriceIds();
    if (allowedPriceIds.size === 0) {
      return NextResponse.json(
        { error: "Configuracion de precios no disponible" },
        { status: 500 },
      );
    }

    if (!allowedPriceIds.has(priceId)) {
      return NextResponse.json(
        { error: "Price ID invalido para este entorno" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, tenantId: tenantId ?? undefined }, // Guard injected
      select: { email: true, tenantId: true },
    });

    if (!user?.tenantId) {
      return NextResponse.json(
        { error: "No hay negocio asociado" },
        { status: 400 },
      );
    }

    // TRADEOFF — null-guard on email:
    // Prisma schema marks User.email as required (String, not String?),
    // so this case is theoretically impossible. However, TypeScript types the
    // select result as `string | null` for nullable-compatible columns, and
    // legacy data or direct DB writes could leave email empty.
    // Failing fast here prevents passing an empty string to Stripe, which
    // would create a customer with no email and break billing flows silently.
    if (!user.email) {
      console.error(
        `User ${userId} has no email — cannot create Stripe session`,
      );
      return NextResponse.json(
        { error: "La cuenta no tiene un email valido para facturacion" },
        { status: 400 },
      );
    }

    const stripeSession = await getStripeSession(
      priceId,
      user.tenantId,
      user.email,
    );

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Error al crear sesion de pago" },
      { status: 500 },
    );
  }
}
