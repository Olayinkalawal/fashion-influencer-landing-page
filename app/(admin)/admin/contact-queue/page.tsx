import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactQueueManager } from "@/components/admin/contact-queue-manager";

export default async function AdminContactQueuePage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Contact queue</h1>
      <p className="mt-2 text-muted-foreground">
        Support triage for inbound member requests.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact queue</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactQueueManager />
        </CardContent>
      </Card>
    </PageShell>
  );
}
