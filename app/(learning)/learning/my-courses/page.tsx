import { PageShell } from "@/components/layout/page-shell";
import { MyCoursesClient } from "@/components/learning/my-courses-client";

export default function MyCoursesPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">My courses</h1>
      <p className="mt-2 text-muted-foreground">
        Enrollment and progress tracking baseline for member CPD activity.
      </p>
      <div className="mt-8">
        <MyCoursesClient />
      </div>
    </PageShell>
  );
}
