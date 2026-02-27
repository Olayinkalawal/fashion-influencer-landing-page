import { describe, expect, it } from "vitest";
import {
  createAdminContactMessage,
  createAdminCourse,
  createAdminLiveSession,
  deleteAdminContactMessage,
  deleteAdminCourse,
  deleteAdminLiveSession,
  listAdminContactMessages,
  listAdminCourses,
  listAdminLiveSessions,
  listAdminReferrals,
  updateAdminReferral,
} from "@/lib/admin/store";

describe("admin in-memory store", () => {
  it("creates and deletes a course", () => {
    const created = createAdminCourse({
      slug: "new-course",
      title: "New Course",
      description: "",
      category: "General",
      cpd_hours: 1,
      is_member_only: true,
    });
    expect(listAdminCourses().some((course) => course.id === created.id)).toBe(true);
    expect(deleteAdminCourse(created.id)).toBe(true);
  });

  it("creates and deletes a live session", () => {
    const created = createAdminLiveSession({
      title: "Live Session",
      description: "",
      scheduled_at: new Date().toISOString(),
      duration_minutes: 60,
      host: "EYA Team",
    });
    expect(listAdminLiveSessions().some((session) => session.id === created.id)).toBe(true);
    expect(deleteAdminLiveSession(created.id)).toBe(true);
  });

  it("updates referral status", () => {
    const first = listAdminReferrals()[0];
    const updated = updateAdminReferral(first.id, { status: "Resolved" });
    expect(updated?.status).toBe("Resolved");
  });

  it("creates and deletes contact queue messages", () => {
    const created = createAdminContactMessage({
      member_email: "member3@example.com",
      subject: "Support needed",
      message: "Help with portal login",
      priority: "Normal",
      status: "Open",
    });

    expect(listAdminContactMessages().some((msg) => msg.id === created.id)).toBe(true);
    expect(deleteAdminContactMessage(created.id)).toBe(true);
  });
});
