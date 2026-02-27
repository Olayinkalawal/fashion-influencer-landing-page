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

interface AdminReferralRecord {
  id: string;
  case_ref: string;
  referral_type: string;
  status: string;
  notes: string;
  created_at: string;
}

interface AdminContactMessageRecord {
  id: string;
  member_email: string;
  subject: string;
  message: string;
  priority: "Low" | "Normal" | "High";
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
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

const referralStore = new Map<string, AdminReferralRecord>([
  [
    "ref-1",
    {
      id: "ref-1",
      case_ref: "C20260001",
      referral_type: "Underwriting",
      status: "Pending",
      notes: "Abuse cover requested",
      created_at: new Date().toISOString(),
    },
  ],
]);

const contactQueueStore = new Map<string, AdminContactMessageRecord>([
  [
    "msg-1",
    {
      id: "msg-1",
      member_email: "member1@example.com",
      subject: "Document not available",
      message: "Unable to access policy schedule from portal.",
      priority: "High",
      status: "Open",
      created_at: new Date().toISOString(),
    },
  ],
  [
    "msg-2",
    {
      id: "msg-2",
      member_email: "member2@example.com",
      subject: "Renewal date confirmation",
      message: "Please confirm renewal opening date window.",
      priority: "Normal",
      status: "In Progress",
      created_at: new Date().toISOString(),
    },
  ],
]);

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

export function listAdminReferrals() {
  return Array.from(referralStore.values());
}

export function updateAdminReferral(
  id: string,
  updates: Partial<Omit<AdminReferralRecord, "id" | "case_ref" | "referral_type">>,
) {
  const existing = referralStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: existing.id };
  referralStore.set(id, updated);
  return updated;
}

export function listAdminContactMessages() {
  return Array.from(contactQueueStore.values());
}

export function createAdminContactMessage(
  message: Omit<AdminContactMessageRecord, "id" | "created_at">,
) {
  const id = `msg-${Date.now()}`;
  const created: AdminContactMessageRecord = {
    id,
    ...message,
    created_at: new Date().toISOString(),
  };
  contactQueueStore.set(id, created);
  return created;
}

export function updateAdminContactMessage(
  id: string,
  updates: Partial<Omit<AdminContactMessageRecord, "id" | "created_at">>,
) {
  const existing = contactQueueStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: existing.id };
  contactQueueStore.set(id, updated);
  return updated;
}

export function deleteAdminContactMessage(id: string) {
  return contactQueueStore.delete(id);
}
