import { describe, expect, it } from "vitest";
import { createQuote } from "@/lib/nexus/service";
import { buildQuotePayload } from "@/lib/testing/fixtures";
import { processCheckoutCompleted } from "@/lib/integrations/stripe/process-checkout-completed";

describe("processCheckoutCompleted", () => {
  it("binds quote on first checkout completion event", async () => {
    const created = await createQuote(buildQuotePayload());
    const result = await processCheckoutCompleted({
      eventId: `evt_${Date.now()}_1`,
      quoteRef: created.quote_ref,
    });

    expect(result.idempotent).toBe(false);
    expect(result.bindResult?.status).toBe("On Cover");
  });

  it("returns idempotent true when event already processed", async () => {
    const created = await createQuote(buildQuotePayload());
    const eventId = `evt_${Date.now()}_2`;
    await processCheckoutCompleted({ eventId, quoteRef: created.quote_ref });

    const second = await processCheckoutCompleted({ eventId, quoteRef: created.quote_ref });
    expect(second.idempotent).toBe(true);
    expect(second.bindResult).toBeNull();
  });

  it("throws when quoteRef is missing", async () => {
    await expect(
      processCheckoutCompleted({
        eventId: "evt_missing_ref",
        quoteRef: "",
      }),
    ).rejects.toThrow("Missing quote reference in checkout session metadata");
  });
});
