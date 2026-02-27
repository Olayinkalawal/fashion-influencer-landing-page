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
