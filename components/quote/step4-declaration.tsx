"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckboxField } from "@/components/quote/field-controls";

export function Step4DeclarationForm() {
  const [draft, setDraft] = useState<QuoteApplicationPayload>(() => getQuoteDraft());

  function updateDeclaration(value: Partial<QuoteApplicationPayload["declaration"]>) {
    const next = {
      ...draft,
      declaration: {
        ...draft.declaration,
        ...value,
      },
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 4 — Demands & Needs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CheckboxField
          id="agrees_demands_needs"
          label="I understand insurance is based on information provided, not personal advice."
          checked={draft.declaration.agrees_demands_needs}
          onChange={(checked) => updateDeclaration({ agrees_demands_needs: checked })}
        />
        <CheckboxField
          id="agrees_declaration"
          label="I confirm all answers are true and accept policy declarations and cancellation terms."
          checked={draft.declaration.agrees_declaration}
          onChange={(checked) => updateDeclaration({ agrees_declaration: checked })}
        />

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote/assumptions">Back</Link>
          </Button>
          <Button asChild>
            <Link href="/quote/ern">Continue to Step 5</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
