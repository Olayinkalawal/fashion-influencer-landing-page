import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditEventsFeed } from "@/components/admin/audit-events-feed";

export default async function AdminAuditEventsPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Audit events</h1>
      <p className="mt-2 text-muted-foreground">
        Review recent operational events and underwriting actions across the platform.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Event stream</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditEventsFeed />
        </CardContent>
      </Card>
    </PageShell>
  );
}
