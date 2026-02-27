import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursesManager } from "@/components/admin/courses-manager";

export default async function AdminCoursesPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Courses</h1>
      <p className="mt-2 text-muted-foreground">
        Publish/unpublish and maintain course catalogue metadata.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesManager />
        </CardContent>
      </Card>
    </PageShell>
  );
}
