import { ArrowRight, CalendarCheck, CreditCard, MessageCircle, Shield } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS, DEMO_SERVICES, formatDuration, formatPrice } from "@/lib/constants";

const features = [
  {
    icon: CalendarCheck,
    title: "Online booking",
    description: "Clients pick a service, time slot, and pay in minutes.",
  },
  {
    icon: CreditCard,
    title: "Stripe payments",
    description: "Secure checkout with automatic confirmation.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp reminders",
    description: "Automated appointment confirmations via WhatsApp.",
  },
  {
    icon: Shield,
    title: "Admin dashboard",
    description: "Sarah manages schedules, status, and reminders in one place.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,114,182,0.15),transparent_55%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                {BUSINESS.name}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Salon booking made effortless for modern spas.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Built for {BUSINESS.owner} — accept appointments, collect payments with Stripe,
                and send WhatsApp reminders from a mobile-friendly experience.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LinkButton size="lg" href="/book">
                  Book an appointment
                  <ArrowRight className="ml-2 size-4" />
                </LinkButton>
                <LinkButton size="lg" variant="outline" href="/admin">
                  Admin panel
                </LinkButton>
              </div>
            </div>
            <Card className="border-primary/10 bg-card/80 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle>Today at {BUSINESS.name}</CardTitle>
                <CardDescription>{BUSINESS.hours} · {BUSINESS.address}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEMO_SERVICES.slice(0, 3).map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between rounded-lg border bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration(service.duration_minutes)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(service.price_cents)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Signature services</h2>
            <p className="mt-2 text-muted-foreground">
              Curated treatments for facials, massage, nails, and hair — ready to book online.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_SERVICES.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <CardDescription>{service.category}</CardDescription>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {formatDuration(service.duration_minutes)}
                    </span>
                    <span className="font-semibold">{formatPrice(service.price_cents)}</span>
                  </div>
                  <LinkButton variant="secondary" className="w-full" href={`/book?service=${service.id}`}>
                    Book this service
                  </LinkButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">Everything Sarah needs</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
