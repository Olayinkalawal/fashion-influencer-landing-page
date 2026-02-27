import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { PolicyStatusWidget } from "@/components/portal/policy-status-widget";

export default async function PortalHomePage() {
  const session = await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Member portal</h1>
      <p className="mt-2 text-muted-foreground">
        Phase 1 placeholder. Authentication and role-protected access land in Phase 2.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {session.user.email} ({session.user.role}).
      </p>
      <div className="mt-8">
        <PolicyStatusWidget />
      </div>
    </PageShell>
  );
}
