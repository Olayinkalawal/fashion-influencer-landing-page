import { describe, expect, it } from "vitest";
import {
  createAdminCourse,
  createAdminLiveSession,
  deleteAdminCourse,
  deleteAdminLiveSession,
  listAdminCourses,
  listAdminLiveSessions,
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
});
