import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CpdRecordsWidget } from "@/components/portal/cpd-records-widget";

export default async function PortalCpdPage() {
  await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">CPD records</h1>
      <p className="mt-2 text-muted-foreground">
        Track completed learning activity and view your earned CPD hours.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Completed CPD activity</CardTitle>
        </CardHeader>
        <CardContent>
          <CpdRecordsWidget />
        </CardContent>
      </Card>
    </PageShell>
  );
}
