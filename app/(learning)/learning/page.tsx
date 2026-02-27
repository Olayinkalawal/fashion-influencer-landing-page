import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { mockCourses } from "@/lib/learning/mock-data";
import { Button } from "@/components/ui/button";

export default function LearningHomePage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Learning hub</h1>
      <p className="mt-2 text-muted-foreground">
        Explore CPD courses, lesson progress, certificates, and upcoming live sessions.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/learning/my-courses">My courses</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/learning/certificates">Certificates</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/learning/live">Live sessions</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mockCourses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{course.description}</p>
              <p>
                <strong>Category:</strong> {course.category} | <strong>CPD:</strong>{" "}
                {course.cpd_hours} hours
              </p>
              <Button asChild size="sm">
                <Link href={`/learning/${course.slug}`}>Open course</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
