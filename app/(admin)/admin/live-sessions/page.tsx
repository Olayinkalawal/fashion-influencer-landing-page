import { PageShell } from "@/components/layout/page-shell";
import { requireRole } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLiveSessions } from "@/lib/learning/mock-data";

export default async function AdminLiveSessionsPage() {
  await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin · Live sessions</h1>
      <p className="mt-2 text-muted-foreground">
        Schedule and manage upcoming member webinars and workshops.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mockLiveSessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Host: {session.host} · {new Date(session.scheduled_at).toLocaleString()}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
