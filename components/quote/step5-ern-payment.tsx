"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxField, SelectField, TextField } from "@/components/quote/field-controls";

export function Step5ErnPaymentForm() {
  const [draft, setDraft] = useState<QuoteApplicationPayload>(() => getQuoteDraft());

  function updateErn(value: Partial<QuoteApplicationPayload["ern"]>) {
    const next = {
      ...draft,
      ern: {
        ...draft.ern,
        ...value,
      },
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  function updatePaymentMethod(value: QuoteApplicationPayload["payment_method"]) {
    const next = {
      ...draft,
      payment_method: value,
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 5 — ERN Details & Step 6 Payment Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          id="is_ern_exempt"
          label="Business is exempt from holding an Employer Reference Number"
          checked={draft.ern.is_ern_exempt}
          onChange={(checked) => updateErn({ is_ern_exempt: checked })}
        />
        {!draft.ern.is_ern_exempt ? (
          <TextField
            id="ern_number"
            label="Employer Reference Number (ERN)"
            value={draft.ern.ern_number ?? ""}
            onChange={(value) => updateErn({ ern_number: value })}
          />
        ) : null}

        <SelectField
          id="payment_method"
          label="Payment method"
          value={draft.payment_method}
          onChange={(value) => updatePaymentMethod(value as QuoteApplicationPayload["payment_method"])}
          options={[
            "Invoice",
            "Annual Direct Debit",
            "Credit Card",
            "Close Brothers Premium Finance",
          ]}
        />

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote/declaration">Back</Link>
          </Button>
          <Button asChild>
            <Link href="/quote/review">Continue to Review</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
