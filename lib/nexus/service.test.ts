import { describe, expect, it } from "vitest";
import { createQuote, getQuoteStatus } from "@/lib/nexus/service";
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
});
