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

async function persistAuditEvent(input: {
  caseId: string;
  action: string;
  payload: Record<string, unknown>;
  actorRole?: string;
}) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const { error } = await supabase.from("audit_events").insert({
    case_id: input.caseId,
    actor_role: input.actorRole ?? "system",
    action: input.action,
    payload: input.payload,
  });

  if (error) {
    log("warn", "Unable to persist audit event", {
      action: input.action,
      caseId: input.caseId,
      error: error.message,
    });
  }
}

async function upsertMemberFromPayload(payload: QuoteApplicationPayload) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const email = payload.your_details.email?.trim().toLowerCase();
  if (!email) return null;

  const { data, error } = await supabase
    .from("members")
    .upsert(
      {
        email,
        name: `${payload.your_details.first_name} ${payload.your_details.last_name}`.trim(),
        org_name: payload.your_details.org_name || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (error || !data) {
    log("warn", "Unable to upsert member from quote payload", { error: error?.message, email });
    return null;
  }

  return (data as any).id as string;
}

async function resolveQuoteRowByReference(reference: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const { data: quoteRow } = await supabase
    .from("quotes")
    .select("id, case_id, quote_ref, total_premium_gbp")
    .eq("quote_ref", reference)
    .single();

  return quoteRow ?? null;
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
  const memberId = await upsertMemberFromPayload(payload);

  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .upsert(
      {
        case_ref: response.case_ref,
        scheme_id: schemeId,
        member_id: memberId,
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

  if (memberId) {
    const { error: memberLinkError } = await supabase
      .from("members")
      .update({
        nexus_case_ref: response.case_ref,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);
    if (memberLinkError) {
      log("warn", "Unable to update member nexus case reference", {
        memberId,
        caseRef: response.case_ref,
        error: memberLinkError.message,
      });
    }
  }

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

  await persistAuditEvent({
    caseId,
    action: "quote_created",
    payload: {
      quote_ref: response.quote_ref,
      status: response.status,
      referral_required: response.referral_required,
    },
  });
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

  await persistAuditEvent({
    caseId,
    action: "policy_bound",
    payload: {
      quote_ref: bindResponse.quote_ref,
      policy_number: bindResponse.policy_number,
      document_count: bindResponse.documents.length,
    },
  });
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

  await persistAuditEvent({
    caseId: (caseRow as any).id,
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

  await persistAuditEvent({
    caseId: (caseRow as any).id,
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

  const quoteRow = await resolveQuoteRowByReference(reference);

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

export async function fetchLatestQuoteReferenceByMemberEmail(email: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const { data: memberRow } = await supabase
    .from("members")
    .select("id, nexus_case_ref")
    .eq("email", normalizedEmail)
    .single();

  if (!memberRow?.id) return null;

  let { data: caseRow } = await supabase
    .from("cases")
    .select("id, case_ref, status, created_at")
    .eq("member_id", memberRow.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!caseRow && memberRow.nexus_case_ref) {
    const fallbackCaseResult = await supabase
      .from("cases")
      .select("id, case_ref, status, created_at")
      .eq("case_ref", memberRow.nexus_case_ref)
      .single();
    caseRow = fallbackCaseResult.data;
  }

  if (!caseRow?.id) return null;

  const { data: quoteRow } = await supabase
    .from("quotes")
    .select("quote_ref, created_at")
    .eq("case_id", caseRow.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!quoteRow?.quote_ref) return null;

  return {
    quote_ref: quoteRow.quote_ref as string,
    case_ref: caseRow.case_ref as string,
    status: caseRow.status as string,
    quote_created_at: quoteRow.created_at as string | null,
  };
}

export async function hasPersistedPaymentEvent(eventId: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("payment_events")
      .select("id")
      .eq("event_id", eventId)
      .single();

    if (error) return false;
    return Boolean(data?.id);
  } catch {
    return false;
  }
}

export async function persistCheckoutSessionCreated(input: {
  quoteRef: string;
  sessionId: string;
  amountGbp: number;
  paymentMethod: string;
}) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const quoteRow = await resolveQuoteRowByReference(input.quoteRef);
  if (!quoteRow) {
    log("warn", "Unable to persist checkout session: quote not found", {
      quoteRef: input.quoteRef,
    });
    return;
  }

  await supabase.from("payments").upsert(
    {
      case_id: quoteRow.case_id,
      quote_id: quoteRow.id,
      payment_method: input.paymentMethod,
      status: "Pending",
      amount_gbp: input.amountGbp,
      provider_ref: input.sessionId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "provider_ref" },
  );

  await persistAuditEvent({
    caseId: quoteRow.case_id as string,
    action: "payment_checkout_started",
    payload: {
      quote_ref: input.quoteRef,
      session_id: input.sessionId,
      amount_gbp: input.amountGbp,
      method: input.paymentMethod,
    },
  });
}

export async function persistPaymentCompletion(input: {
  quoteRef: string;
  eventId: string;
}) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  const quoteRow = await resolveQuoteRowByReference(input.quoteRef);
  if (!quoteRow) {
    log("warn", "Unable to persist payment completion: quote not found", {
      quoteRef: input.quoteRef,
    });
    return;
  }

  await supabase.from("payment_events").upsert(
    {
      event_id: input.eventId,
      quote_ref: input.quoteRef,
      event_type: "checkout.session.completed",
    },
    { onConflict: "event_id" },
  );

  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id")
    .eq("quote_id", quoteRow.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (paymentRow?.id) {
    await supabase
      .from("payments")
      .update({
        status: "Completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentRow.id);
  } else {
    await supabase.from("payments").insert({
      case_id: quoteRow.case_id,
      quote_id: quoteRow.id,
      payment_method: "Credit Card",
      status: "Completed",
      amount_gbp: quoteRow.total_premium_gbp,
      provider_ref: null,
    });
  }

  await persistAuditEvent({
    caseId: quoteRow.case_id as string,
    action: "payment_completed",
    payload: {
      quote_ref: input.quoteRef,
      event_id: input.eventId,
      amount_gbp: quoteRow.total_premium_gbp,
    },
  });
}
