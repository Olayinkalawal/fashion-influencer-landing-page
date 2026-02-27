import { randomUUID } from "crypto";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type {
  BindResponse,
  EndorseResponse,
  PolicyDocument,
  QuoteResponse,
  RenewResponse,
  QuoteStatusResponse,
} from "@/lib/domain/nexus";
import { calculatePremium, evaluateReferralReasons } from "@/lib/nexus/rating";
import { getQuoteByRef, saveQuote, updateStoredQuote } from "@/lib/nexus/store";
import {
  persistEndorsement,
  persistQuoteBound,
  persistQuoteCreated,
  persistRenewal,
} from "@/lib/nexus/persistence";

const DOCUMENT_TYPES: PolicyDocument["document_type"][] = [
  "PI Policy Wording",
  "Statement of Facts",
  "Invoice",
  "Notice to Policyholders",
  "Policy Wording",
  "Policy Summary",
  "Policy Schedule",
];

function normalizeRef(input: string) {
  return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function createCaseRef() {
  return normalizeRef(`C${Date.now()}${Math.floor(Math.random() * 900 + 100)}`);
}

function createQuoteRef() {
  return normalizeRef(`Q${Date.now()}${randomUUID().slice(0, 5)}`);
}

function createPolicyNumber() {
  const year = new Date().getFullYear();
  const suffix = `${Math.floor(Math.random() * 90000 + 10000)}`;
  return `EYA-${year}-${suffix}`;
}

function buildDocumentUrl(caseRef: string, documentType: PolicyDocument["document_type"]) {
  const slug = documentType.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `https://nexus-core.internal/documents/${caseRef}/${slug}.pdf`;
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

  void persistQuoteCreated({ payload, response });

  return response;
}

export function getQuoteStatus(reference: string): QuoteStatusResponse | null {
  const quote = getQuoteByRef(reference);
  return quote?.response ?? null;
}

export function bindQuote(reference: string): BindResponse {
  const existing = getQuoteByRef(reference);

  if (!existing) {
    throw new Error("Quote not found");
  }

  if (existing.response.referral_required) {
    throw new Error("Quote is pending referral and cannot be bound automatically");
  }

  if (existing.policy_number && existing.documents) {
    return {
      case_ref: existing.response.case_ref,
      quote_ref: existing.response.quote_ref,
      policy_number: existing.policy_number,
      status: "On Cover",
      documents: existing.documents,
    };
  }

  const policyNumber = createPolicyNumber();
  const documents = DOCUMENT_TYPES.map((documentType) => ({
    document_type: documentType,
    document_url: buildDocumentUrl(existing.response.case_ref, documentType),
  }));

  updateStoredQuote(reference, (stored) => ({
    ...stored,
    policy_number: policyNumber,
    documents,
    response: {
      ...stored.response,
      status: "On Cover",
    },
  }));

  const result: BindResponse = {
    case_ref: existing.response.case_ref,
    quote_ref: existing.response.quote_ref,
    policy_number: policyNumber,
    status: "On Cover",
    documents,
  };

  void persistQuoteBound(reference, existing.payload, result);

  return result;
}

export function getDocuments(reference: string) {
  const existing = getQuoteByRef(reference);
  if (!existing) {
    return null;
  }
  return existing.documents ?? [];
}

export function renewQuote(reference: string, payload: QuoteApplicationPayload): RenewResponse {
  const existing = getQuoteByRef(reference);

  if (!existing) {
    throw new Error("Quote not found");
  }

  const quote = createQuote(payload);
  const renewalRef = normalizeRef(`R${Date.now()}${Math.floor(Math.random() * 900 + 100)}`);

  updateStoredQuote(reference, (stored) => ({
    ...stored,
    renewals: [
      ...(stored.renewals ?? []),
      {
        renewal_ref: renewalRef,
        created_at: new Date().toISOString(),
        payload,
      },
    ],
  }));

  const response: RenewResponse = {
    case_ref: existing.response.case_ref,
    previous_quote_ref: existing.response.quote_ref,
    renewal_ref: renewalRef,
    status: quote.status === "Pending Referral" ? "Pending Referral" : "Quotation",
    premium: quote.premium,
  };

  void persistRenewal(reference, payload, response);

  return response;
}

export function endorseQuote(
  reference: string,
  payload: Record<string, unknown>,
): EndorseResponse {
  const existing = getQuoteByRef(reference);

  if (!existing) {
    throw new Error("Quote not found");
  }

  if (existing.response.status !== "On Cover") {
    throw new Error("Only On Cover policies can be endorsed");
  }

  const endorsementRef = normalizeRef(`MTA${Date.now()}${Math.floor(Math.random() * 90 + 10)}`);

  updateStoredQuote(reference, (stored) => ({
    ...stored,
    endorsements: [
      ...(stored.endorsements ?? []),
      {
        endorsement_ref: endorsementRef,
        created_at: new Date().toISOString(),
        payload,
      },
    ],
  }));

  const response: EndorseResponse = {
    case_ref: existing.response.case_ref,
    quote_ref: existing.response.quote_ref,
    endorsement_ref: endorsementRef,
    status: "On Cover",
    message: "Endorsement recorded",
  };

  void persistEndorsement(reference, response, payload);

  return response;
}
