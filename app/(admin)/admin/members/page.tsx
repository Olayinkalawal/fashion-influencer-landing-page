import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembersTable } from "@/components/admin/members-table";

export default async function AdminMembersPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Members</h1>
      <p className="mt-2 text-muted-foreground">
        Manage member accounts and inspect linked Nexus case references.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersTable />
        </CardContent>
      </Card>
    </PageShell>
  );
}
