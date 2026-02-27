"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { BindResponse } from "@/lib/domain/nexus";
import { getQuoteDraft } from "@/lib/quote/draft-storage";

export function PaymentStep() {
  const [draft, setDraft] = useState<QuoteApplicationPayload | null>(null);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [bindResult, setBindResult] = useState<BindResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBinding, setIsBinding] = useState(false);

  useEffect(() => {
    setDraft(getQuoteDraft());
    setQuoteRef(window.localStorage.getItem("eya_last_quote_ref"));
  }, []);

  if (!draft) return null;

  async function handleBind() {
    if (!quoteRef) {
      setError("No quote reference available. Submit a quote first.");
      return;
    }

    setError(null);
    setIsBinding(true);
    setBindResult(null);

    try {
      const response = await fetch(`/api/nexus/bind/${quoteRef}`, { method: "POST" });
      const body = (await response.json()) as BindResponse | { message?: string };
      if (!response.ok) {
        throw new Error(("message" in body && body.message) || "Unable to bind quote");
      }

      const bind = body as BindResponse;
      setBindResult(bind);
      window.localStorage.setItem("eya_last_policy_number", bind.policy_number);
    } catch (bindError) {
      setError(bindError instanceof Error ? bindError.message : "Binding failed");
    } finally {
      setIsBinding(false);
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Selected payment method: <strong>{draft.payment_method}</strong>
        </p>
        <p className="text-muted-foreground">
          Stripe checkout and bind workflow are implemented in the next integration phase. This
          step currently preserves selected payment method and quote reference.
        </p>
        <p>
          Latest quote reference: <strong>{quoteRef ?? "Not submitted yet"}</strong>
        </p>
        <Button onClick={handleBind} disabled={!quoteRef || isBinding}>
          {isBinding ? "Binding..." : "Simulate payment confirmation & bind"}
        </Button>
        {error ? <p className="text-destructive">{error}</p> : null}
        {bindResult ? (
          <div className="rounded-md border border-border p-3">
            <p>
              <strong>Policy number:</strong> {bindResult.policy_number}
            </p>
            <p>
              <strong>Status:</strong> {bindResult.status}
            </p>
            <p>
              <strong>Documents generated:</strong> {bindResult.documents.length}
            </p>
          </div>
        ) : null}
        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote/review">Back</Link>
          </Button>
          <Button asChild disabled={!bindResult}>
            <Link href="/quote/success">Continue</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
