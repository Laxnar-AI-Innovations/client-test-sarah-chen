import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  buildBookingConfirmationMessage,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";

const sendSchema = z.object({
  appointmentId: z.string().uuid(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = sendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .eq("id", parsed.data.appointmentId)
    .single();

  if (error || !appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  try {
    const message = await sendWhatsAppMessage({
      to: appointment.customer_phone,
      body: buildBookingConfirmationMessage({
        customerName: appointment.customer_name,
        serviceName: appointment.service?.name ?? "spa treatment",
        startsAt: appointment.starts_at,
      }),
    });

    await supabase
      .from("appointments")
      .update({ whatsapp_sent: true })
      .eq("id", appointment.id);

    return NextResponse.json({ sid: message.sid });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send WhatsApp message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
