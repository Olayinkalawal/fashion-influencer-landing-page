import { PageShell } from "@/components/layout/page-shell";
import { Step3AssumptionsForm } from "@/components/quote/step3-assumptions";

export default function QuoteAssumptionsPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
      <p className="mt-2 text-muted-foreground">
        Step 3 of 6 — Assumptions and manual review triggers.
      </p>
      <Step3AssumptionsForm />
    </PageShell>
  );
}
