# Renewal Reminder Runbook

## Purpose
Send reminder emails 30/14/7/1 days before policy expiry.

## Endpoint
- `POST /api/cron/renewal-reminders`
- Optional auth header:
  - `x-cron-secret: <CRON_SECRET>`

## Trigger options
1. Netlify scheduled function / external scheduler calling app endpoint.
2. Supabase Edge Function (`supabase/functions/renewal-reminders/index.ts`) invoking the endpoint.

## Required configuration
- `CRON_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Job behavior
- Reads `policies` and computes days to expiry.
- Sends emails only for 30/14/7/1 day marks.
- Looks up recipient via linked `cases.member_id -> members.email`.
- If Resend is not configured, logs skipped sends.

## Manual run example
```bash
curl -X POST "https://<staging-domain>/api/cron/renewal-reminders" \
  -H "x-cron-secret: <CRON_SECRET>"
```

## Expected response
```json
{
  "status": "ok",
  "sent": 2,
  "skipped": 10,
  "mode": "resend"
}
```

## Staging verification script
```bash
STAGING_URL=https://<staging-domain> \
CRON_SECRET=<your-cron-secret> \
npm run verify:renewal:cron
```
