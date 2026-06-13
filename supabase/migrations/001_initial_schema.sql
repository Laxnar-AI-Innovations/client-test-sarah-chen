-- Glow Spa — initial schema for Sarah Chen client project

create type public.appointment_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed'
);

create type public.user_role as enum ('client', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents integer not null check (price_cents >= 0),
  category text not null default 'General',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles (id) on delete set null,
  service_id uuid not null references public.services (id) on delete restrict,
  scheduled_at timestamptz not null,
  status public.appointment_status not null default 'pending',
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  notes text,
  stripe_session_id text,
  stripe_payment_intent_id text,
  whatsapp_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index appointments_scheduled_at_idx on public.appointments (scheduled_at desc);
create index appointments_status_idx on public.appointments (status);

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;

create policy "Public can read active services"
  on public.services for select
  using (active = true);

create policy "Admins manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Anyone can create appointments"
  on public.appointments for insert
  with check (true);

create policy "Clients read own appointments"
  on public.appointments for select
  using (
    client_id = auth.uid()
    or client_email = (select email from public.profiles where id = auth.uid())
  );

create policy "Admins manage appointments"
  on public.appointments for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case
      when new.email = current_setting('app.admin_email', true) then 'admin'::public.user_role
      else 'client'::public.user_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.services (name, description, duration_minutes, price_cents, category) values
  ('Signature Facial', 'Deep cleanse, exfoliation, and hydrating mask tailored to your skin.', 60, 4500, 'Facial'),
  ('Swedish Massage', 'Full-body relaxation massage with aromatic oils.', 60, 5500, 'Massage'),
  ('Hot Stone Therapy', 'Heated basalt stones melt tension across back and shoulders.', 75, 6500, 'Massage'),
  ('Express Manicure', 'Shape, buff, cuticle care, and polish.', 30, 2500, 'Nails'),
  ('Balayage Touch-up', 'Hand-painted highlights for a sun-kissed glow.', 120, 12000, 'Hair');
