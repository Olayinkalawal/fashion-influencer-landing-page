import { describe, expect, it } from "vitest";
import {
  listInMemoryCpdRecords,
  upsertInMemoryCourseCpdRecord,
} from "@/lib/learning/cpd-records-store";

describe("cpd records store", () => {
  it("creates and deduplicates course CPD records per member/course", () => {
    const first = upsertInMemoryCourseCpdRecord({
      memberKey: "member@test.com",
      courseId: "course-1",
      activity: "Course completion",
      cpdHours: 2,
    });

    const second = upsertInMemoryCourseCpdRecord({
      memberKey: "member@test.com",
      courseId: "course-1",
      activity: "Course completion",
      cpdHours: 2,
    });

    expect(first.id).toBe(second.id);
    expect(listInMemoryCpdRecords("member@test.com")).toHaveLength(1);
  });
});
