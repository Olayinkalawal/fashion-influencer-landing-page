import { describe, expect, it } from "vitest";
import { calculatePremium, evaluateReferralReasons } from "@/lib/nexus/rating";
import { buildQuotePayload } from "@/lib/testing/fixtures";

describe("calculatePremium", () => {
  it("returns subtotal, ipt, and total with extension lines", () => {
    const payload = buildQuotePayload();
    const premium = calculatePremium(payload);

    expect(premium.subtotal_gbp).toBeGreaterThan(0);
    expect(premium.ipt_gbp).toBe(Number((premium.subtotal_gbp * 0.12).toFixed(2)));
    expect(premium.total_gbp).toBe(Number((premium.subtotal_gbp + premium.ipt_gbp).toFixed(2)));
    expect(premium.lines.some((line) => line.code === "professional_indemnity_500000")).toBe(true);
  });

  it("sets membership-only premium when insurance quote is declined", () => {
    const payload = buildQuotePayload({
      general: {
        ...buildQuotePayload().general,
        wants_insurance_quote: false,
      },
    });

    const premium = calculatePremium(payload);
    expect(premium.subtotal_gbp).toBe(95);
    expect(premium.lines).toHaveLength(1);
    expect(premium.lines[0].code).toBe("membership_only");
  });
});

describe("evaluateReferralReasons", () => {
  it("returns abuse/terrorism referral reasons when selected", () => {
    const payload = buildQuotePayload({
      general: {
        ...buildQuotePayload().general,
        insurance_questions: {
          ...buildQuotePayload().general.insurance_questions!,
          wants_abuse_cover: true,
          wants_terrorism_cover: true,
        },
      },
    });

    const reasons = evaluateReferralReasons(payload);
    expect(reasons).toContain("Abuse cover requires manual referral.");
    expect(reasons).toContain("Terrorism cover requires manual referral.");
  });
});
