import { describe, expect, it } from "vitest";
import { generateCertificatePdf } from "@/lib/certificates/pdf";

describe("generateCertificatePdf", () => {
  it("returns non-empty PDF bytes", async () => {
    const bytes = await generateCertificatePdf({
      memberName: "EYA Member",
      courseTitle: "Safeguarding Refresher 2026",
      cpdHours: 2.5,
      issuedOn: "2026-02-27",
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
