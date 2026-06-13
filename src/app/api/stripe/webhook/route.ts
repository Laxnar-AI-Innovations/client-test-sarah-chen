import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { DEMO_SERVICES } from "@/lib/constants";
import { getStripe } from "@/lib/stripe";
import {
  buildBookingConfirmationMessage,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointmentId = session.metadata?.appointmentId;
    const clientPhone = session.metadata?.clientPhone;
    const clientName = session.metadata?.clientName ?? "Guest";
    const serviceId = session.metadata?.serviceId;

    if (isSupabaseConfigured() && appointmentId) {
      const supabase = await createClient();

      await supabase
        .from("appointments")
        .update({
          status: "confirmed",
          stripe_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", appointmentId);

      const { data: appointment } = await supabase
        .from("appointments")
        .select("*, service:services(*)")
        .eq("id", appointmentId)
        .single();

      if (appointment && clientPhone && !appointment.whatsapp_sent) {
        const service =
          appointment.service ??
          DEMO_SERVICES.find((item) => item.id === serviceId) ??
          DEMO_SERVICES[0];

        const message = buildBookingConfirmationMessage(appointment, service);
        const result = await sendWhatsAppMessage(clientPhone, message);

        if (result.success) {
          await supabase
            .from("appointments")
            .update({ whatsapp_sent: true })
            .eq("id", appointmentId);
        }
      }
    } else if (clientPhone && serviceId) {
      const service =
        DEMO_SERVICES.find((item) => item.id === serviceId) ?? DEMO_SERVICES[0];
      const message = buildBookingConfirmationMessage(
        {
          client_name: clientName,
          scheduled_at: new Date().toISOString(),
          client_phone: clientPhone,
        },
        service,
      );
      await sendWhatsAppMessage(clientPhone, message);
    }
  }

  return NextResponse.json({ received: true });
}
