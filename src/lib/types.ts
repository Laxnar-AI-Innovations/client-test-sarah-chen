export type UserRole = "client" | "admin";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  category: string;
  active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string | null;
  service_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  service?: Service;
}

export interface BookingFormValues {
  serviceId: string;
  scheduledAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}
