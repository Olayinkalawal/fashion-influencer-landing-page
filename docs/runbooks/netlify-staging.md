# Netlify Staging Runbook

## Purpose
Deploy the EYA platform to Netlify staging with all required environment configuration.

## Prerequisites
- Netlify site connected to the repository branch.
- Build settings:
  - Build command: `npm run build`
  - Publish directory: managed by Next.js runtime plugin
- Node.js 20 runtime.

## Required environment variables
Configure these in Netlify Site Settings → Environment variables:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `BROKER_EMAIL`
- `BROKER_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CRON_SECRET`

## Deployment checklist
1. Push branch updates.
2. Confirm Netlify build succeeds.
3. Verify key routes:
   - `/quote`, `/quote/review`, `/quote/payment`
   - `/portal`, `/portal/documents`, `/portal/renewal`
   - `/learning`, `/learning/my-courses`, `/learning/certificates`
   - `/admin`, `/admin/members`, `/admin/courses`
4. Verify API health:
   - `POST /api/nexus/quote`
   - `GET /api/nexus/quote/:ref`
   - `POST /api/stripe/checkout`
   - `POST /api/cron/renewal-reminders`

## Rollback
- Re-deploy previous successful Netlify build from Deploys tab.
