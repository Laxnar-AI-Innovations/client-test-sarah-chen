-- Glow Spa initial schema for Supabase
-- Run in Supabase SQL editor or via CLI migrations

create extension if not exists "pgcrypto";

create table if not exists public.services (
  id text primary key,
  name text not null,
  description text not null,
  duration_minutes integer not null,
  price_cents integer not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  starts_at timestamptz not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'paid', 'completed', 'cancelled')
  ),
  notes text,
  stripe_session_id text,
  stripe_payment_intent_id text,
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists appointments_starts_at_idx on public.appointments (starts_at);
create index if not exists appointments_status_idx on public.appointments (status);

alter table public.services enable row level security;
alter table public.appointments enable row level security;

create policy "Public can read services"
  on public.services for select
  using (true);

create policy "Anyone can create appointments"
  on public.appointments for insert
  with check (true);

create policy "Authenticated admins can read appointments"
  on public.appointments for select
  using (auth.role() = 'authenticated');

create policy "Authenticated admins can update appointments"
  on public.appointments for update
  using (auth.role() = 'authenticated');

insert into public.services (id, name, description, duration_minutes, price_cents, category)
values
  ('svc-facial-glow', 'Signature Glow Facial', 'Deep cleanse, exfoliation, and hydrating mask for radiant skin.', 60, 4500, 'Facials'),
  ('svc-massage-relax', 'Aromatherapy Massage', 'Full-body relaxation with essential oils and warm stone accents.', 75, 6500, 'Massage'),
  ('svc-manicure-luxe', 'Luxe Manicure', 'Cuticle care, shaping, polish, and hand massage.', 45, 2800, 'Nails'),
  ('svc-pedicure-spa', 'Spa Pedicure', 'Foot soak, scrub, massage, and premium polish finish.', 55, 3200, 'Nails'),
  ('svc-body-scrub', 'Coconut Body Scrub', 'Exfoliating treatment followed by nourishing body butter.', 50, 3800, 'Body'),
  ('svc-brows-lashes', 'Brow & Lash Lift', 'Lift, tint, and shape for a polished, natural look.', 40, 3500, 'Beauty')
on conflict (id) do nothing;
