import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { getServiceById } from "@/lib/data/services";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  startsAt: z.string().datetime(),
  notes: z.string().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("starts_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ appointments: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const service = getServiceById(parsed.data.serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      service_id: parsed.data.serviceId,
      customer_name: parsed.data.customerName,
      customer_email: parsed.data.customerEmail,
      customer_phone: parsed.data.customerPhone,
      starts_at: parsed.data.startsAt,
      notes: parsed.data.notes,
      status: "pending",
    })
    .select("*, service:services(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ appointment: data }, { status: 201 });
}
