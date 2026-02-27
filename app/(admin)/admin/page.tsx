import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReferralsSummary } from "@/components/admin/referrals-summary";
import { KpiOverview } from "@/components/admin/kpi-overview";

export default async function AdminHomePage() {
  const session = await requireRole("admin");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin console</h1>
      <p className="mt-2 text-muted-foreground">
        Manage underwriting operations, learning content, referrals, and support queues.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {session.user.email} ({session.user.role}).
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/members">Members</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/courses">Courses</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/live-sessions">Live sessions</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/referrals">Referrals</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/contact-queue">Contact queue</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/audit">Audit events</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Member account management and case linking.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cases & referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferralsSummary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Publish CPD content and manage curriculum.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <KpiOverview />
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
