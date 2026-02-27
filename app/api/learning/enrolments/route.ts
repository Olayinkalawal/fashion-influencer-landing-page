import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { getLearningMemberKey } from "@/lib/learning/member-key";
import { listInMemoryEnrolments, ensureInMemoryEnrolment } from "@/lib/learning/progress-store";
import { mockCourses } from "@/lib/learning/mock-data";
import { resolveLearningMemberRecord } from "@/lib/learning/member-record";

interface EnrolRequestBody {
  courseId: string;
}

function mapMockEnrolments(memberKey: string) {
  const enrolments = listInMemoryEnrolments(memberKey);
  return enrolments
    .map((enrolment) => {
      const course = mockCourses.find((item) => item.id === enrolment.courseId);
      if (!course) return null;
      return {
        course_id: course.id,
        title: course.title,
        slug: course.slug,
        progress_pct: enrolment.progressPct,
        completed_at: enrolment.completedAt,
      };
    })
    .filter(Boolean);
}

export async function GET() {
  const memberKey = await getLearningMemberKey();
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase || memberKey === "guest@local") {
    return NextResponse.json({
      source: "mock",
      enrolments: mapMockEnrolments(memberKey),
    });
  }

  const member = await resolveLearningMemberRecord(memberKey);
  if (!member) return NextResponse.json({ source: "supabase", enrolments: [] });

  const { data, error } = await supabase
    .from("enrolments")
    .select("course_id, progress_pct, completed_at, courses(title, slug)")
    .eq("member_id", member.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    enrolments: (data ?? []).map((item: any) => ({
      course_id: item.course_id,
      title: item.courses?.title ?? "Unknown course",
      slug: item.courses?.slug ?? "",
      progress_pct: Number(item.progress_pct ?? 0),
      completed_at: item.completed_at,
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as EnrolRequestBody;
  if (!body.courseId) {
    return NextResponse.json({ message: "courseId is required" }, { status: 400 });
  }

  const memberKey = await getLearningMemberKey();
  const supabase = getSupabaseAdminClient() as any;

  if (!supabase || memberKey === "guest@local") {
    const enrolment = ensureInMemoryEnrolment(memberKey, body.courseId);
    return NextResponse.json({
      source: "mock",
      enrolment: {
        course_id: enrolment.courseId,
        progress_pct: enrolment.progressPct,
        completed_at: enrolment.completedAt,
      },
    });
  }

  const member = await resolveLearningMemberRecord(memberKey);
  if (!member) {
    return NextResponse.json({ message: "Unable to resolve member record" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("enrolments")
    .upsert(
      {
        member_id: member.id,
        course_id: body.courseId,
      },
      { onConflict: "member_id,course_id" },
    )
    .select("course_id, progress_pct, completed_at")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    enrolment: data,
  });
}
