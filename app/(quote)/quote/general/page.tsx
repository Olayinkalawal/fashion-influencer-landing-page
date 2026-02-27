import { PageShell } from "@/components/layout/page-shell";
import { Step2GeneralForm } from "@/components/quote/step2-general";

export default function QuoteGeneralPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
      <p className="mt-2 text-muted-foreground">
        Step 2 of 6 — General questions, extensions, and multi-site details.
      </p>
      <Step2GeneralForm />
    </PageShell>
  );
}
