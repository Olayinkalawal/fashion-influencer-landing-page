import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/admin/auth";
import { deleteAdminCourse, updateAdminCourse } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { recordAdminAuditEvent } from "@/lib/admin/audit";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updates = (await request.json()) as Record<string, unknown>;
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase) {
    const updated = updateAdminCourse(params.id, updates as any);
    if (!updated) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_course_updated",
      payload: { course_id: updated.id, source: "mock", updated_fields: Object.keys(updates) },
    });
    return NextResponse.json({ source: "mock", course: updated });
  }

  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", params.id)
    .select("id, slug, title, description, category, cpd_hours, is_member_only")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_course_updated",
    payload: { course_id: data.id, source: "supabase", updated_fields: Object.keys(updates) },
  });

  return NextResponse.json({ source: "supabase", course: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;

  if (!supabase) {
    const deleted = deleteAdminCourse(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_course_deleted",
      payload: { course_id: params.id, source: "mock" },
    });
    return NextResponse.json({ source: "mock", deleted: true });
  }

  const { error } = await supabase.from("courses").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_course_deleted",
    payload: { course_id: params.id, source: "supabase" },
  });
  return NextResponse.json({ source: "supabase", deleted: true });
}
