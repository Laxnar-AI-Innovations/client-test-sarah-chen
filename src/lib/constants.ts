export const BUSINESS = {
  name: "Glow Spa",
  owner: "Sarah Chen",
  email: "sarah@test.com",
  phone: "+919876543210",
  tagline: "Relax. Renew. Radiate.",
  address: "12 Lotus Lane, Bandra West, Mumbai",
  hours: "Mon–Sat 10:00–20:00",
} as const;

/** Fallback catalog when Supabase is not configured (local preview). */
export const DEMO_SERVICES = [
  {
    id: "demo-facial",
    name: "Signature Facial",
    description:
      "Deep cleanse, exfoliation, and hydrating mask tailored to your skin.",
    duration_minutes: 60,
    price_cents: 4500,
    category: "Facial",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-massage",
    name: "Swedish Massage",
    description: "Full-body relaxation massage with aromatic oils.",
    duration_minutes: 60,
    price_cents: 5500,
    category: "Massage",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-hot-stone",
    name: "Hot Stone Therapy",
    description:
      "Heated basalt stones melt tension across back and shoulders.",
    duration_minutes: 75,
    price_cents: 6500,
    category: "Massage",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-manicure",
    name: "Express Manicure",
    description: "Shape, buff, cuticle care, and polish.",
    duration_minutes: 30,
    price_cents: 2500,
    category: "Nails",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-balayage",
    name: "Balayage Touch-up",
    description: "Hand-painted highlights for a sun-kissed glow.",
    duration_minutes: 120,
    price_cents: 12000,
    category: "Hair",
    active: true,
    created_at: new Date().toISOString(),
  },
] as const;

export function formatPrice(cents: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}
