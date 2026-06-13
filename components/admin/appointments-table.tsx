"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/data/services";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  confirmed: "default",
  paid: "default",
  completed: "secondary",
  cancelled: "destructive",
};

type AppointmentsTableProps = {
  initialAppointments: Appointment[];
};

export function AppointmentsTable({
  initialAppointments,
}: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update appointment");
      }
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id ? data.appointment : appointment,
        ),
      );
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update appointment";
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  }

  async function sendReminder(id: string) {
    setLoadingId(id);
    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send WhatsApp reminder");
      }
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? { ...appointment, whatsapp_sent: true }
            : appointment,
        ),
      );
      toast.success("WhatsApp reminder sent");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not send reminder";
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  }

  if (!appointments.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No appointments yet. Bookings will appear here once clients check out.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>When</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{appointment.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.customer_phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>{appointment.service?.name ?? "—"}</TableCell>
              <TableCell>
                {format(new Date(appointment.starts_at), "PPp")}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[appointment.status]}>
                  {appointment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {appointment.service
                  ? formatPrice(appointment.service.price_cents)
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={loadingId === appointment.id}
                    className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => sendReminder(appointment.id)}>
                      <MessageCircle />
                      Send WhatsApp reminder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus(appointment.id, "confirmed")}
                    >
                      Mark confirmed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus(appointment.id, "completed")}
                    >
                      Mark completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus(appointment.id, "cancelled")}
                    >
                      Cancel appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
