import { NextResponse } from "next/server";
import { bindQuote } from "@/lib/nexus/service";

export async function POST(
  _request: Request,
  { params }: { params: { ref: string } },
) {
  try {
    const bindResult = await bindQuote(params.ref);
    return NextResponse.json(bindResult);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to bind quote" },
      { status: 400 },
    );
  }
}
