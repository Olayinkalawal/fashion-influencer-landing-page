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

interface AdminAuditEventRecord {
  id: string;
  case_ref: string | null;
  actor_role: string;
  action: string;
  payload: Record<string, unknown>;
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

const auditEventStore = new Map<string, AdminAuditEventRecord>([
  [
    "audit-1",
    {
      id: "audit-1",
      case_ref: "C20260001",
      actor_role: "system",
      action: "referral_created",
      payload: {
        referral_type: "Underwriting",
        status: "Pending",
      },
      created_at: new Date().toISOString(),
    },
  ],
]);

function createAuditEvent(input: Omit<AdminAuditEventRecord, "id" | "created_at">) {
  const id = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const created: AdminAuditEventRecord = {
    id,
    created_at: new Date().toISOString(),
    ...input,
  };
  auditEventStore.set(id, created);
  return created;
}

export function listAdminCourses() {
  return Array.from(courseStore.values());
}

export function createAdminCourse(course: Omit<AdminCourseRecord, "id">) {
  const id = `course-${Date.now()}`;
  const created: AdminCourseRecord = { id, ...course };
  courseStore.set(id, created);
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_course_created",
    payload: { course_id: id, title: course.title },
  });
  return created;
}

export function updateAdminCourse(id: string, updates: Partial<AdminCourseRecord>) {
  const existing = courseStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates, id: existing.id };
  courseStore.set(id, updated);
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_course_updated",
    payload: { course_id: id, updated_fields: Object.keys(updates) },
  });
  return updated;
}

export function deleteAdminCourse(id: string) {
  const deleted = courseStore.delete(id);
  if (deleted) {
    createAuditEvent({
      case_ref: null,
      actor_role: "admin",
      action: "admin_course_deleted",
      payload: { course_id: id },
    });
  }
  return deleted;
}

export function listAdminLiveSessions() {
  return Array.from(liveSessionStore.values());
}

export function createAdminLiveSession(session: Omit<AdminLiveSessionRecord, "id">) {
  const id = `live-${Date.now()}`;
  const created: AdminLiveSessionRecord = { id, ...session };
  liveSessionStore.set(id, created);
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_live_session_created",
    payload: { live_session_id: id, title: session.title },
  });
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
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_live_session_updated",
    payload: { live_session_id: id, updated_fields: Object.keys(updates) },
  });
  return updated;
}

export function deleteAdminLiveSession(id: string) {
  const deleted = liveSessionStore.delete(id);
  if (deleted) {
    createAuditEvent({
      case_ref: null,
      actor_role: "admin",
      action: "admin_live_session_deleted",
      payload: { live_session_id: id },
    });
  }
  return deleted;
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
  createAuditEvent({
    case_ref: existing.case_ref,
    actor_role: "admin",
    action: "admin_referral_updated",
    payload: { referral_id: id, status: updated.status, notes: updated.notes },
  });
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
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_contact_message_created",
    payload: { message_id: id, status: created.status, priority: created.priority },
  });
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
  createAuditEvent({
    case_ref: null,
    actor_role: "admin",
    action: "admin_contact_message_updated",
    payload: { message_id: id, updated_fields: Object.keys(updates) },
  });
  return updated;
}

export function deleteAdminContactMessage(id: string) {
  const deleted = contactQueueStore.delete(id);
  if (deleted) {
    createAuditEvent({
      case_ref: null,
      actor_role: "admin",
      action: "admin_contact_message_deleted",
      payload: { message_id: id },
    });
  }
  return deleted;
}

export function listAdminAuditEvents() {
  return Array.from(auditEventStore.values()).sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1,
  );
}
