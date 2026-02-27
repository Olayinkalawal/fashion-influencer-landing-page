#!/usr/bin/env node

const stagingUrl = process.env.STAGING_URL;
const cronSecret = process.env.CRON_SECRET;

if (!stagingUrl) {
  console.error("Missing STAGING_URL.");
  process.exit(1);
}

if (!cronSecret) {
  console.error("Missing CRON_SECRET.");
  process.exit(1);
}

const normalizedUrl = stagingUrl.endsWith("/")
  ? stagingUrl.slice(0, -1)
  : stagingUrl;

async function verifyRenewalCron() {
  const response = await fetch(`${normalizedUrl}/api/cron/renewal-reminders`, {
    method: "POST",
    headers: {
      "x-cron-secret": cronSecret,
    },
  });

  const body = await response.text();
  console.log("Renewal cron verification status:", response.status);
  console.log("Renewal cron verification body:", body);

  if (!response.ok) {
    process.exit(1);
  }
}

verifyRenewalCron().catch((error) => {
  console.error(error);
  process.exit(1);
});
