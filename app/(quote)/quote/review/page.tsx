import { PageShell } from "@/components/layout/page-shell";
import { Step6ReviewSubmit } from "@/components/quote/step6-review-submit";

export default function QuoteReviewPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Quote review</h1>
      <p className="mt-2 text-muted-foreground">
        Validate and submit full payload to Nexus Core quote API.
      </p>
      <Step6ReviewSubmit />
    </PageShell>
  );
}
