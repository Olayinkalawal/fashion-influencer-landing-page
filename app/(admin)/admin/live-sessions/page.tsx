import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveSessionsManager } from "@/components/admin/live-sessions-manager";

export default async function AdminLiveSessionsPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Live sessions</h1>
      <p className="mt-2 text-muted-foreground">
        Schedule and manage upcoming member webinars and workshops.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Live sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <LiveSessionsManager />
        </CardContent>
      </Card>
    </PageShell>
  );
}
