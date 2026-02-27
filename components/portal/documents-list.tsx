"use client";

import { useEffect, useState } from "react";
import type { PolicyDocument } from "@/lib/domain/nexus";

export function DocumentsList() {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      const storedQuoteRef = window.localStorage.getItem("eya_last_quote_ref");
      let quoteRef = storedQuoteRef;

      if (!quoteRef) {
        const latestResponse = await fetch("/api/portal/latest-quote");
        const latestBody = (await latestResponse.json()) as {
          latest_quote?: { quote_ref?: string };
        };
        quoteRef = latestBody.latest_quote?.quote_ref ?? null;
        if (quoteRef) {
          window.localStorage.setItem("eya_last_quote_ref", quoteRef);
        }
      }

      if (!quoteRef) {
        return;
      }

      const response = await fetch(`/api/nexus/documents/${quoteRef}`);
      if (!response.ok) {
        throw new Error("Unable to load documents.");
      }
      const body = (await response.json()) as { documents?: PolicyDocument[] };
      setDocuments(body.documents ?? []);
    }

    loadDocuments().catch(() => setError("Unable to load documents."));
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;

  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents available yet.</p>;
  }

  return (
    <ul className="list-inside list-disc space-y-2 text-sm">
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
  );
}
