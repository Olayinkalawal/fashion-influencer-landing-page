import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDetailsForm } from "@/components/portal/profile-details-form";

export default async function PortalProfilePage() {
  await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Member account details and organisation profile management.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileDetailsForm />
        </CardContent>
      </Card>
    </PageShell>
  );
}
