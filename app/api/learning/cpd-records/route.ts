import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { getLearningMemberKey } from "@/lib/learning/member-key";
import { listInMemoryCpdRecords } from "@/lib/learning/cpd-records-store";

export async function GET() {
  const memberKey = await getLearningMemberKey();
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase || memberKey === "guest@local") {
    return NextResponse.json({
      source: "mock",
      records: listInMemoryCpdRecords(memberKey),
    });
  }

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("email", memberKey)
    .single();

  if (!member) {
    return NextResponse.json({ source: "supabase", records: [] });
  }

  const { data, error } = await supabase
    .from("cpd_records")
    .select("id, source, activity, cpd_hours, date, evidence_url")
    .eq("member_id", member.id)
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    records: data ?? [],
  });
}
