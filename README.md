# Glow Spa — Sarah Chen Client Project

Salon booking web app for **Glow Spa** (Sarah Chen). Accept online appointments, collect payments via Stripe, send WhatsApp reminders, and manage bookings from an admin dashboard.

**Client:** Sarah Chen · sarah@test.com · +919876543210  
**Project ID:** `b036dab4-e7bd-4108-b844-1f2ce83bd8bc`

## Stack

- [Next.js App Router](https://nextjs.org) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com) — auth + Postgres
- [Stripe Checkout](https://stripe.com) — payments
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp) — reminders
- Deploy-ready for [Vercel](https://vercel.com) (preview only for this scaffold)

## Features (MVP)

| Feature | Route / path |
|---------|----------------|
| Landing + services | `/` |
| Appointment booking | `/book` |
| Booking success | `/book/success` |
| Admin dashboard | `/admin` |
| Email auth | `/auth/login`, `/auth/signup` |
| Bookings API | `/api/bookings` |
| Stripe webhook | `/api/stripe/webhook` |
| WhatsApp send | `/api/whatsapp/send` |

**Preview mode:** Without env vars, the app runs with demo services and sample admin data so you can review the UI locally.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes (prod) | Site URL, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | For auth/DB | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For auth/DB | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side admin tasks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | For webhooks | From Stripe CLI or dashboard |
| `TWILIO_ACCOUNT_SID` | For WhatsApp | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For WhatsApp | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | For WhatsApp | Sandbox or approved sender, e.g. `whatsapp:+14155238886` |
| `ADMIN_EMAIL` | Optional | Email promoted to admin on signup (`sarah@test.com`) |

### 3. Supabase setup

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/001_initial_schema.sql` (SQL editor or CLI).
3. Enable Email auth in **Authentication → Providers**.
4. Set `ADMIN_EMAIL=sarah@test.com` and run:

   ```sql
   select set_config('app.admin_email', 'sarah@test.com', false);
   ```

   Or update the `handle_new_user` trigger to match your admin email.

### 4. Stripe setup

1. Create products/prices or use Checkout `price_data` (already wired in the booking flow).
2. Add keys to `.env.local`.
3. Forward webhooks locally:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 5. WhatsApp (Twilio)

1. Enable WhatsApp in Twilio Console (sandbox for dev).
2. Join the sandbox from the client phone number.
3. Set `TWILIO_WHATSAPP_FROM` to your Twilio WhatsApp sender.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel preview)

1. Import the repo in Vercel.
2. Add all env vars from `.env.example`.
3. Deploy a **preview** branch — do not promote to production until Sarah signs off.

```bash
npm run build
```

## Open questions

- **Multi-location support?** Schema is single-location today; add a `locations` table and `location_id` on appointments for expansion.

## Nice-to-have (not in MVP)

- Loyalty program
- Staff scheduling

## Project structure

```
src/
  app/              # App Router pages + API routes
  components/       # UI + feature components
  lib/              # Supabase, Stripe, WhatsApp helpers
supabase/
  migrations/       # Database schema + seed services
```

## License

Private client project — Laxnar AI Innovations.
