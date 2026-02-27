import { describe, expect, it } from "vitest";
import { createQuote } from "@/lib/nexus/service";
import { buildQuotePayload } from "@/lib/testing/fixtures";
import { processCheckoutCompleted } from "@/lib/integrations/stripe/process-checkout-completed";

describe("processCheckoutCompleted", () => {
  it("binds quote on first checkout completion event", () => {
    const created = createQuote(buildQuotePayload());
    const result = processCheckoutCompleted({
      eventId: `evt_${Date.now()}_1`,
      quoteRef: created.quote_ref,
    });

    expect(result.idempotent).toBe(false);
    expect(result.bindResult?.status).toBe("On Cover");
  });

  it("returns idempotent true when event already processed", () => {
    const created = createQuote(buildQuotePayload());
    const eventId = `evt_${Date.now()}_2`;
    processCheckoutCompleted({ eventId, quoteRef: created.quote_ref });

    const second = processCheckoutCompleted({ eventId, quoteRef: created.quote_ref });
    expect(second.idempotent).toBe(true);
    expect(second.bindResult).toBeNull();
  });

  it("throws when quoteRef is missing", () => {
    expect(() =>
      processCheckoutCompleted({
        eventId: "evt_missing_ref",
        quoteRef: "",
      }),
    ).toThrow("Missing quote reference in checkout session metadata");
  });
});
