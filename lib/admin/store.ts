import { mockCourses, mockLiveSessions } from "@/lib/learning/mock-data";

interface AdminCourseRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cpd_hours: number;
  is_member_only: boolean;
}

interface AdminLiveSessionRecord {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  host: string;
}

const courseStore = new Map<string, AdminCourseRecord>(
  mockCourses.map((course) => [
    course.id,
    {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.category,
      cpd_hours: course.cpd_hours,
      is_member_only: course.is_member_only,
    },
  ]),
);

const liveSessionStore = new Map<string, AdminLiveSessionRecord>(
  mockLiveSessions.map((session) => [
    session.id,
    {
      id: session.id,
      title: session.title,
      description: session.description,
      scheduled_at: session.scheduled_at,
      duration_minutes: session.duration_minutes,
      host: session.host,
    },
  ]),
);

export function listAdminCourses() {
  return Array.from(courseStore.values());
}

export function createAdminCourse(course: Omit<AdminCourseRecord, "id">) {
  const id = `course-${Date.now()}`;
  const created: AdminCourseRecord = { id, ...course };
  courseStore.set(id, created);
  return created;
}

export function updateAdminCourse(id: string, updates: Partial<AdminCourseRecord>) {
  const existing = courseStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: existing.id };
  courseStore.set(id, updated);
  return updated;
}

export function deleteAdminCourse(id: string) {
  return courseStore.delete(id);
}

export function listAdminLiveSessions() {
  return Array.from(liveSessionStore.values());
}

export function createAdminLiveSession(session: Omit<AdminLiveSessionRecord, "id">) {
  const id = `live-${Date.now()}`;
  const created: AdminLiveSessionRecord = { id, ...session };
  liveSessionStore.set(id, created);
  return created;
}

export function updateAdminLiveSession(
  id: string,
  updates: Partial<AdminLiveSessionRecord>,
) {
  const existing = liveSessionStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: existing.id };
  liveSessionStore.set(id, updated);
  return updated;
}

export function deleteAdminLiveSession(id: string) {
  return liveSessionStore.delete(id);
}
