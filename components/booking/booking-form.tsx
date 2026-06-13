"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ServicePicker } from "@/components/booking/service-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, getServiceById } from "@/lib/data/services";
import type { Service } from "@/lib/types";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

type BookingFormProps = {
  services: Service[];
  initialServiceId?: string;
};

export function BookingForm({ services, initialServiceId }: BookingFormProps) {
  const [serviceId, setServiceId] = useState(initialServiceId ?? services[0]?.id);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+919876543210");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => getServiceById(serviceId) ?? services[0],
    [serviceId, services],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!date || !time || !selectedService) {
      toast.error("Please choose a service, date, and time.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const startsAt = new Date(date);
    startsAt.setHours(hours, minutes, 0, 0);

    setLoading(true);

    try {
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          customerName,
          customerEmail,
          customerPhone,
          startsAt: startsAt.toISOString(),
          notes: notes || undefined,
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) {
        throw new Error(bookingData.error ?? "Could not create booking");
      }

      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: bookingData.appointment.id }),
      });

      const checkoutData = await checkoutResponse.json();
      if (!checkoutResponse.ok || !checkoutData.url) {
        throw new Error(checkoutData.error ?? "Could not start checkout");
      }

      window.location.href = checkoutData.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Choose your treatment</CardTitle>
            <CardDescription>
              Select a service to see duration and pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServicePicker
              services={services}
              value={serviceId}
              onChange={setServiceId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pick date & time</CardTitle>
            <CardDescription>Appointments available daily, 9 AM – 7 PM.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
            />
            <div className="space-y-3">
              <Label htmlFor="time">Time slot</Label>
              <Select
                value={time}
                onValueChange={(value) => setTime(value ?? "")}
              >
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {date && time ? (
                <p className="text-sm text-muted-foreground">
                  Scheduled for {format(date, "PPP")} at {time}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>
              We will send email confirmation and a WhatsApp reminder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Sarah Chen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="sarah@test.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp number</Label>
              <Input
                id="phone"
                required
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="+919876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Allergies, preferences, or special requests"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Booking summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedService ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{selectedService.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedService.duration_minutes} minutes
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(selectedService.price_cents)}
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Redirecting to Stripe…
                    </>
                  ) : (
                    "Pay & confirm booking"
                  )}
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
