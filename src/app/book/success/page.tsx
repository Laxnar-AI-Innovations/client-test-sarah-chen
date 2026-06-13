import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS } from "@/lib/constants";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-16 sm:px-6">
        <Card className="w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="size-7" />
            </div>
            <CardTitle className="text-2xl">Booking confirmed</CardTitle>
            <CardDescription>
              Payment received. A WhatsApp reminder will follow shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.session_id && (
              <p className="text-xs text-muted-foreground">
                Reference: {params.session_id.slice(0, 20)}…
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Thank you for booking with {BUSINESS.name}. We cannot wait to see you at{" "}
              {BUSINESS.address}.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <LinkButton href="/">Back to home</LinkButton>
              <LinkButton variant="outline" href="/book">
                Book another
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
