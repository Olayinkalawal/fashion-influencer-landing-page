import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { renewQuote } from "@/lib/nexus/service";
import { validateQuoteApplication } from "@/lib/validation/quote";

export async function POST(
  request: Request,
  { params }: { params: { ref: string } },
) {
  try {
    const payload = await request.json();
    const validated = validateQuoteApplication(payload);
    const response = await renewQuote(params.ref, validated);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid renewal payload", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to renew quote" },
      { status: 400 },
    );
  }
}
