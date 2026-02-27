import { PageShell } from "@/components/layout/page-shell";
import { PaymentStep } from "@/components/quote/payment-step";

export default function QuotePaymentPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote payment</h1>
      <p className="mt-2 text-muted-foreground">
        Payment hand-off stage (Stripe integration follows in next phase).
      </p>
      <PaymentStep />
    </PageShell>
  );
}
