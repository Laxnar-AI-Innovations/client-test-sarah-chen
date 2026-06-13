import type { Service } from "@/lib/types";

export const SPA_SERVICES: Service[] = [
  {
    id: "svc-facial-glow",
    name: "Signature Glow Facial",
    description: "Deep cleanse, exfoliation, and hydrating mask for radiant skin.",
    duration_minutes: 60,
    price_cents: 4500,
    category: "Facials",
  },
  {
    id: "svc-massage-relax",
    name: "Aromatherapy Massage",
    description: "Full-body relaxation with essential oils and warm stone accents.",
    duration_minutes: 75,
    price_cents: 6500,
    category: "Massage",
  },
  {
    id: "svc-manicure-luxe",
    name: "Luxe Manicure",
    description: "Cuticle care, shaping, polish, and hand massage.",
    duration_minutes: 45,
    price_cents: 2800,
    category: "Nails",
  },
  {
    id: "svc-pedicure-spa",
    name: "Spa Pedicure",
    description: "Foot soak, scrub, massage, and premium polish finish.",
    duration_minutes: 55,
    price_cents: 3200,
    category: "Nails",
  },
  {
    id: "svc-body-scrub",
    name: "Coconut Body Scrub",
    description: "Exfoliating treatment followed by nourishing body butter.",
    duration_minutes: 50,
    price_cents: 3800,
    category: "Body",
  },
  {
    id: "svc-brows-lashes",
    name: "Brow & Lash Lift",
    description: "Lift, tint, and shape for a polished, natural look.",
    duration_minutes: 40,
    price_cents: 3500,
    category: "Beauty",
  },
];

export function getServiceById(id: string): Service | undefined {
  return SPA_SERVICES.find((service) => service.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
