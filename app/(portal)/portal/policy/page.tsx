import { PageShell } from "@/components/layout/page-shell";
import { requireSession } from "@/lib/auth/session";
import { PolicyStatusWidget } from "@/components/portal/policy-status-widget";

export default async function PortalPolicyPage() {
  await requireSession();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">My Policy</h1>
      <p className="mt-2 text-muted-foreground">
        Live policy summary, premium, and current status from Nexus Core.
      </p>
      <div className="mt-8">
        <PolicyStatusWidget />
      </div>
    </PageShell>
  );
}
