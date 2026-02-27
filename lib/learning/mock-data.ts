export interface Lesson {
  id: string;
  title: string;
  duration_minutes: number;
  summary: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cpd_hours: number;
  is_member_only: boolean;
  lessons: Lesson[];
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  host: string;
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    slug: "safeguarding-refresh-2026",
    title: "Safeguarding Refresher 2026",
    description:
      "Best-practice safeguarding workflows, reporting duties, and incident readiness.",
    category: "Safeguarding",
    cpd_hours: 2.5,
    is_member_only: true,
    lessons: [
      {
        id: "lesson-1",
        title: "Safeguarding Principles",
        duration_minutes: 25,
        summary: "Core safeguarding framework and practical scenarios.",
      },
      {
        id: "lesson-2",
        title: "Escalation Procedures",
        duration_minutes: 30,
        summary: "Incident response and escalation to authorities and insurers.",
      },
    ],
  },
  {
    id: "course-2",
    slug: "early-years-risk-management",
    title: "Early Years Risk Management",
    description:
      "Risk controls, document readiness, and evidence management for nursery operators.",
    category: "Risk Management",
    cpd_hours: 1.75,
    is_member_only: false,
    lessons: [
      {
        id: "lesson-1",
        title: "Risk Matrix Fundamentals",
        duration_minutes: 20,
        summary: "How to establish and maintain a practical risk matrix.",
      },
      {
        id: "lesson-2",
        title: "Evidence & Audit Trail",
        duration_minutes: 20,
        summary: "Preparing an audit trail for incidents and compliance checks.",
      },
      {
        id: "lesson-3",
        title: "Operational Playbook",
        duration_minutes: 15,
        summary: "Daily operational controls to lower frequency and severity.",
      },
    ],
  },
];

export const mockLiveSessions: LiveSession[] = [
  {
    id: "live-1",
    title: "Renewal Readiness Clinic",
    description: "Live Q&A on policy renewals, referrals, and document checks.",
    scheduled_at: "2026-03-15T10:00:00.000Z",
    duration_minutes: 60,
    host: "EYA Broker Team",
  },
  {
    id: "live-2",
    title: "Risk & Safeguarding Deep Dive",
    description: "Case-study workshop focused on incident prevention and response.",
    scheduled_at: "2026-03-28T13:00:00.000Z",
    duration_minutes: 75,
    host: "EYA Learning Faculty",
  },
];

export function getCourseBySlug(slug: string) {
  return mockCourses.find((course) => course.slug === slug) ?? null;
}

export function getLesson(courseSlug: string, lessonId: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;
  return course.lessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLiveSessionById(id: string) {
  return mockLiveSessions.find((session) => session.id === id) ?? null;
}
