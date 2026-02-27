import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBySlug, mockCourses } from "@/lib/learning/mock-data";

export function generateStaticParams() {
  return mockCourses.map((course) => ({ slug: course.slug }));
}

export default function LearningCoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) return notFound();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">{course.description}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Category: {course.category} · CPD hours: {course.cpd_hours}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {course.lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{lesson.summary}</p>
              <p>Duration: {lesson.duration_minutes} minutes</p>
              <Button asChild size="sm">
                <Link href={`/learning/${course.slug}/lesson/${lesson.id}`}>Open lesson</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
