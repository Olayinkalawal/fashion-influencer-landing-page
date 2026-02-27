import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/nexus/service";

export async function GET(
  _request: Request,
  { params }: { params: { ref: string } },
) {
  const documents = getDocuments(params.ref);

  if (documents === null) {
    return NextResponse.json({ message: "Quote or case not found" }, { status: 404 });
  }

  return NextResponse.json({
    reference: params.ref,
    documents,
  });
}
