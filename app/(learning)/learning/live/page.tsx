import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLiveSessions } from "@/lib/learning/mock-data";

export default function LiveSessionsPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Live sessions</h1>
      <p className="mt-2 text-muted-foreground">
        Upcoming live CPD sessions with booking links.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {mockLiveSessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{session.description}</p>
              <p>Host: {session.host}</p>
              <p>Scheduled: {new Date(session.scheduled_at).toLocaleString()}</p>
              <Link
                href={`/learning/live/${session.id}`}
                className="text-primary underline underline-offset-2"
              >
                View booking details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
