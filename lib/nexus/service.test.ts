import { describe, expect, it } from "vitest";
import {
  bindQuote,
  createQuote,
  endorseQuote,
  getDocumentsWithFallback,
  getQuoteStatusWithFallback,
  getDocuments,
  getQuoteStatus,
  renewQuote,
} from "@/lib/nexus/service";
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

  it("returns quote and documents through fallback helpers from in-memory store", async () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);
    await bindQuote(created.quote_ref);

    const quote = await getQuoteStatusWithFallback(created.quote_ref);
    const documents = await getDocumentsWithFallback(created.quote_ref);

    expect(quote?.quote_ref).toBe(created.quote_ref);
    expect(documents).toHaveLength(7);
  });

  it("binds a non-referral quote and exposes 7 policy documents", async () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);

    const bindResult = await bindQuote(created.quote_ref);
    expect(bindResult.status).toBe("On Cover");
    expect(bindResult.policy_number).toMatch(/^EYA-\d{4}-\d{5}$/);
    expect(bindResult.documents).toHaveLength(7);

    const documents = getDocuments(created.quote_ref);
    expect(documents).toHaveLength(7);
  });

  it("rejects bind when referral is required", async () => {
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
    await expect(bindQuote(created.quote_ref)).rejects.toThrow(
      "Quote is pending referral and cannot be bound automatically",
    );
  });

  it("creates a renewal response from a valid payload", () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);
    const renewed = renewQuote(created.quote_ref, payload);

    expect(renewed.case_ref).toBe(created.case_ref);
    expect(renewed.previous_quote_ref).toBe(created.quote_ref);
    expect(renewed.renewal_ref).toMatch(/^R\d+/);
    expect(renewed.premium.total_gbp).toBeGreaterThan(0);
  });

  it("records endorsement for on-cover policies only", async () => {
    const payload = buildQuotePayload();
    const created = createQuote(payload);
    await bindQuote(created.quote_ref);

    const endorsed = endorseQuote(created.quote_ref, { note: "Change of address" });
    expect(endorsed.status).toBe("On Cover");
    expect(endorsed.endorsement_ref).toMatch(/^MTA\d+/);
  });
});
