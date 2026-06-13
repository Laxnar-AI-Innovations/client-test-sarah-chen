"use client";

import { format } from "date-fns";
import { MessageCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/constants";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

interface AdminDashboardProps {
  appointments: Appointment[];
  demoMode?: boolean;
}

export function AdminDashboard({ appointments, demoMode }: AdminDashboardProps) {
  const router = useRouter();
  const [rows, setRows] = useState(appointments);
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: AppointmentStatus) {
    if (demoMode) {
      setRows((current) =>
        current.map((row) => (row.id === id ? { ...row, status } : row)),
      );
      toast.message("Demo mode — status updated locally only.");
      return;
    }

    const response = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      toast.error("Failed to update appointment");
      return;
    }

    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    toast.success("Appointment updated");
  }

  async function sendReminder(id: string) {
    setSendingId(id);

    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send reminder");
      }

      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, whatsapp_sent: true } : row,
        ),
      );
      toast.success(data.message ?? "WhatsApp reminder sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Send failed");
    } finally {
      setSendingId(null);
    }
  }

  const stats = {
    total: rows.length,
    confirmed: rows.filter((row) => row.status === "confirmed").length,
    pending: rows.filter((row) => row.status === "pending").length,
    revenue: rows
      .filter((row) => row.status === "confirmed")
      .reduce((sum, row) => sum + (row.service?.price_cents ?? 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage appointments, payments, and WhatsApp reminders.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.refresh()}>
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      {demoMode && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="py-4 text-sm">
            Preview mode — connect Supabase to persist appointments and enable admin auth.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total bookings" value={String(stats.total)} />
        <StatCard label="Confirmed" value={String(stats.confirmed)} />
        <StatCard label="Pending" value={String(stats.pending)} />
        <StatCard label="Confirmed revenue" value={formatPrice(stats.revenue)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Upcoming and recent bookings for Glow Spa.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No appointments yet. Share the booking link with clients.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{appointment.client_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.client_email}
                        <br />
                        {appointment.client_phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{appointment.service?.name ?? "Service"}</div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.service
                          ? formatPrice(appointment.service.price_cents)
                          : "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(appointment.scheduled_at), "MMM d, yyyy · h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[appointment.status]}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-2 sm:flex-row">
                        <Select
                          value={appointment.status}
                          onValueChange={(value) =>
                            value && updateStatus(appointment.id, value as AppointmentStatus)
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={sendingId === appointment.id}
                          onClick={() => sendReminder(appointment.id)}
                        >
                          <MessageCircle className="mr-1 size-3.5" />
                          {appointment.whatsapp_sent ? "Resend" : "WhatsApp"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
