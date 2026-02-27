import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { PolicyStatusWidget } from "@/components/portal/policy-status-widget";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PortalHomePage() {
  const session = await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Member portal</h1>
      <p className="mt-2 text-muted-foreground">
        View your live policy status, documents, renewal options, and account details.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {session.user.email} ({session.user.role}).
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/policy">Policy</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/documents">Documents</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/renewal">Renewal</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/claims">Claims</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/profile">Profile</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/cpd">CPD records</Link>
        </Button>
      </div>
      <div className="mt-8">
        <PolicyStatusWidget />
      </div>
    </PageShell>
  );
}
