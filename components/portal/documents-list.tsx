"use client";

import { useEffect, useState } from "react";
import type { PolicyDocument } from "@/lib/domain/nexus";

export function DocumentsList() {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const quoteRef = window.localStorage.getItem("eya_last_quote_ref");
    if (!quoteRef) return;

    fetch(`/api/nexus/documents/${quoteRef}`)
      .then((response) => response.json())
      .then((body: { documents?: PolicyDocument[] }) => {
        setDocuments(body.documents ?? []);
      })
      .catch(() => setError("Unable to load documents."));
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
