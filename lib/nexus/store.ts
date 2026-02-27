import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { PolicyDocument, QuoteStatusResponse } from "@/lib/domain/nexus";

export interface StoredQuote {
  payload: QuoteApplicationPayload;
  response: QuoteStatusResponse;
  policy_number?: string;
  documents?: PolicyDocument[];
  endorsements?: Array<{
    endorsement_ref: string;
    created_at: string;
    payload: Record<string, unknown>;
  }>;
  renewals?: Array<{
    renewal_ref: string;
    created_at: string;
    payload: QuoteApplicationPayload;
  }>;
}

const quoteByRef = new Map<string, StoredQuote>();
const quoteByCaseRef = new Map<string, StoredQuote>();

export function saveQuote(quoteRef: string, caseRef: string, data: StoredQuote) {
  quoteByRef.set(quoteRef, data);
  quoteByCaseRef.set(caseRef, data);
}

export function getQuoteByRef(reference: string) {
  return quoteByRef.get(reference) ?? quoteByCaseRef.get(reference);
}

export function updateStoredQuote(reference: string, updater: (quote: StoredQuote) => StoredQuote) {
  const existing = getQuoteByRef(reference);
  if (!existing) {
    return null;
  }

  const updated = updater(existing);
  quoteByRef.set(existing.response.quote_ref, updated);
  quoteByCaseRef.set(existing.response.case_ref, updated);
  return updated;
}
