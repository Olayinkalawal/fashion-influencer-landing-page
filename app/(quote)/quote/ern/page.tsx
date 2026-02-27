import { PageShell } from "@/components/layout/page-shell";
import { Step5ErnPaymentForm } from "@/components/quote/step5-ern-payment";

export default function QuoteErnPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
      <p className="mt-2 text-muted-foreground">
        Step 5 of 6 — ERN details and payment method selection.
      </p>
      <Step5ErnPaymentForm />
    </PageShell>
  );
}
