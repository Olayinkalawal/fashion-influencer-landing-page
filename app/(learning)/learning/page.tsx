import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningHomePage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Learning hub</h1>
      <p className="mt-2 text-muted-foreground">
        Phase 1 placeholder for the CPD catalogue, lessons, certificates, and live sessions.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Course catalogue</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Member/public visibility and category filtering.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lesson player</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Progress tracking and completion milestones.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Auto-generated CPD certificates upon course completion.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
