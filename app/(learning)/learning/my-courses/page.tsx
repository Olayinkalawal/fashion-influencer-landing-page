import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCourses } from "@/lib/learning/mock-data";

export default function MyCoursesPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">My courses</h1>
      <p className="mt-2 text-muted-foreground">
        Enrollment and progress tracking baseline for member CPD activity.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mockCourses.map((course, index) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Progress: {Math.min(100, 40 + index * 25)}%</p>
              <p>Completed lessons: {Math.min(course.lessons.length, 1 + index)}</p>
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
    </PageShell>
  );
}
