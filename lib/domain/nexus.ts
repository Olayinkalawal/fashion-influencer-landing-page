import type { CaseStatus } from "@/types/app";

export interface PremiumBreakdownLine {
  code: string;
  label: string;
  amount_gbp: number;
}

export interface PremiumBreakdown {
  subtotal_gbp: number;
  ipt_gbp: number;
  total_gbp: number;
  lines: PremiumBreakdownLine[];
}

export interface QuoteResponse {
  case_ref: string;
  quote_ref: string;
  status: CaseStatus;
  premium: PremiumBreakdown;
  referral_required: boolean;
  referral_reasons: string[];
}

export interface QuoteStatusResponse extends QuoteResponse {
  created_at: string;
}

export interface PolicyDocument {
  document_type:
    | "PI Policy Wording"
    | "Statement of Facts"
    | "Invoice"
    | "Notice to Policyholders"
    | "Policy Wording"
    | "Policy Summary"
    | "Policy Schedule";
  document_url: string;
}

export interface BindResponse {
  case_ref: string;
  quote_ref: string;
  policy_number: string;
  status: "On Cover";
  documents: PolicyDocument[];
}

export interface RenewResponse {
  case_ref: string;
  previous_quote_ref: string;
  renewal_ref: string;
  status: "Quotation" | "Pending Referral";
  premium: PremiumBreakdown;
}

export interface EndorseResponse {
  case_ref: string;
  quote_ref: string;
  endorsement_ref: string;
  status: "On Cover";
  message: string;
}
