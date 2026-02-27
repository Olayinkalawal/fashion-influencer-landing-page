import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createQuote } from "@/lib/nexus/service";
import { validateQuoteApplication } from "@/lib/validation/quote";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = validateQuoteApplication(payload);
    const quote = createQuote(validated);
    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid quote payload", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Unable to create quote" }, { status: 500 });
  }
}
