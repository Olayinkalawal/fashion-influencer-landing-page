import { NextResponse } from "next/server";
import { getAdminApiSession, requireAdminApiAccess } from "@/lib/admin/auth";
import {
  createAdminCourse,
  listAdminCourses,
} from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { recordAdminAuditEvent } from "@/lib/admin/audit";

interface CreateCourseBody {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  cpd_hours?: number;
  is_member_only?: boolean;
}

export async function GET() {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({ source: "mock", courses: listAdminCourses() });
  }

  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, category, cpd_hours, is_member_only")
    .order("published_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", courses: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as CreateCourseBody;
  if (!body.slug || !body.title) {
    return NextResponse.json({ message: "slug and title are required" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const created = createAdminCourse({
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      category: body.category ?? "General",
      cpd_hours: Number(body.cpd_hours ?? 0),
      is_member_only: body.is_member_only ?? true,
    });
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_course_created",
      payload: { course_id: created.id, source: "mock" },
    });
    return NextResponse.json({ source: "mock", course: created }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      category: body.category ?? "General",
      cpd_hours: Number(body.cpd_hours ?? 0),
      is_member_only: body.is_member_only ?? true,
      published_at: new Date().toISOString(),
    })
    .select("id, slug, title, description, category, cpd_hours, is_member_only")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_course_created",
    payload: { course_id: data.id, source: "supabase" },
  });

  return NextResponse.json({ source: "supabase", course: data }, { status: 201 });
}
