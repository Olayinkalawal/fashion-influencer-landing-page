"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { BindResponse } from "@/lib/domain/nexus";
import { getQuoteDraft } from "@/lib/quote/draft-storage";
import { Input } from "@/components/ui/input";

interface CheckoutResponse {
  mode: "stripe" | "mock";
  quote_ref: string;
  session_id?: string;
  checkout_url?: string | null;
  message?: string;
}

export function PaymentStep() {
  const [draft, setDraft] = useState<QuoteApplicationPayload | null>(null);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [bindResult, setBindResult] = useState<BindResponse | null>(null);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [mockEventId, setMockEventId] = useState(`mock_${Date.now()}`);
  const [error, setError] = useState<string | null>(null);
  const [isBinding, setIsBinding] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    setDraft(getQuoteDraft());
    setQuoteRef(window.localStorage.getItem("eya_last_quote_ref"));
  }, []);

  if (!draft) return null;

  async function handleCreateCheckout() {
    if (!quoteRef) {
      setError("No quote reference available. Submit a quote first.");
      return;
    }

    setError(null);
    setIsCreatingCheckout(true);
    setCheckout(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote_ref: quoteRef }),
      });
      const body = (await response.json()) as CheckoutResponse | { message?: string };
      if (!response.ok) {
        throw new Error(("message" in body && body.message) || "Unable to create checkout session");
      }
      setCheckout(body as CheckoutResponse);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed");
    } finally {
      setIsCreatingCheckout(false);
    }
  }

  async function handleMockWebhookConfirmation() {
    if (!quoteRef) {
      setError("No quote reference available. Submit a quote first.");
      return;
    }

    setError(null);
    setIsBinding(true);
    setBindResult(null);

    try {
      const response = await fetch("/api/stripe/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: mockEventId,
          quote_ref: quoteRef,
        }),
      });
      const body = (await response.json()) as {
        bindResult?: BindResponse;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(body.message || "Unable to confirm payment");
      }

      if (!body.bindResult) {
        throw new Error("Webhook did not produce a bind result.");
      }

      setBindResult(body.bindResult);
      window.localStorage.setItem("eya_last_policy_number", body.bindResult.policy_number);
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
        <Button onClick={handleCreateCheckout} disabled={!quoteRef || isCreatingCheckout}>
          {isCreatingCheckout ? "Creating checkout..." : "Start payment checkout"}
        </Button>
        {checkout ? (
          <div className="rounded-md border border-border p-3 space-y-2">
            <p>
              <strong>Checkout mode:</strong> {checkout.mode}
            </p>
            {checkout.message ? <p>{checkout.message}</p> : null}
            {checkout.checkout_url ? (
              <a
                href={checkout.checkout_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Open Stripe checkout
              </a>
            ) : null}
            {checkout.mode === "mock" ? (
              <div className="space-y-2">
                <Input
                  value={mockEventId}
                  onChange={(event) => setMockEventId(event.target.value)}
                  placeholder="Mock event id"
                />
                <Button onClick={handleMockWebhookConfirmation} disabled={isBinding}>
                  {isBinding ? "Confirming..." : "Confirm payment via webhook simulation"}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
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
