import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import {
  buildBookingConfirmationMessage,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      const supabase = await createClient();
      const { data: appointment } = await supabase
        .from("appointments")
        .update({
          status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", appointmentId)
        .select("*, service:services(*)")
        .single();

      if (appointment && !appointment.whatsapp_sent) {
        try {
          await sendWhatsAppMessage({
            to: appointment.customer_phone,
            body: buildBookingConfirmationMessage({
              customerName: appointment.customer_name,
              serviceName: appointment.service?.name ?? "spa treatment",
              startsAt: appointment.starts_at,
            }),
          });

          await supabase
            .from("appointments")
            .update({ whatsapp_sent: true, status: "confirmed" })
            .eq("id", appointmentId);
        } catch {
          // Payment succeeded; WhatsApp can be retried from admin.
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
