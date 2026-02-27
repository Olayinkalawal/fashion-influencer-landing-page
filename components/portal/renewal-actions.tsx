"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getQuoteDraft } from "@/lib/quote/draft-storage";
import type { RenewResponse } from "@/lib/domain/nexus";

export function RenewalActions() {
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [result, setResult] = useState<RenewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function resolveQuoteRef() {
      const storedQuoteRef = window.localStorage.getItem("eya_last_quote_ref");
      if (storedQuoteRef) {
        setQuoteRef(storedQuoteRef);
        return;
      }

      const latestResponse = await fetch("/api/portal/latest-quote");
      const latestBody = (await latestResponse.json()) as {
        latest_quote?: { quote_ref?: string };
      };
      const latestQuoteRef = latestBody.latest_quote?.quote_ref ?? null;
      if (latestQuoteRef) {
        window.localStorage.setItem("eya_last_quote_ref", latestQuoteRef);
      }
      setQuoteRef(latestQuoteRef);
    }

    resolveQuoteRef().catch(() => setError("Unable to load latest quote reference."));
  }, []);

  async function submitRenewal() {
    if (!quoteRef) {
      setError("No quote reference available for renewal.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`/api/nexus/renew/${quoteRef}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getQuoteDraft()),
      });
      const body = (await response.json()) as RenewResponse | { message?: string };
      if (!response.ok) {
        throw new Error(("message" in body && body.message) || "Renewal request failed");
      }
      setResult(body as RenewResponse);
    } catch (renewalError) {
      setError(renewalError instanceof Error ? renewalError.message : "Renewal failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 text-sm">
      <p>
        Current quote reference: <strong>{quoteRef ?? "N/A"}</strong>
      </p>
      <Button onClick={submitRenewal} disabled={!quoteRef || isSubmitting}>
        {isSubmitting ? "Submitting renewal..." : "Submit renewal request"}
      </Button>
      {error ? <p className="text-destructive">{error}</p> : null}
      {result ? (
        <div className="rounded-md border border-border p-3">
          <p>
            <strong>Renewal reference:</strong> {result.renewal_ref}
          </p>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Total premium:</strong> £{result.premium.total_gbp.toFixed(2)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
