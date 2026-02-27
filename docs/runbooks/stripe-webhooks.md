# Stripe Webhook Runbook

## Purpose
Ensure payment confirmation events bind quotes reliably and idempotently.

## Endpoint
- `POST /api/stripe/webhook`

## Event handling
- Handles `checkout.session.completed`.
- Uses event ID idempotency guard to avoid duplicate bind actions.
- Binds quote via internal Nexus service when `quote_ref` metadata is present.

## Stripe setup
1. In Stripe dashboard, create webhook endpoint:
   - URL: `https://<staging-domain>/api/stripe/webhook`
2. Subscribe to:
   - `checkout.session.completed`
3. Save webhook signing secret to:
   - `STRIPE_WEBHOOK_SECRET`

## Metadata contract
Checkout session metadata must include:
- `quote_ref`
- `case_ref`

## Troubleshooting
- `400 Invalid Stripe signature`
  - Verify `STRIPE_WEBHOOK_SECRET` matches endpoint secret.
- `Missing quote reference in checkout session metadata`
  - Ensure checkout creation includes `quote_ref` metadata.
- Duplicate webhook events
  - Expected behavior: idempotency returns no-op for already processed event IDs.

## Local/mock testing
When Stripe keys are not configured:
- Endpoint accepts mock JSON body:
  - `{ "event_id": "evt_local_1", "quote_ref": "<quoteRef>" }`
- This triggers the same bind pipeline for staging simulation.
