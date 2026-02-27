import { PageShell } from "@/components/layout/page-shell";
import { QuoteDemoForm } from "@/components/quote/quote-demo-form";

export default function QuoteStartPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
        <p className="text-muted-foreground">
          Phase 3 baseline: canonical quote payload validation + internal Nexus Core quote API.
        </p>
      </div>
      <QuoteDemoForm />
    </PageShell>
  );
}
