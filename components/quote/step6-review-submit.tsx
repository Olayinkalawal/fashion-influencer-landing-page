"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { QuoteResponse } from "@/lib/domain/nexus";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { quoteApplicationSchema } from "@/lib/validation/quote";

const LAST_QUOTE_REF_KEY = "eya_last_quote_ref";

export function Step6ReviewSubmit() {
  const [draft, setDraft] = useState<QuoteApplicationPayload | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(getQuoteDraft());
  }, []);

  const validation = useMemo(() => {
    if (!draft) return null;
    return quoteApplicationSchema.safeParse(draft);
  }, [draft]);

  async function submitQuote() {
    if (!draft) return;
    setError(null);
    setIsSubmitting(true);
    setQuote(null);

    try {
      const response = await fetch("/api/nexus/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const body = (await response.json()) as QuoteResponse | { message?: string };
      if (!response.ok) {
        throw new Error(("message" in body && body.message) || "Failed to create quote");
      }

      const quoteResponse = body as QuoteResponse;
      setQuote(quoteResponse);
      window.localStorage.setItem(LAST_QUOTE_REF_KEY, quoteResponse.quote_ref);
      saveQuoteDraft(draft);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Quote submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function refreshQuoteStatus() {
    if (!quote?.quote_ref) return;
    const response = await fetch(`/api/nexus/quote/${quote.quote_ref}`);
    if (!response.ok) return;
    const body = (await response.json()) as QuoteResponse;
    setQuote(body);
  }

  if (!draft || !validation) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 6 — Review & Submit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border bg-muted/40 p-4 text-sm">
          <p>
            <strong>Applicant:</strong> {draft.your_details.first_name} {draft.your_details.last_name}
          </p>
          <p>
            <strong>Email:</strong> {draft.your_details.email}
          </p>
          <p>
            <strong>Main activity:</strong> {draft.general.main_site.setting_main_activity}
          </p>
          <p>
            <strong>Insurance quote:</strong> {draft.general.wants_insurance_quote ? "Yes" : "No"}
          </p>
          <p>
            <strong>Additional sites:</strong> {draft.general.additional_sites.length}
          </p>
          <p>
            <strong>Payment method:</strong> {draft.payment_method}
          </p>
        </div>

        {!validation.success ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <p className="mb-2 font-semibold">Validation issues:</p>
            <ul className="list-inside list-disc">
              {validation.error.issues.map((issue, index) => (
                <li key={index}>{issue.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button onClick={submitQuote} disabled={isSubmitting || !validation.success}>
            {isSubmitting ? "Submitting..." : "Submit quote to Nexus Core"}
          </Button>
          {quote ? (
            <Button variant="outline" onClick={refreshQuoteStatus}>
              Refresh quote status
            </Button>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {quote ? (
          <div className="rounded-md border border-border p-4 text-sm">
            <p>
              <strong>Case Ref:</strong> {quote.case_ref}
            </p>
            <p>
              <strong>Quote Ref:</strong> {quote.quote_ref}
            </p>
            <p>
              <strong>Status:</strong> {quote.status}
            </p>
            <p>
              <strong>Total Premium:</strong> £{quote.premium.total_gbp.toFixed(2)}
            </p>
            {quote.referral_required ? (
              <p className="pt-1 text-amber-700">
                Referral required: {quote.referral_reasons.join(" ")}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote/ern">Back</Link>
          </Button>
          <Button asChild disabled={!quote}>
            <Link href="/quote/payment">Continue to Payment</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
