import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLiveSessionById, mockLiveSessions } from "@/lib/learning/mock-data";
import { env } from "@/lib/config/env";

export function generateStaticParams() {
  return mockLiveSessions.map((session) => ({ id: session.id }));
}

export default function LiveSessionDetailPage({ params }: { params: { id: string } }) {
  const session = getLiveSessionById(params.id);
  if (!session) return notFound();
  const bookingUrl = env.CALCOM_BOOKING_URL ?? "https://cal.com";

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">{session.title}</h1>
      <p className="mt-2 text-muted-foreground">{session.description}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Session booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Host: {session.host}</p>
          <p>Starts: {new Date(session.scheduled_at).toLocaleString()}</p>
          <p>Duration: {session.duration_minutes} minutes</p>
          <a href={bookingUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
            Book via Cal.com
          </a>
        </CardContent>
      </Card>
    </PageShell>
  );
}
