import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBySlug, getLesson, mockCourses } from "@/lib/learning/mock-data";

export function generateStaticParams() {
  return mockCourses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      slug: course.slug,
      id: lesson.id,
    })),
  );
}

export default function LessonPage({ params }: { params: { slug: string; id: string } }) {
  const course = getCourseBySlug(params.slug);
  const lesson = getLesson(params.slug, params.id);

  if (!course || !lesson) return notFound();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">{lesson.title}</h1>
      <p className="mt-2 text-muted-foreground">{lesson.summary}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Lesson player (phase baseline)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Duration: {lesson.duration_minutes} minutes</p>
          <p>
            Mux playback and signed URL enforcement are introduced in the integration phase.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/learning/${course.slug}`}>Back to course</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/learning/my-courses">Mark progress in my courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
