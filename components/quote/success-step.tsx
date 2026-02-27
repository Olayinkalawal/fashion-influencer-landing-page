"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PolicyDocument } from "@/lib/domain/nexus";

export function SuccessStep() {
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [policyNumber, setPolicyNumber] = useState<string | null>(null);
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);

  useEffect(() => {
    const storedQuoteRef = window.localStorage.getItem("eya_last_quote_ref");
    setQuoteRef(storedQuoteRef);
    setPolicyNumber(window.localStorage.getItem("eya_last_policy_number"));

    if (storedQuoteRef) {
      fetch(`/api/nexus/documents/${storedQuoteRef}`)
        .then((response) => response.json())
        .then((body: { documents?: PolicyDocument[] }) => {
          setDocuments(body.documents ?? []);
        })
        .catch(() => setDocuments([]));
    }
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Policy setup in progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Thank you. Your quote has been created and queued for bind/payment workflow.
          Reference: <strong>{quoteRef ?? "Not available"}</strong>
        </p>
        <p>
          Policy number: <strong>{policyNumber ?? "Not bound yet"}</strong>
        </p>
        <p className="text-muted-foreground">
          Next phase adds bind, policy number generation, and document availability in portal.
        </p>
        {documents.length > 0 ? (
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 font-medium">Generated policy documents</p>
            <ul className="list-inside list-disc space-y-1">
              {documents.map((document) => (
                <li key={document.document_type}>
                  <a
                    href={document.document_url}
                    className="text-primary underline underline-offset-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {document.document_type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/portal">Go to portal</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/quote">Start another quote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
