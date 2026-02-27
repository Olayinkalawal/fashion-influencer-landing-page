import { describe, expect, it } from "vitest";
import { quoteApplicationSchema } from "@/lib/validation/quote";
import { buildQuotePayload } from "@/lib/testing/fixtures";

describe("quoteApplicationSchema", () => {
  it("accepts a full valid payload", () => {
    const payload = buildQuotePayload();
    const result = quoteApplicationSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("rejects payload when email confirmation does not match", () => {
    const payload = buildQuotePayload({
      your_details: {
        ...buildQuotePayload().your_details,
        email_confirm: "mismatch@example.com",
      },
    });

    const result = quoteApplicationSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issueMessages = result.error.issues.map((issue) => issue.message);
      expect(issueMessages).toContain("Email confirmation must match.");
    }
  });

  it("requires ERN when exemption is false", () => {
    const payload = buildQuotePayload({
      ern: {
        is_ern_exempt: false,
        ern_number: "",
      },
    });

    const result = quoteApplicationSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issueMessages = result.error.issues.map((issue) => issue.message);
      expect(issueMessages).toContain("ERN number is required when not exempt.");
    }
  });
});
