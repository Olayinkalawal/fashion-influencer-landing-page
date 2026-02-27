import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { getLearningMemberKey } from "@/lib/learning/member-key";
import { mockCourses } from "@/lib/learning/mock-data";
import { updateInMemoryLessonProgress, ensureInMemoryEnrolment } from "@/lib/learning/progress-store";
import { upsertInMemoryCourseCpdRecord } from "@/lib/learning/cpd-records-store";
import { resolveLearningMemberRecord } from "@/lib/learning/member-record";

interface ProgressRequestBody {
  courseId: string;
  lessonId: string;
  watchedSeconds: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ProgressRequestBody;
  if (!body.courseId || !body.lessonId) {
    return NextResponse.json(
      { message: "courseId and lessonId are required" },
      { status: 400 },
    );
  }

  const memberKey = await getLearningMemberKey();
  const supabase = getSupabaseAdminClient() as any;

  const fallbackCourse = mockCourses.find((item) => item.id === body.courseId);
  const totalLessons = fallbackCourse?.lessons.length ?? 1;

  if (!supabase || memberKey === "guest@local") {
    ensureInMemoryEnrolment(memberKey, body.courseId);
    const enrolment = updateInMemoryLessonProgress(
      memberKey,
      body.courseId,
      body.lessonId,
      body.watchedSeconds,
      totalLessons,
    );

    if (enrolment.progressPct >= 100 && fallbackCourse) {
      upsertInMemoryCourseCpdRecord({
        memberKey,
        courseId: body.courseId,
        activity: `Completed ${fallbackCourse.title}`,
        cpdHours: fallbackCourse.cpd_hours,
      });
    }

    return NextResponse.json({
      source: "mock",
      progress_pct: enrolment.progressPct,
      completed_at: enrolment.completedAt,
    });
  }

  const member = await resolveLearningMemberRecord(memberKey);
  if (!member) {
    return NextResponse.json({ message: "Unable to resolve member record" }, { status: 500 });
  }

  await supabase.from("enrolments").upsert(
    {
      member_id: member.id,
      course_id: body.courseId,
    },
    { onConflict: "member_id,course_id" },
  );

  await supabase
    .from("lesson_completions")
    .upsert(
      {
        member_id: member.id,
        lesson_id: body.lessonId,
        watched_seconds: body.watchedSeconds,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "member_id,lesson_id" },
    );

  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("member_id", member.id);

  const completionCount = completions?.length ?? 0;
  const progressPct = Number(
    (totalLessons > 0 ? (completionCount / totalLessons) * 100 : 0).toFixed(2),
  );

  const completedAt = progressPct >= 100 ? new Date().toISOString() : null;

  const { data: enrolment, error: enrolmentError } = await supabase
    .from("enrolments")
    .update({
      progress_pct: progressPct,
      completed_at: completedAt,
    })
    .eq("member_id", member.id)
    .eq("course_id", body.courseId)
    .select("progress_pct, completed_at")
    .single();

  if (enrolmentError) {
    return NextResponse.json({ message: enrolmentError.message }, { status: 500 });
  }

  if (progressPct >= 100) {
    const activity = `Completed ${fallbackCourse?.title ?? body.courseId}`;
    const date = new Date().toISOString().slice(0, 10);
    const { data: existingRecord } = await supabase
      .from("cpd_records")
      .select("id")
      .eq("member_id", member.id)
      .eq("source", "course")
      .eq("activity", activity)
      .eq("date", date)
      .single();

    if (!existingRecord) {
      await supabase.from("cpd_records").insert({
        member_id: member.id,
        source: "course",
        activity,
        cpd_hours: fallbackCourse?.cpd_hours ?? 0,
        evidence_url: body.courseId,
        date,
      });
    }
  }

  return NextResponse.json({
    source: "supabase",
    progress_pct: enrolment.progress_pct,
    completed_at: enrolment.completed_at,
  });
}
