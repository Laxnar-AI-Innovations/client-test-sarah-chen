import { BUSINESS } from "@/lib/constants";
import type { Appointment, Service } from "@/lib/types";
import { format } from "date-fns";

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM,
  );
}

export function buildBookingConfirmationMessage(
  appointment: Pick<
    Appointment,
    "client_name" | "scheduled_at" | "client_phone"
  >,
  service: Pick<Service, "name" | "duration_minutes" | "price_cents">,
): string {
  const when = format(new Date(appointment.scheduled_at), "EEE, MMM d · h:mm a");

  return [
    `Hi ${appointment.client_name.split(" ")[0]}! ✨`,
    "",
    `Your ${service.name} at ${BUSINESS.name} is confirmed.`,
    `📅 ${when}`,
    `⏱ ${service.duration_minutes} minutes`,
    "",
    `We look forward to seeing you at ${BUSINESS.address}.`,
    `Questions? Reply here or call ${BUSINESS.phone}.`,
  ].join("\n");
}

export async function sendWhatsAppMessage(
  to: string,
  body: string,
): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    return { success: false, error: "WhatsApp (Twilio) is not configured" };
  }

  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const normalizedFrom = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString(
    "base64",
  );

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: normalizedFrom,
        To: normalizedTo,
        Body: body,
      }),
    },
  );

  const data = (await response.json()) as { sid?: string; message?: string };

  if (!response.ok) {
    return {
      success: false,
      error: data.message ?? "Failed to send WhatsApp message",
    };
  }

  return { success: true, sid: data.sid };
}
