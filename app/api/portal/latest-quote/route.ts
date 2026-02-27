import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { fetchLatestQuoteReferenceByMemberEmail } from "@/lib/nexus/persistence";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const latest = await fetchLatestQuoteReferenceByMemberEmail(email);
  return NextResponse.json({ latest_quote: latest });
}
