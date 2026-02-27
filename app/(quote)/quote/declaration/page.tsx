import { PageShell } from "@/components/layout/page-shell";
import { Step4DeclarationForm } from "@/components/quote/step4-declaration";

export default function QuoteDeclarationPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
      <p className="mt-2 text-muted-foreground">
        Step 4 of 6 — Demands & needs and declaration consent.
      </p>
      <Step4DeclarationForm />
    </PageShell>
  );
}
