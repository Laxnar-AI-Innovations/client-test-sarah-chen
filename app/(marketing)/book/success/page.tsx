import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-16 sm:px-6">
      <Card className="w-full border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>
          <CardTitle className="text-2xl">Booking confirmed</CardTitle>
          <CardDescription>
            Payment received via Stripe. A WhatsApp reminder will arrive shortly with
            your appointment details.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button render={<Link href="/" />} className="flex-1">
            Back to home
          </Button>
          <Button render={<Link href="/book" />} variant="outline" className="flex-1">
            Book another
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
