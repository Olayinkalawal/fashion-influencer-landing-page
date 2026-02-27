import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaimsNotificationForm } from "@/components/portal/claims-notification-form";

export default async function PortalClaimsPage() {
  await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Claims guidance</h1>
      <p className="mt-2 text-muted-foreground">
        Use this area to guide members through first notification of loss.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Claims process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Gather incident details, date, and supporting evidence.</p>
          <p>2. Notify EYA support team immediately for urgent safeguarding incidents.</p>
          <p>3. Submit your first-notification details below.</p>
          <p>4. Track claim progress through case updates.</p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>First notification of loss</CardTitle>
        </CardHeader>
        <CardContent>
          <ClaimsNotificationForm />
        </CardContent>
      </Card>
    </PageShell>
  );
}
