import { NextResponse } from "next/server";
import { endorseQuote } from "@/lib/nexus/service";

export async function POST(
  request: Request,
  { params }: { params: { ref: string } },
) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const response = endorseQuote(params.ref, payload);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to endorse quote" },
      { status: 400 },
    );
  }
}
