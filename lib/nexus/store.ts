import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { QuoteStatusResponse } from "@/lib/domain/nexus";

export interface StoredQuote {
  payload: QuoteApplicationPayload;
  response: QuoteStatusResponse;
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
