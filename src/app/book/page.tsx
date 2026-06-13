import { Suspense } from "react";
import { BookingForm } from "@/components/booking-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BUSINESS, DEMO_SERVICES } from "@/lib/constants";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return [...DEMO_SERVICES];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("price_cents", { ascending: true });

  return data?.length ? data : [...DEMO_SERVICES];
}

export default async function BookPage() {
  const services = await getServices();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-primary">{BUSINESS.name}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Book your appointment</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a treatment, pick a time, and pay securely with Stripe. Confirmation arrives
            by email and WhatsApp.
          </p>
        </div>
        <Suspense fallback={<div className="text-muted-foreground">Loading booking form…</div>}>
          <BookingForm services={services} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
