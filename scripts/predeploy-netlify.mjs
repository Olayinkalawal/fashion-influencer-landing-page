#!/usr/bin/env node

const requiredEnvKeys = [
  "NETLIFY_AUTH_TOKEN",
  "NETLIFY_SITE_ID",
];

const optionalAppKeys = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "BROKER_EMAIL",
  "BROKER_PASSWORD",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_CURRENCY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "CRON_SECRET",
];

const missingRequired = requiredEnvKeys.filter((key) => !process.env[key]);
if (missingRequired.length > 0) {
  console.error(
    `Missing required deploy env vars: ${missingRequired.join(", ")}.`,
  );
  console.error(
    "Set these values to enable non-interactive Netlify deployment.",
  );
  process.exit(1);
}

const missingAppKeys = optionalAppKeys.filter((key) => !process.env[key]);
if (missingAppKeys.length > 0) {
  console.warn(
    `Warning: Missing app env vars for full staging parity: ${missingAppKeys.join(", ")}`,
  );
}

console.log("Netlify predeploy checks passed.");
