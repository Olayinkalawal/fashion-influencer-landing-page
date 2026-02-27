import { NextResponse } from "next/server";
import { getQuoteStatusWithFallback } from "@/lib/nexus/service";

export async function GET(
  _request: Request,
  { params }: { params: { ref: string } },
) {
  const reference = params.ref;
  const quote = await getQuoteStatusWithFallback(reference);

  if (!quote) {
    return NextResponse.json({ message: "Quote not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
}
