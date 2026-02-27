import { NextResponse } from "next/server";
import { bindQuote } from "@/lib/nexus/service";
import { log } from "@/lib/logger";

export async function POST(
  _request: Request,
  { params }: { params: { ref: string } },
) {
  try {
    const bindResult = await bindQuote(params.ref);
    log("info", "Quote bound", {
      quoteRef: bindResult.quote_ref,
      caseRef: bindResult.case_ref,
      policyNumber: bindResult.policy_number,
    });
    return NextResponse.json(bindResult);
  } catch (error) {
    log("warn", "Bind request failed", {
      reference: params.ref,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to bind quote" },
      { status: 400 },
    );
  }
}
