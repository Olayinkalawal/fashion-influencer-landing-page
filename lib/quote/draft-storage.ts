import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { defaultQuoteDraft } from "@/lib/quote/defaults";

const STORAGE_KEY = "eya_quote_draft_v1";

export function getQuoteDraft(): QuoteApplicationPayload {
  if (typeof window === "undefined") {
    return defaultQuoteDraft;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultQuoteDraft;
  }

  try {
    const parsed = JSON.parse(raw) as QuoteApplicationPayload;
    const insuranceQuestions: NonNullable<
      QuoteApplicationPayload["general"]["insurance_questions"]
    > = {
      ...defaultQuoteDraft.general.insurance_questions!,
      ...(parsed.general?.insurance_questions ?? {}),
    };

    return {
      ...defaultQuoteDraft,
      ...parsed,
      your_details: { ...defaultQuoteDraft.your_details, ...parsed.your_details },
      general: {
        ...defaultQuoteDraft.general,
        ...parsed.general,
        main_site: {
          ...defaultQuoteDraft.general.main_site,
          ...parsed.general?.main_site,
        },
        additional_services: {
          ...defaultQuoteDraft.general.additional_services,
          ...parsed.general?.additional_services,
        },
        insurance_questions: insuranceQuestions,
      },
      assumptions: { ...defaultQuoteDraft.assumptions, ...parsed.assumptions },
      declaration: { ...defaultQuoteDraft.declaration, ...parsed.declaration },
      ern: { ...defaultQuoteDraft.ern, ...parsed.ern },
    };
  } catch {
    return defaultQuoteDraft;
  }
}

export function saveQuoteDraft(draft: QuoteApplicationPayload) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearQuoteDraft() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
