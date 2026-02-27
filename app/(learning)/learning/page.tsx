import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCatalogueClient } from "@/components/learning/course-catalogue-client";

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

      <div className="mt-8">
        <CourseCatalogueClient />
      </div>
    </PageShell>
  );
}
