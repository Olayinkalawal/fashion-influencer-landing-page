import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockMembers = [
  { email: "member1@example.com", role: "member", nexus_case_ref: "C20260001" },
  { email: "member2@example.com", role: "member", nexus_case_ref: "C20260002" },
];

export default async function AdminMembersPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Members</h1>
      <p className="mt-2 text-muted-foreground">
        Manage member accounts and inspect linked Nexus case references.
      </p>
      <div className="mt-8 space-y-4">
        {mockMembers.map((member) => (
          <Card key={member.email}>
            <CardHeader>
              <CardTitle>{member.email}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Role: {member.role} · Nexus case ref: {member.nexus_case_ref}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
