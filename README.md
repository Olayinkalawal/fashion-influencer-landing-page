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
