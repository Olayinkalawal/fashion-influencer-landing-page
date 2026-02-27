import { NextResponse } from "next/server";
import { runRenewalRemindersJob } from "@/lib/services/renewal-reminders";
import { log } from "@/lib/logger";

function isAuthorized(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) {
    return true;
  }

  const provided = request.headers.get("x-cron-secret");
  return provided === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    log("warn", "Rejected renewal reminder cron call", {
      reason: "invalid-secret",
    });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runRenewalRemindersJob();
    log("info", "Completed renewal reminder cron call", result);
    return NextResponse.json({
      status: "ok",
      ...result,
    });
  } catch (error) {
    log("error", "Renewal reminder cron call failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Renewal job failed" },
      { status: 500 },
    );
  }
}
