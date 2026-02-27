import { describe, expect, it } from "vitest";
import { buildRenewalReminderHtml, buildRenewalReminderText } from "@/lib/emails/renewal-reminder";

describe("renewal reminder email builders", () => {
  it("includes policy number and days in html and text outputs", () => {
    const input = { policyNumber: "EYA-2026-12345", daysUntilExpiry: 14 };
    const html = buildRenewalReminderHtml(input);
    const text = buildRenewalReminderText(input);

    expect(html).toContain("EYA-2026-12345");
    expect(html).toContain("14");
    expect(text).toContain("EYA-2026-12345");
    expect(text).toContain("14");
  });
});
