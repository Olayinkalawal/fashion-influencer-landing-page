import { PageShell } from "@/components/layout/page-shell";
import { SuccessStep } from "@/components/quote/success-step";

export default function QuoteSuccessPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote success</h1>
      <p className="mt-2 text-muted-foreground">
        Quote accepted. Policy bind and documents will surface in portal.
      </p>
      <SuccessStep />
    </PageShell>
  );
}
