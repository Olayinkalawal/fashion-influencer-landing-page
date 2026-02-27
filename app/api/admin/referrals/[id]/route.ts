import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { updateAdminReferral } from "@/lib/admin/store";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updates = (await request.json()) as { status?: string; notes?: string };
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase) {
    const updated = updateAdminReferral(params.id, updates);
    if (!updated) {
      return NextResponse.json({ message: "Referral not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "mock", referral: updated });
  }

  const { data, error } = await supabase
    .from("referrals")
    .update({
      status: updates.status,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("id, referral_type, status, notes, created_at")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", referral: data });
}
