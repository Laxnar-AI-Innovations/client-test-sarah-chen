import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DEMO_SERVICES } from "@/lib/constants";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Appointment } from "@/lib/types";

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "demo-1",
    client_id: null,
    service_id: DEMO_SERVICES[0].id,
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    status: "confirmed",
    client_name: "Ananya Patel",
    client_email: "ananya@example.com",
    client_phone: "+919812345678",
    notes: "Sensitive skin — gentle products only",
    stripe_session_id: "cs_demo_1",
    stripe_payment_intent_id: null,
    whatsapp_sent: true,
    created_at: new Date().toISOString(),
    service: DEMO_SERVICES[0],
  },
  {
    id: "demo-2",
    client_id: null,
    service_id: DEMO_SERVICES[1].id,
    scheduled_at: new Date(Date.now() + 172800000).toISOString(),
    status: "pending",
    client_name: "Riya Mehta",
    client_email: "riya@example.com",
    client_phone: "+919887654321",
    notes: null,
    stripe_session_id: null,
    stripe_payment_intent_id: null,
    whatsapp_sent: false,
    created_at: new Date().toISOString(),
    service: DEMO_SERVICES[1],
  },
];

async function getAppointments(): Promise<{ rows: Appointment[]; demoMode: boolean }> {
  if (!isSupabaseConfigured()) {
    return { rows: DEMO_APPOINTMENTS, demoMode: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/?error=admin-only");
  }

  const { data } = await supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("scheduled_at", { ascending: true });

  return {
    rows: (data as Appointment[]) ?? [],
    demoMode: false,
  };
}

export default async function AdminPage() {
  const { rows, demoMode } = await getAppointments();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AdminDashboard appointments={rows} demoMode={demoMode} />
      </main>
      <SiteFooter />
    </>
  );
}
