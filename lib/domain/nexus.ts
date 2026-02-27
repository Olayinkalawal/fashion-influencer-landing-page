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
