import { randomUUID } from "crypto";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { QuoteResponse, QuoteStatusResponse } from "@/lib/domain/nexus";
import { calculatePremium, evaluateReferralReasons } from "@/lib/nexus/rating";
import { getQuoteByRef, saveQuote } from "@/lib/nexus/store";

function normalizeRef(input: string) {
  return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function createCaseRef() {
  return normalizeRef(`C${Date.now()}${Math.floor(Math.random() * 900 + 100)}`);
}

function createQuoteRef() {
  return normalizeRef(`Q${Date.now()}${randomUUID().slice(0, 5)}`);
}

export function createQuote(payload: QuoteApplicationPayload): QuoteResponse {
  const premium = calculatePremium(payload);
  const referralReasons = evaluateReferralReasons(payload);
  const referralRequired = referralReasons.length > 0;

  const caseRef = createCaseRef();
  const quoteRef = createQuoteRef();
  const createdAt = new Date().toISOString();

  const response: QuoteStatusResponse = {
    case_ref: caseRef,
    quote_ref: quoteRef,
    status: referralRequired ? "Pending Referral" : "Quotation",
    premium,
    referral_required: referralRequired,
    referral_reasons: referralReasons,
    created_at: createdAt,
  };

  saveQuote(quoteRef, caseRef, {
    payload,
    response,
  });

  return response;
}

export function getQuoteStatus(reference: string): QuoteStatusResponse | null {
  const quote = getQuoteByRef(reference);
  return quote?.response ?? null;
}
