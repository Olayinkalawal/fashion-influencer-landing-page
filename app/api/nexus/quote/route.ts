import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createQuote } from "@/lib/nexus/service";
import { validateQuoteApplication } from "@/lib/validation/quote";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = validateQuoteApplication(payload);
    const quote = await createQuote(validated);
    log("info", "Quote created", {
      caseRef: quote.case_ref,
      quoteRef: quote.quote_ref,
      status: quote.status,
      referralRequired: quote.referral_required,
    });
    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      log("warn", "Quote payload validation failed", {
        issueCount: error.issues.length,
      });
      return NextResponse.json(
        { message: "Invalid quote payload", issues: error.flatten() },
        { status: 400 },
      );
    }

    log("error", "Unexpected quote creation failure", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ message: "Unable to create quote" }, { status: 500 });
  }
}
