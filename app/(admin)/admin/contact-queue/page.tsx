import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockContacts = [
  {
    id: "msg-1",
    member: "member1@example.com",
    subject: "Document not available",
    priority: "High",
  },
  {
    id: "msg-2",
    member: "member2@example.com",
    subject: "Renewal date confirmation",
    priority: "Normal",
  },
];

export default async function AdminContactQueuePage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Contact queue</h1>
      <p className="mt-2 text-muted-foreground">
        Support triage for inbound member requests.
      </p>
      <div className="mt-8 space-y-4">
        {mockContacts.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <CardTitle>{message.subject}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Member: {message.member} · Priority: {message.priority}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
