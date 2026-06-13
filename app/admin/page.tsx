import { redirect } from "next/navigation";

import { AppointmentsTable } from "@/components/admin/appointments-table";
import { StatsCards } from "@/components/admin/stats-cards";
import { createClient } from "@/lib/supabase/server";
import type { Appointment } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("starts_at", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage appointments, track revenue, and resend WhatsApp reminders.
        </p>
      </div>
      <StatsCards appointments={(appointments as Appointment[]) ?? []} />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <AppointmentsTable
          initialAppointments={(appointments as Appointment[]) ?? []}
        />
      </div>
    </div>
  );
}
