import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import { deleteAdminCourse, updateAdminCourse } from "@/lib/admin/store";
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
    const updated = updateAdminCourse(params.id, updates as any);
    if (!updated) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
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

  return NextResponse.json({ source: "supabase", course: data });
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
    const deleted = deleteAdminCourse(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ source: "mock", deleted: true });
  }

  const { error } = await supabase.from("courses").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ source: "supabase", deleted: true });
}
