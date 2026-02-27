import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import { listAdminReferrals } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

export async function GET() {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({ source: "mock", referrals: listAdminReferrals() });
  }

  const { data, error } = await supabase
    .from("referrals")
    .select("id, referral_type, status, notes, created_at, case_id")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const caseIds = Array.from(new Set((data ?? []).map((row: any) => row.case_id)));
  const { data: cases } =
    caseIds.length > 0
      ? await supabase.from("cases").select("id, case_ref").in("id", caseIds)
      : { data: [] };

  const caseRefById = new Map((cases ?? []).map((item: any) => [item.id, item.case_ref]));

  const referrals = (data ?? []).map((row: any) => ({
    id: row.id,
    case_ref: caseRefById.get(row.case_id) ?? "Unknown",
    referral_type: row.referral_type,
    status: row.status,
    notes: row.notes ?? "",
    created_at: row.created_at,
  }));

  return NextResponse.json({ source: "supabase", referrals });
}
