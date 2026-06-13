import { NextResponse } from "next/server";
import { z } from "zod";

import { getServiceById } from "@/lib/data/services";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  appointmentId: z.string().uuid(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .eq("id", parsed.data.appointmentId)
    .single();

  if (error || !appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const service =
    appointment.service ?? getServiceById(appointment.service_id);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: appointment.customer_email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: service.price_cents,
          product_data: {
            name: service.name,
            description: `Glow Spa appointment on ${new Date(appointment.starts_at).toLocaleString("en-IN")}`,
          },
        },
      },
    ],
    metadata: {
      appointmentId: appointment.id,
    },
    success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/book?cancelled=1`,
  });

  await supabase
    .from("appointments")
    .update({ stripe_session_id: session.id })
    .eq("id", appointment.id);

  return NextResponse.json({ url: session.url });
}
