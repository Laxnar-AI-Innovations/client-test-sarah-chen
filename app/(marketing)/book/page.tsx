import type { Metadata } from "next";

import { BookingForm } from "@/components/booking/booking-form";
import { SPA_SERVICES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Reserve your Glow Spa treatment and pay securely online.",
};

type BookPageProps = {
  searchParams: Promise<{ service?: string; cancelled?: string }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Book your visit</h1>
        <p className="max-w-2xl text-muted-foreground">
          Choose a treatment, select your preferred slot, and complete payment with
          Stripe. A WhatsApp confirmation is sent automatically after checkout.
        </p>
        {params.cancelled ? (
          <p className="text-sm text-destructive">
            Checkout was cancelled. Your details were not charged — pick a new time
            to continue.
          </p>
        ) : null}
      </div>
      <BookingForm
        services={SPA_SERVICES}
        initialServiceId={params.service}
      />
    </div>
  );
}
