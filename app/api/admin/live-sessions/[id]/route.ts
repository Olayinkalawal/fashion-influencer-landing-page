import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import { deleteAdminLiveSession, updateAdminLiveSession } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updates = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase) {
    const updated = updateAdminLiveSession(params.id, updates as any);
    if (!updated) {
      return NextResponse.json({ message: "Live session not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "mock", live_session: updated });
  }

  const { data, error } = await supabase
    .from("live_sessions")
    .update(updates)
    .eq("id", params.id)
    .select("id, title, description, scheduled_at, duration_minutes, host")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", live_session: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const deleted = deleteAdminLiveSession(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Live session not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "mock", deleted: true });
  }

  const { error } = await supabase.from("live_sessions").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ source: "supabase", deleted: true });
}
