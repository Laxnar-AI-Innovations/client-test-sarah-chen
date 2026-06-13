import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_SERVICES } from "@/lib/constants";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/types";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export async function POST(request: Request) {
  try {
    const body = bookingSchema.parse(await request.json());
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

    const service = await resolveService(body.serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (!isSupabaseConfigured()) {
      if (!isStripeConfigured()) {
        return NextResponse.json({
          demo: true,
          message:
            "Preview mode: booking captured locally. Connect Supabase + Stripe for production checkout.",
        });
      }
    }

    let appointmentId = crypto.randomUUID();
    let persistToDatabase = isSupabaseConfigured() && !body.serviceId.startsWith("demo-");

    if (persistToDatabase) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          service_id: body.serviceId,
          scheduled_at: body.scheduledAt,
          client_id: user?.id ?? null,
          client_name: body.clientName,
          client_email: body.clientEmail,
          client_phone: body.clientPhone,
          notes: body.notes ?? null,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (appointment?.id) appointmentId = appointment.id;
    } else if (isSupabaseConfigured() && body.serviceId.startsWith("demo-")) {
      return NextResponse.json({
        demo: true,
        message:
          "Seed Supabase services (run migration) before accepting live bookings.",
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({
        demo: true,
        message:
          "Booking saved in preview mode. Add STRIPE_SECRET_KEY to enable checkout.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?cancelled=1`,
      customer_email: body.clientEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: service.price_cents,
            product_data: {
              name: service.name,
              description: service.description ?? undefined,
            },
          },
        },
      ],
      metadata: {
        appointmentId,
        serviceId: body.serviceId,
        clientPhone: body.clientPhone,
        clientName: body.clientName,
      },
    });

    if (persistToDatabase && session.id) {
      const supabase = await createClient();
      await supabase
        .from("appointments")
        .update({ stripe_session_id: session.id })
        .eq("id", appointmentId);
    }

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: session.url, appointmentId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const supabase = await createClient();

    const { error } = await supabase
      .from("appointments")
      .update({ status: body.status as AppointmentStatus })
      .eq("id", body.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function resolveService(serviceId: string) {
  if (serviceId.startsWith("demo-")) {
    return DEMO_SERVICES.find((service) => service.id === serviceId) ?? DEMO_SERVICES[0];
  }

  if (!isSupabaseConfigured()) {
    return DEMO_SERVICES.find((service) => service.id === serviceId) ?? DEMO_SERVICES[0];
  }

  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("id", serviceId).single();
  return data;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ appointments: [], demo: true });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("scheduled_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ appointments: data ?? [] });
}
