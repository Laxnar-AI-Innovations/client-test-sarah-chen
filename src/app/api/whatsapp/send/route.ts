import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_SERVICES } from "@/lib/constants";
import {
  buildBookingConfirmationMessage,
  isWhatsAppConfigured,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const payloadSchema = z.object({
  appointmentId: z.string().min(1),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      {
        error:
          "WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM.",
        demo: true,
      },
      { status: 503 },
    );
  }

  try {
    const body = payloadSchema.parse(await request.json());

    let phone = body.phone;
    let message = body.message;

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: appointment } = await supabase
        .from("appointments")
        .select("*, service:services(*)")
        .eq("id", body.appointmentId)
        .single();

      if (appointment) {
        phone = phone ?? appointment.client_phone;
        if (!message && appointment.service) {
          message = buildBookingConfirmationMessage(appointment, appointment.service);
        }
      }
    }

    if (!phone || !message) {
      const demo = DEMO_SERVICES[0];
      phone = phone ?? "+919876543210";
      message =
        message ??
        buildBookingConfirmationMessage(
          {
            client_name: "Guest",
            scheduled_at: new Date().toISOString(),
            client_phone: phone,
          },
          demo,
        );
    }

    const result = await sendWhatsAppMessage(phone, message);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      await supabase
        .from("appointments")
        .update({ whatsapp_sent: true })
        .eq("id", body.appointmentId);
    }

    return NextResponse.json({
      message: "WhatsApp reminder sent",
      sid: result.sid,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
