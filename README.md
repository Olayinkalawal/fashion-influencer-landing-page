# EYA Platform

EYA Platform is a Next.js application that combines:

- A branded quote and purchase journey
- A member portal for policy management
- A CPD learning experience
- Internal broker/admin tooling

The project is being built with an internal "Nexus Core" API layer (SchemeServe-style) that handles rating, referrals, cases, policy lifecycle, and document metadata.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (planned integration)
- NextAuth (planned integration)
- Stripe (planned integration)

## Local development

```bash
npm install
npm run dev
```

Create a `.env.local` file from `.env.example` before testing authentication and integrations.

## Deployment

- Netlify config is provided via `netlify.toml` with the Next.js runtime plugin.
- Add required environment variables in Netlify site settings before deploying.

## CI

- GitHub Actions workflow at `.github/workflows/ci.yml`
- Runs: lint, test, typecheck, and build on push/PR

## Runbooks

- `docs/runbooks/netlify-staging.md`
- `docs/runbooks/stripe-webhooks.md`
- `docs/runbooks/renewal-reminders.md`

### Quality commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Current scope

Phase 1 establishes project foundation:

- Route groups for marketing, quote, portal, learning, and admin areas
- Shared layout and UI primitives
- Environment configuration/validation scaffolding

Phase 2 baseline scaffolding now includes:

- NextAuth credentials-based sign in page (`/auth/signin`)
- Route middleware protection for `/portal/*` and `/admin/*`
- Supabase client/server helpers
- Initial SQL migration for members, Nexus Core entities, and CPD tables

Phase 3/4 baseline now includes:

- Canonical quote payload domain model + Zod schema validation
- Internal Nexus-style quote endpoints:
  - `POST /api/nexus/quote`
  - `GET /api/nexus/quote/:ref`
  - `POST /api/nexus/bind/:ref`
  - `GET /api/nexus/documents/:ref`
  - `POST /api/nexus/renew/:ref`
  - `POST /api/nexus/endorse/:ref`
- Stripe payment endpoints:
  - `POST /api/stripe/checkout`
  - `POST /api/stripe/webhook`
- Renewal reminder job endpoint:
  - `POST /api/cron/renewal-reminders` (optional `x-cron-secret` header)
- Deterministic pricing engine with extension and referral rules
- Multi-step quote routes:
  - `/quote`
  - `/quote/general`
  - `/quote/assumptions`
  - `/quote/declaration`
  - `/quote/ern`
  - `/quote/review`
  - `/quote/payment`
  - `/quote/success`
- Draft persistence via browser localStorage

Portal surface now includes:

- `/portal/policy`
- `/portal/documents`
- `/portal/renewal`
- `/portal/claims`
- `/portal/profile`
- Renewal reminder scaffolding:
  - `lib/services/renewal-reminders.ts`
  - `lib/emails/renewal-reminder.ts`
  - `supabase/functions/renewal-reminders/index.ts`

Learning surface includes:

- `/learning`
- `/learning/[slug]`
- `/learning/[slug]/lesson/[id]`
- `/learning/my-courses`
- `/learning/certificates`
- `/learning/live`
- `/learning/live/[id]`
- `/api/learning/certificates/[courseId]` (certificate PDF output)

Admin surface includes:

- `/admin`
- `/admin/members`
- `/admin/courses`
- `/admin/live-sessions`
- `/admin/contact-queue`
- `/api/admin/members` (admin-protected member listing API)
- `/api/admin/courses` + `/api/admin/courses/[id]` (admin course CRUD)
- `/api/admin/live-sessions` + `/api/admin/live-sessions/[id]` (admin live session CRUD)

Learning APIs:

- `/api/learning/courses`
- `/api/learning/enrolments`
- `/api/learning/progress`
