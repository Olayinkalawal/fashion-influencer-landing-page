import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({
      source: "mock",
      members: [
        { id: "mock-1", email: "member1@example.com", role: "member", nexus_case_ref: "C20260001" },
        { id: "mock-2", email: "member2@example.com", role: "member", nexus_case_ref: "C20260002" },
      ],
    });
  }

  const { data, error } = await supabase
    .from("members")
    .select("id, email, role, nexus_case_ref")
    .order("joined_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    members: data ?? [],
  });
}
