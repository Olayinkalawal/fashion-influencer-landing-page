import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PortalProfilePage() {
  const session = await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Member account details and organisation profile management.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Email:</strong> {session.user.email}
          </p>
          <p>
            <strong>Role:</strong> {session.user.role}
          </p>
          <p className="text-muted-foreground">
            Editable profile form and account preferences will be added in a subsequent phase.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
