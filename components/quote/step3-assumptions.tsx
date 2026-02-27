"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxField } from "@/components/quote/field-controls";

const assumptionLabels: Array<{
  key: keyof QuoteApplicationPayload["assumptions"];
  label: string;
}> = [
  {
    key: "assumption_bankrupt",
    label:
      "Has the group/directors/partners ever been declared bankrupt, insolvent, or had a CCJ?",
  },
  { key: "assumption_receiver", label: "Had a receiver or liquidator appointed?" },
  {
    key: "assumption_disqualified",
    label: "Been disqualified under Company Directors Disqualification Act 1986?",
  },
  {
    key: "assumption_criminal",
    label: "Been convicted/charged with an unspent criminal offence?",
  },
  {
    key: "assumption_insurance_cancelled",
    label: "Had insurance cancelled, declared void, or renewal refused?",
  },
  {
    key: "assumption_claim_circumstances",
    label: "Aware of circumstances that could give rise to a claim in last 5 years?",
  },
  {
    key: "assumption_employee_warning",
    label: "Issued final warning/suspended/dismissed any employee in last 12 months?",
  },
];

export function Step3AssumptionsForm() {
  const [draft, setDraft] = useState<QuoteApplicationPayload>(() => getQuoteDraft());

  function updateAssumption(
    key: keyof QuoteApplicationPayload["assumptions"],
    checked: boolean,
  ) {
    const next = {
      ...draft,
      assumptions: {
        ...draft.assumptions,
        [key]: checked,
      },
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 3 — Assumptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assumptionLabels.map((item) => (
          <CheckboxField
            key={item.key}
            id={item.key}
            label={item.label}
            checked={draft.assumptions[item.key]}
            onChange={(checked) => updateAssumption(item.key, checked)}
          />
        ))}
        <p className="text-sm text-muted-foreground">
          Any “Yes” answer will mark the case for manual broker review.
        </p>
        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote/general">Back</Link>
          </Button>
          <Button asChild>
            <Link href="/quote/declaration">Continue to Step 4</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
