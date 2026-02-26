import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    if (!stripe) {
      throw new Error("Stripe secret is missing");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    // 1. Verificar Deduplicación Persistente
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { id: event.id },
    });

    if (existingEvent) {
      console.log(
        `[Stripe Webhook] Evento ${event.id} ya fue procesado. Omitiendo.`,
      );
      return NextResponse.json(
        { received: true, duplicate: true },
        { status: 200 },
      );
    }

    // 2. Procesar el Evento de Negocio
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // Validación estricta para el fix de Null Reference
        if (!session.customer_email) {
          console.error(
            `[Stripe Webhook] Checkout sin email de cliente. Session ID: ${session.id}`,
          );
          break;
        }

        // Lógica para actualizar la suscripción del tenant...
        console.log(`Pago completado para: ${session.customer_email}`);
        break;

      // Manejar otros eventos (invoice.paid, customer.subscription.deleted, etc.)
      default:
        console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
    }

    // 3. Registrar el Evento como Procesado (Solo si todo lo anterior tuvo éxito)
    await prisma.webhookEvent.create({
      data: {
        id: event.id,
        type: event.type,
      },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error(
      `[Stripe Webhook] Error interno procesando evento ${event.id}:`,
      error,
    );
    // Retornamos 500 para que Stripe sepa que falló y lo reintente luego
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
