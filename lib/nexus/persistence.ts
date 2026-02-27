import type {
  BindResponse,
  EndorseResponse,
  PolicyDocument,
  QuoteStatusResponse,
  RenewResponse,
} from "@/lib/domain/nexus";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { log } from "@/lib/logger";

interface PersistQuoteInput {
  payload: QuoteApplicationPayload;
  response: QuoteStatusResponse;
}

async function getDefaultSchemeId() {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("schemes")
    .select("id")
    .eq("code", "EYA-DEFAULT")
    .single();

  if (error || !data) {
    log("warn", "Unable to find default scheme id", { error: error?.message });
    return null;
  }

  return (data as any).id as string;
}

export async function persistQuoteCreated({ payload, response }: PersistQuoteInput) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const schemeId = await getDefaultSchemeId();
  if (!schemeId) return;

  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .upsert(
      {
        case_ref: response.case_ref,
        scheme_id: schemeId,
        status: response.status,
        referral_required: response.referral_required,
        referral_reason: response.referral_reasons.join(" "),
      },
      { onConflict: "case_ref" },
    )
    .select("id")
    .single();

  if (caseError || !caseRow) {
    log("error", "Unable to upsert case", { error: caseError?.message });
    return;
  }

  const caseId = (caseRow as any).id as string;

  const { data: quoteRow, error: quoteError } = await supabase
    .from("quotes")
    .upsert(
      {
        case_id: caseId,
        quote_ref: response.quote_ref,
        customer_payload: payload,
        premium_breakdown: response.premium,
        total_premium_gbp: response.premium.total_gbp,
      },
      { onConflict: "quote_ref" },
    )
    .select("id")
    .single();

  if (quoteError || !quoteRow) {
    log("error", "Unable to upsert quote", { error: quoteError?.message });
    return;
  }

  const quoteId = (quoteRow as any).id as string;
  const allSites = [payload.general.main_site, ...payload.general.additional_sites];

  await supabase.from("quote_sites").delete().eq("quote_id", quoteId);
  const quoteSitesPayload = allSites.map((site, index) => ({
    quote_id: quoteId,
    site_index: index,
    payload: site,
  }));
  const { error: siteError } = await supabase.from("quote_sites").insert(quoteSitesPayload);
  if (siteError) {
    log("warn", "Unable to persist quote sites", { error: siteError.message });
  }

  if (response.referral_required) {
    const referralRecords = response.referral_reasons.map((reason) => ({
      case_id: caseId,
      referral_type: "Underwriting",
      status: "Pending",
      notes: reason,
    }));
    const { error: referralError } = await supabase.from("referrals").insert(referralRecords);
    if (referralError) {
      log("warn", "Unable to persist referrals", { error: referralError.message });
    }
  }
}

export async function persistQuoteBound(
  quoteRef: string,
  payload: QuoteApplicationPayload,
  bindResponse: BindResponse,
) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const { data: quoteRow, error: quoteError } = await supabase
    .from("quotes")
    .select("id, case_id")
    .eq("quote_ref", quoteRef)
    .single();

  if (quoteError || !quoteRow) {
    log("warn", "Unable to find quote row for binding", { quoteRef, error: quoteError?.message });
    return;
  }

  const caseId = (quoteRow as any).case_id as string;

  await supabase
    .from("cases")
    .update({ status: "On Cover", updated_at: new Date().toISOString() })
    .eq("id", caseId);

  const termStart = payload.your_details.start_date;
  const startDate = new Date(termStart || new Date().toISOString().slice(0, 10));
  const termEnd = new Date(startDate);
  termEnd.setFullYear(termEnd.getFullYear() + 1);

  const { data: policyRow, error: policyError } = await supabase
    .from("policies")
    .upsert(
      {
        case_id: caseId,
        policy_number: bindResponse.policy_number,
        status: bindResponse.status,
        term_start_date: startDate.toISOString().slice(0, 10),
        term_end_date: termEnd.toISOString().slice(0, 10),
      },
      { onConflict: "policy_number" },
    )
    .select("id")
    .single();

  if (policyError || !policyRow) {
    log("warn", "Unable to persist policy row", { error: policyError?.message });
    return;
  }

  const policyId = (policyRow as any).id as string;
  await supabase.from("documents").delete().eq("case_id", caseId);
  const { error: docsError } = await supabase.from("documents").insert(
    bindResponse.documents.map((document) => ({
      case_id: caseId,
      policy_id: policyId,
      document_type: document.document_type,
      document_url: document.document_url,
      version: 1,
    })),
  );
  if (docsError) {
    log("warn", "Unable to persist policy documents", { error: docsError.message });
  }
}

export async function persistRenewal(reference: string, payload: QuoteApplicationPayload, renewal: RenewResponse) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id")
    .eq("case_ref", renewal.case_ref)
    .single();

  if (!caseRow) return;

  const { data: policyRow } = await supabase
    .from("policies")
    .select("id")
    .eq("case_id", (caseRow as any).id)
    .single();

  if (!policyRow) return;

  await supabase.from("renewals").insert({
    policy_id: (policyRow as any).id,
    renewal_ref: renewal.renewal_ref,
    status: renewal.status,
    payload,
  });

  await supabase.from("audit_events").insert({
    case_id: (caseRow as any).id,
    actor_role: "system",
    action: "renewal_submitted",
    payload: {
      reference,
      renewal_ref: renewal.renewal_ref,
    },
  });
}

export async function persistEndorsement(reference: string, endorsement: EndorseResponse, payload: Record<string, unknown>) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id")
    .eq("case_ref", endorsement.case_ref)
    .single();

  if (!caseRow) return;

  const { data: policyRow } = await supabase
    .from("policies")
    .select("id")
    .eq("case_id", (caseRow as any).id)
    .single();

  if (!policyRow) return;

  await supabase.from("endorsements").insert({
    policy_id: (policyRow as any).id,
    endorsement_ref: endorsement.endorsement_ref,
    payload,
    effective_at: new Date().toISOString(),
  });

  await supabase.from("audit_events").insert({
    case_id: (caseRow as any).id,
    actor_role: "system",
    action: "endorsement_recorded",
    payload: {
      reference,
      endorsement_ref: endorsement.endorsement_ref,
    },
  });
}

async function resolveCaseIdByReference(reference: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const { data: quoteRow } = await supabase
    .from("quotes")
    .select("case_id")
    .eq("quote_ref", reference)
    .single();

  if (quoteRow?.case_id) {
    return quoteRow.case_id as string;
  }

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id")
    .eq("case_ref", reference)
    .single();

  return caseRow?.id ?? null;
}

export async function fetchQuoteStatusByReference(reference: string): Promise<QuoteStatusResponse | null> {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const caseId = await resolveCaseIdByReference(reference);
  if (!caseId) return null;

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, case_ref, status, referral_required, referral_reason, created_at")
    .eq("id", caseId)
    .single();

  if (!caseRow) return null;

  const { data: quoteRow } = await supabase
    .from("quotes")
    .select("quote_ref, premium_breakdown, created_at")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!quoteRow) return null;

  return {
    case_ref: caseRow.case_ref,
    quote_ref: quoteRow.quote_ref,
    status: caseRow.status,
    premium: quoteRow.premium_breakdown,
    referral_required: Boolean(caseRow.referral_required),
    referral_reasons: caseRow.referral_reason
      ? String(caseRow.referral_reason)
          .split(". ")
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [],
    created_at: quoteRow.created_at ?? caseRow.created_at ?? new Date().toISOString(),
  };
}

export async function fetchDocumentsByReference(
  reference: string,
): Promise<PolicyDocument[] | null> {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const caseId = await resolveCaseIdByReference(reference);
  if (!caseId) return null;

  const { data: documents } = await supabase
    .from("documents")
    .select("document_type, document_url")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });

  if (!documents) {
    return [];
  }

  return documents as PolicyDocument[];
}

export async function fetchStoredQuoteBundle(reference: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const caseId = await resolveCaseIdByReference(reference);
  if (!caseId) return null;

  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, case_ref, status, referral_required, referral_reason, created_at")
    .eq("id", caseId)
    .single();

  if (!caseRow) return null;

  const { data: quoteRow } = await supabase
    .from("quotes")
    .select("quote_ref, customer_payload, premium_breakdown, created_at")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!quoteRow) return null;

  const { data: policyRow } = await supabase
    .from("policies")
    .select("policy_number")
    .eq("case_id", caseId)
    .single();

  const { data: documentRows } = await supabase
    .from("documents")
    .select("document_type, document_url")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });

  return {
    payload: quoteRow.customer_payload as QuoteApplicationPayload,
    response: {
      case_ref: caseRow.case_ref,
      quote_ref: quoteRow.quote_ref,
      status: caseRow.status,
      premium: quoteRow.premium_breakdown,
      referral_required: Boolean(caseRow.referral_required),
      referral_reasons: caseRow.referral_reason
        ? String(caseRow.referral_reason)
            .split(". ")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [],
      created_at: quoteRow.created_at ?? caseRow.created_at ?? new Date().toISOString(),
    } satisfies QuoteStatusResponse,
    policy_number: policyRow?.policy_number ?? undefined,
    documents: ((documentRows ?? []) as PolicyDocument[]) ?? [],
  };
}
