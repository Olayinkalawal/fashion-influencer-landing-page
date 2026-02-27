import { describe, expect, it } from "vitest";
import { buildMockAdminKpis, calculateQuoteToPolicyRate } from "@/lib/admin/kpis";

describe("admin KPI helpers", () => {
  it("calculates quote-to-policy conversion rate", () => {
    expect(calculateQuoteToPolicyRate(100, 48)).toBe(48);
    expect(calculateQuoteToPolicyRate(3, 2)).toBe(66.67);
  });

  it("returns zero conversion when quote count is zero", () => {
    expect(calculateQuoteToPolicyRate(0, 99)).toBe(0);
  });

  it("returns stable mock KPI payload", () => {
    const metrics = buildMockAdminKpis();
    expect(metrics.total_quotes).toBeGreaterThan(0);
    expect(metrics.total_members).toBeGreaterThan(0);
  });
});
