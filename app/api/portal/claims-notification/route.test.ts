import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSessionMock = vi.fn();
const createPortalClaimNotificationMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/portal/member", () => ({
  createPortalClaimNotification: createPortalClaimNotificationMock,
}));

describe("portal claims notification API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated claim submission", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/portal/claims-notification", {
        method: "POST",
        body: JSON.stringify({ subject: "Incident", message: "Details" }),
      }),
    );

    expect(response.status).toBe(403);
  });

  it("validates required fields", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: "member@example.com" } });
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/portal/claims-notification", {
        method: "POST",
        body: JSON.stringify({ subject: "", message: "" }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("submits claim notification for authenticated member", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: "member@example.com" } });
    createPortalClaimNotificationMock.mockResolvedValue({
      id: "support-1",
      source: "supabase",
      status: "Open",
    });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("http://localhost/api/portal/claims-notification", {
        method: "POST",
        body: JSON.stringify({
          subject: "Incident at setting",
          message: "Water leak in classroom.",
          priority: "High",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(createPortalClaimNotificationMock).toHaveBeenCalledWith({
      email: "member@example.com",
      subject: "Incident at setting",
      message: "Water leak in classroom.",
      priority: "High",
    });
    expect(body.status).toBe("submitted");
  });
});
