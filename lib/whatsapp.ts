import twilio from "twilio";

type WhatsAppMessageInput = {
  to: string;
  body: string;
};

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured");
  }

  return twilio(accountSid, authToken);
}

export async function sendWhatsAppMessage({ to, body }: WhatsAppMessageInput) {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) {
    throw new Error("TWILIO_WHATSAPP_FROM is not configured");
  }

  const client = getTwilioClient();
  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  return client.messages.create({
    from,
    to: normalizedTo,
    body,
  });
}

export function buildBookingConfirmationMessage({
  customerName,
  serviceName,
  startsAt,
  spaName = "Glow Spa",
}: {
  customerName: string;
  serviceName: string;
  startsAt: string;
  spaName?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(startsAt));

  return `Hi ${customerName}! Your ${serviceName} appointment at ${spaName} is confirmed for ${formattedDate}. Reply HELP for assistance.`;
}
