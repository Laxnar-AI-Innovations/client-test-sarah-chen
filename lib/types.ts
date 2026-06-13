export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "completed"
  | "cancelled";

export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  category: string;
};

export type Appointment = {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  starts_at: string;
  status: AppointmentStatus;
  notes?: string | null;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  whatsapp_sent?: boolean;
  created_at: string;
  service?: Service;
};

export type BookingInput = {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startsAt: string;
  notes?: string;
};
