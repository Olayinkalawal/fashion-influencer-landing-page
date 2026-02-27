import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCourses } from "@/lib/learning/mock-data";

export default async function AdminCoursesPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Courses</h1>
      <p className="mt-2 text-muted-foreground">
        Publish/unpublish and maintain course catalogue metadata.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mockCourses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Category: {course.category} · Lessons: {course.lessons.length} · CPD:{" "}
              {course.cpd_hours}h
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
