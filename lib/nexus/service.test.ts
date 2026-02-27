import { describe, expect, it } from "vitest";
import { bindQuote, createQuote, getDocuments, getQuoteStatus } from "@/lib/nexus/service";
import { buildQuotePayload } from "@/lib/testing/fixtures";

describe("nexus quote service", () => {
  it("creates and retrieves a quote by quote reference", () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);
    const fetched = getQuoteStatus(created.quote_ref);

    expect(fetched).not.toBeNull();
    expect(fetched?.quote_ref).toBe(created.quote_ref);
    expect(fetched?.premium.total_gbp).toBe(created.premium.total_gbp);
  });

  it("returns null for unknown references", () => {
    expect(getQuoteStatus("UNKNOWN-REF")).toBeNull();
  });

  it("binds a non-referral quote and exposes 7 policy documents", () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);

    const bindResult = bindQuote(created.quote_ref);
    expect(bindResult.status).toBe("On Cover");
    expect(bindResult.policy_number).toMatch(/^EYA-\d{4}-\d{5}$/);
    expect(bindResult.documents).toHaveLength(7);

    const documents = getDocuments(created.quote_ref);
    expect(documents).toHaveLength(7);
  });

  it("rejects bind when referral is required", () => {
    const payload = buildQuotePayload({
      general: {
        ...buildQuotePayload().general,
        insurance_questions: {
          ...buildQuotePayload().general.insurance_questions!,
          wants_abuse_cover: true,
        },
      },
    });
    const created = createQuote(payload);
    expect(() => bindQuote(created.quote_ref)).toThrow(
      "Quote is pending referral and cannot be bound automatically",
    );
  });
});
