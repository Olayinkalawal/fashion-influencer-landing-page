import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { mockCourses } from "@/lib/learning/mock-data";

export async function GET() {
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase) {
    return NextResponse.json({ source: "mock", courses: mockCourses });
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, slug, title, description, category, cpd_hours, is_member_only")
    .order("published_at", { ascending: false });

  if (coursesError) {
    return NextResponse.json({ message: coursesError.message }, { status: 500 });
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, course_id, title, duration_seconds")
    .order("position", { ascending: true });

  if (lessonsError) {
    return NextResponse.json({ message: lessonsError.message }, { status: 500 });
  }

  const lessonsByCourse = new Map<string, any[]>();
  for (const lesson of lessons ?? []) {
    const existing = lessonsByCourse.get(lesson.course_id) ?? [];
    existing.push({
      id: lesson.id,
      title: lesson.title,
      duration_minutes: Math.max(1, Math.round((lesson.duration_seconds ?? 60) / 60)),
      summary: "",
    });
    lessonsByCourse.set(lesson.course_id, existing);
  }

  const mappedCourses = (courses ?? []).map((course: any) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? "",
    category: course.category ?? "General",
    cpd_hours: Number(course.cpd_hours ?? 0),
    is_member_only: Boolean(course.is_member_only),
    lessons: lessonsByCourse.get(course.id) ?? [],
  }));

  return NextResponse.json({
    source: "supabase",
    courses: mappedCourses,
  });
}
