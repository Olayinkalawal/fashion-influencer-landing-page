import { describe, expect, it } from "vitest";
import {
  ensureInMemoryEnrolment,
  listInMemoryEnrolments,
  updateInMemoryLessonProgress,
} from "@/lib/learning/progress-store";

describe("learning progress store", () => {
  it("creates and lists enrolments for a member key", () => {
    ensureInMemoryEnrolment("member@test.com", "course-1");
    const enrolments = listInMemoryEnrolments("member@test.com");
    expect(enrolments.some((item) => item.courseId === "course-1")).toBe(true);
  });

  it("updates lesson progress and computes percentage", () => {
    const updated = updateInMemoryLessonProgress(
      "member2@test.com",
      "course-2",
      "lesson-1",
      120,
      2,
    );
    expect(updated.progressPct).toBe(50);
  });
});
