import { NextResponse } from "next/server";
import { runRenewalRemindersJob } from "@/lib/services/renewal-reminders";

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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runRenewalRemindersJob();
    return NextResponse.json({
      status: "ok",
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Renewal job failed" },
      { status: 500 },
    );
  }
}
