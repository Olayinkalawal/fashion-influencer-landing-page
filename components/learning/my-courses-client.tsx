"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnrolmentItem {
  course_id: string;
  title: string;
  slug: string;
  progress_pct: number;
  completed_at: string | null;
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
}

export function MyCoursesClient() {
  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshEnrolments() {
    const response = await fetch("/api/learning/enrolments");
    const body = (await response.json()) as { enrolments?: EnrolmentItem[]; message?: string };
    if (!response.ok) {
      throw new Error(body.message ?? "Unable to load enrolments");
    }
    setEnrolments(body.enrolments ?? []);
  }

  useEffect(() => {
    Promise.all([refreshEnrolments(), fetch("/api/learning/courses")])
      .then(async ([_, coursesResponse]) => {
        const coursesBody = (await coursesResponse.json()) as { courses?: CourseItem[] };
        setCourses(coursesBody.courses ?? []);
        setLoading(false);
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to load courses");
        setLoading(false);
      });
  }, []);

  const unenrolledCourses = useMemo(
    () => courses.filter((course) => !enrolments.some((item) => item.course_id === course.id)),
    [courses, enrolments],
  );

  async function handleEnrol(courseId: string) {
    const response = await fetch("/api/learning/enrolments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to enrol");
      return;
    }
    await refreshEnrolments();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading enrolments…</p>;
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {enrolments.map((course) => (
          <Card key={course.course_id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Progress: {course.progress_pct}%</p>
              <p>
                Status: {course.completed_at ? `Completed ${course.completed_at}` : "In progress"}
              </p>
              <Link
                href={`/learning/${course.slug}`}
                className="text-primary underline underline-offset-2"
              >
                Continue learning
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Available courses</h2>
        {unenrolledCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">You are enrolled in all available courses.</p>
        ) : null}
        <div className="grid gap-3 md:grid-cols-2">
          {unenrolledCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button size="sm" onClick={() => handleEnrol(course.id)}>
                  Enrol now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
