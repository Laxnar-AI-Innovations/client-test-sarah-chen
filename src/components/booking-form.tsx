"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDuration, formatPrice } from "@/lib/constants";
import type { Service } from "@/lib/types";

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

interface BookingFormProps {
  services: Service[];
}

export function BookingForm({ services }: BookingFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("+91");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [serviceId, services],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedService || !date || !time) {
      toast.error("Please select a service, date, and time.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, 0, 0);

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          scheduledAt: scheduledAt.toISOString(),
          clientName,
          clientEmail,
          clientPhone,
          notes: notes || undefined,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        demo?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create booking");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast.success(data.message ?? "Booking request received.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Choose your treatment</CardTitle>
          <CardDescription>Select a service, date, and preferred time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select
              value={serviceId}
              onValueChange={(value) => value && setServiceId(value)}
            >
              <SelectTrigger id="service" className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} — {formatPrice(service.price_cents)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedService && (
              <p className="text-sm text-muted-foreground">
                {selectedService.description} · {formatDuration(selectedService.duration_minutes)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <div className="rounded-lg border p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                className="mx-auto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={(value) => value && setTime(value)}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>
            We will send confirmation by email and WhatsApp after payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              required
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              placeholder="Priya Sharma"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={clientEmail}
              onChange={(event) => setClientEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={clientPhone}
              onChange={(event) => setClientPhone(event.target.value)}
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
              rows={3}
            />
          </div>

          {selectedService && date && time && (
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">Booking summary</p>
              <p className="mt-1 text-muted-foreground">
                {selectedService.name} on{" "}
                {format(date, "EEE, MMM d")} at {time}
              </p>
              <p className="mt-2 text-base font-semibold">
                Total: {formatPrice(selectedService.price_cents)}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 size-4" />
                Continue to payment
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
