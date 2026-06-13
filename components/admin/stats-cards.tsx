"use client";

import { CalendarDays, CircleDollarSign, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/data/services";
import type { Appointment } from "@/lib/types";

type StatsCardsProps = {
  appointments: Appointment[];
};

export function StatsCards({ appointments }: StatsCardsProps) {
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (appointment) => new Date(appointment.starts_at).toDateString() === today,
  );
  const paidAppointments = appointments.filter(
    (appointment) => appointment.status === "paid" || appointment.status === "confirmed",
  );
  const revenueCents = paidAppointments.reduce(
    (total, appointment) => total + (appointment.service?.price_cents ?? 0),
    0,
  );

  const stats = [
    {
      label: "Today's bookings",
      value: todaysAppointments.length.toString(),
      icon: CalendarDays,
    },
    {
      label: "Upcoming clients",
      value: appointments
        .filter((appointment) => new Date(appointment.starts_at) > new Date())
        .length.toString(),
      icon: Users,
    },
    {
      label: "Paid revenue",
      value: formatPrice(revenueCents),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
