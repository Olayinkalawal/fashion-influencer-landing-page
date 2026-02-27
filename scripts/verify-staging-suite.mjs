#!/usr/bin/env node

import { spawnSync } from "node:child_process";

function runStep(label, command, args, requiredEnv = []) {
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    console.log(`[skip] ${label}: missing ${missingEnv.join(", ")}`);
    return { label, status: "skipped" };
  }

  console.log(`[run] ${label}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    return { label, status: "failed" };
  }

  return { label, status: "passed" };
}

const steps = [
  runStep("Smoke checks", "npm", ["run", "verify:staging"], ["STAGING_URL"]),
  runStep(
    "Stripe webhook verification",
    "npm",
    ["run", "verify:stripe:webhook"],
    ["STAGING_URL", "STRIPE_WEBHOOK_SECRET"],
  ),
  runStep(
    "Renewal cron verification",
    "npm",
    ["run", "verify:renewal:cron"],
    ["STAGING_URL", "CRON_SECRET"],
  ),
];

console.table(steps);

if (steps.some((step) => step.status === "failed")) {
  process.exit(1);
}
