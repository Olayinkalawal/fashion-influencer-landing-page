import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenewalActions } from "@/components/portal/renewal-actions";

export default async function PortalRenewalPage() {
  await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Policy renewal</h1>
      <p className="mt-2 text-muted-foreground">
        Renewal submission mirrors quote flow and returns a refreshed quotation.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Renewal request</CardTitle>
        </CardHeader>
        <CardContent>
          <RenewalActions />
        </CardContent>
      </Card>
    </PageShell>
  );
}
