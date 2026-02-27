"use client";

import { useEffect, useState } from "react";
import type { PolicyDocument, QuoteResponse } from "@/lib/domain/nexus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PolicyStatusWidget() {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const quoteRef = window.localStorage.getItem("eya_last_quote_ref");
    if (!quoteRef) return;

    Promise.all([
      fetch(`/api/nexus/quote/${quoteRef}`).then((response) => response.json()),
      fetch(`/api/nexus/documents/${quoteRef}`).then((response) => response.json()),
    ])
      .then(([quoteBody, docsBody]) => {
        setQuote(quoteBody as QuoteResponse);
        setDocuments((docsBody as { documents?: PolicyDocument[] }).documents ?? []);
      })
      .catch(() => setError("Unable to fetch latest policy details."));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Policy status widget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {quote ? (
            <>
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
                <strong>Total premium:</strong> £{quote.premium.total_gbp.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">No active quote found in this browser session.</p>
          )}
          {error ? <p className="text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document vault</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {documents.length > 0 ? (
            <ul className="list-inside list-disc space-y-1">
              {documents.map((document) => (
                <li key={document.document_type}>
                  <a
                    href={document.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    {document.document_type}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No generated documents yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
