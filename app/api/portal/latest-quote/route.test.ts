import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSessionMock = vi.fn();
const fetchLatestQuoteReferenceByMemberEmailMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/nexus/persistence", () => ({
  fetchLatestQuoteReferenceByMemberEmail: fetchLatestQuoteReferenceByMemberEmailMock,
}));

describe("GET /api/portal/latest-quote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when session user has no email", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { GET } = await import("./route");

    const response = await GET();
    expect(response.status).toBe(403);
    expect(fetchLatestQuoteReferenceByMemberEmailMock).not.toHaveBeenCalled();
  });

  it("returns latest quote payload for authenticated member", async () => {
    getServerSessionMock.mockResolvedValue({
      user: { email: "member@example.com" },
    });
    fetchLatestQuoteReferenceByMemberEmailMock.mockResolvedValue({
      quote_ref: "Q123",
      case_ref: "C123",
      status: "On Cover",
      quote_created_at: "2026-02-27T00:00:00.000Z",
    });

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(fetchLatestQuoteReferenceByMemberEmailMock).toHaveBeenCalledWith("member@example.com");
    expect(body).toEqual({
      latest_quote: {
        quote_ref: "Q123",
        case_ref: "C123",
        status: "On Cover",
        quote_created_at: "2026-02-27T00:00:00.000Z",
      },
    });
  });
});
