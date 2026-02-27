import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSessionMock = vi.fn();
const getPortalMemberProfileMock = vi.fn();
const updatePortalMemberProfileMock = vi.fn();

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/portal/member", () => ({
  getPortalMemberProfile: getPortalMemberProfileMock,
  updatePortalMemberProfile: updatePortalMemberProfileMock,
}));

describe("portal profile API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects GET when unauthenticated", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { GET } = await import("./route");

    const response = await GET();
    expect(response.status).toBe(403);
  });

  it("returns profile payload for authenticated member", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: "member@example.com" } });
    getPortalMemberProfileMock.mockResolvedValue({
      id: "member-1",
      email: "member@example.com",
      name: "Member One",
      org_name: "Test Nursery",
      setting_type: "Nursery",
      joined_at: null,
    });

    const { GET } = await import("./route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getPortalMemberProfileMock).toHaveBeenCalledWith("member@example.com");
    expect(body.profile.email).toBe("member@example.com");
  });

  it("updates profile for authenticated member", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: "member@example.com" } });
    updatePortalMemberProfileMock.mockResolvedValue({
      id: "member-1",
      email: "member@example.com",
      name: "Updated Name",
      org_name: "Updated Org",
      setting_type: "Childminder",
      joined_at: null,
    });

    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("http://localhost/api/portal/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Updated Name",
          org_name: "Updated Org",
          setting_type: "Childminder",
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(updatePortalMemberProfileMock).toHaveBeenCalledWith("member@example.com", {
      name: "Updated Name",
      org_name: "Updated Org",
      setting_type: "Childminder",
    });
    expect(body.profile.name).toBe("Updated Name");
  });
});
