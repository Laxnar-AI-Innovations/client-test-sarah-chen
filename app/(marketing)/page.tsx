import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SPA_SERVICES, formatPrice } from "@/lib/data/services";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.04_35),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.95_0.03_150),transparent_40%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Glow Spa · Sarah Chen
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Book your calm. Pay online. Get reminded on WhatsApp.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              A mobile-ready booking experience for facials, massage, nails, and
              beauty treatments — with secure Stripe checkout and automated
              WhatsApp confirmations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/book" />} size="lg">
                Book an appointment
                <ArrowRight />
              </Button>
              <Button render={<Link href="/admin/login" />} variant="outline" size="lg">
                Admin login
              </Button>
            </div>
          </div>
          <Card className="border-primary/15 bg-background/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Why clients love Glow Spa</CardTitle>
              <CardDescription>
                Built for Sarah&apos;s high-urgency launch under a lean template budget.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <Feature icon={CalendarCheck} title="Instant booking" text="Pick a service, date, and time in under a minute." />
              <Feature icon={CreditCard} title="Stripe payments" text="Secure checkout with INR pricing for Indian clients." />
              <Feature icon={MessageCircle} title="WhatsApp reminders" text="Automatic confirmation texts after payment." />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Popular treatments</h2>
            <p className="mt-2 text-muted-foreground">
              Curated services for Glow Spa&apos;s launch menu.
            </p>
          </div>
          <Button render={<Link href="/book" />} variant="outline">
            View all
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPA_SERVICES.slice(0, 3).map((service) => (
            <Card key={service.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {service.duration_minutes} min
                </span>
                <span className="font-semibold">{formatPrice(service.price_cents)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
