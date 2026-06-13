# Glow Spa — Salon Booking Platform

Client project for **Sarah Chen** at **Glow Spa** (`Laxnar-AI-Innovations/client-test-sarah-chen`).

Online booking web app with Stripe payments, Supabase auth/database, and WhatsApp appointment reminders.

## Features (MVP)

- **Appointment booking** — service picker, calendar, time slots, customer details
- **Stripe payments** — Checkout session flow with webhook confirmation
- **Admin dashboard** — view appointments, update status, resend WhatsApp reminders
- **Email login** — Supabase magic-link auth for admin access
- **WhatsApp notifications** — Twilio-powered booking confirmations
- **Mobile responsive** — Tailwind layouts optimized for phone and desktop

## Stack

- [Next.js 16](https://nextjs.org/) App Router + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) — auth + Postgres
- [Stripe](https://stripe.com/) — payments
- [Twilio](https://www.twilio.com/) — WhatsApp messaging
- Deploy-ready for [Vercel](https://vercel.com/) (preview only for this scaffold)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | App URL (`http://localhost:3000` locally) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode for preview) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender (e.g. `whatsapp:+14155238886`) |

### 3. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Run the migration in `supabase/migrations/001_initial.sql` via the SQL editor.
3. Enable **Email** auth provider under Authentication → Providers.
4. Add your site URL and `http://localhost:3000/auth/callback` to redirect URLs.
5. Invite `sarah@test.com` as an admin user (or sign up via magic link).

### 4. Set up Stripe (test mode)

1. Create products/prices or rely on dynamic `price_data` (already configured).
2. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### 5. Set up WhatsApp (Twilio)

1. Enable WhatsApp in the [Twilio Console](https://console.twilio.com/).
2. For sandbox testing, join the sandbox from your phone and use the sandbox sender number.
3. Set `TWILIO_WHATSAPP_FROM` to your approved WhatsApp sender.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the booking site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Project structure

```
app/
  (marketing)/          # Public booking site
    page.tsx            # Landing page
    book/               # Booking flow + success page
  admin/                # Protected admin dashboard
  api/
    bookings/           # Create/list/update appointments
    stripe/             # Checkout + webhook
    whatsapp/           # Manual reminder sends
  auth/                 # Supabase auth callback + sign out
components/
  booking/              # Booking form + service picker
  admin/                # Dashboard table + stats
lib/
  supabase/             # Browser/server/middleware clients
  stripe.ts             # Stripe SDK helper
  whatsapp.ts           # Twilio WhatsApp helper
  data/services.ts      # Seed service catalog
supabase/migrations/    # Database schema
```

## Client brief

| Field | Value |
| --- | --- |
| Client | Sarah Chen |
| Company | Glow Spa |
| Email | sarah@test.com |
| Phone | +919876543210 |
| Budget signal | Under $150 template budget |
| Urgency | High |

### Must-haves ✅

- Appointment booking
- Admin panel
- Stripe payments
- WhatsApp notifications
- Mobile responsive

### Nice-to-haves (not in MVP)

- Loyalty program
- Staff scheduling
- Multi-location support (open question)

## Deploy to Vercel (preview)

1. Import the repo in Vercel.
2. Add all environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to your Vercel preview URL.
4. Configure Stripe webhook endpoint: `https://<preview-url>/api/stripe/webhook`.
5. Add the preview URL to Supabase redirect allowlist.

> **Note:** This scaffold is preview-ready only. Do not promote to production until Stripe, Twilio, and Supabase are configured with live credentials and compliance checks are complete.

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## License

Private — Laxnar Agency client project.
