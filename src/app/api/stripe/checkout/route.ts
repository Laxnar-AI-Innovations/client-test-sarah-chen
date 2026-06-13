import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  try {
    const { appointmentId, serviceId, successUrl, cancelUrl } = await request.json();

    if (!appointmentId || !serviceId) {
      return NextResponse.json({ error: "Missing appointmentId or serviceId" }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl ?? `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${origin}/book`,
      metadata: { appointmentId, serviceId },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: 4500,
            product_data: { name: "Glow Spa appointment" },
          },
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
