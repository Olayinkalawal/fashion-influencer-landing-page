import { PageShell } from "@/components/layout/page-shell";
import { Step1YourDetailsForm } from "@/components/quote/step1-your-details";

export default function QuoteStartPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
        <p className="text-muted-foreground">
          Step-by-step EYA underwriting journey with local draft persistence.
        </p>
      </div>
      <Step1YourDetailsForm />
    </PageShell>
  );
}
