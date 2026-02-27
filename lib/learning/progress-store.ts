interface InMemoryEnrolment {
  memberKey: string;
  courseId: string;
  progressPct: number;
  completedAt: string | null;
  lessonCompletions: Record<string, number>;
}

const enrolmentStore = new Map<string, InMemoryEnrolment>();

function enrolmentKey(memberKey: string, courseId: string) {
  return `${memberKey}::${courseId}`;
}

export function listInMemoryEnrolments(memberKey: string) {
  return Array.from(enrolmentStore.values()).filter(
    (enrolment) => enrolment.memberKey === memberKey,
  );
}

export function ensureInMemoryEnrolment(memberKey: string, courseId: string) {
  const key = enrolmentKey(memberKey, courseId);
  const existing = enrolmentStore.get(key);
  if (existing) return existing;

  const created: InMemoryEnrolment = {
    memberKey,
    courseId,
    progressPct: 0,
    completedAt: null,
    lessonCompletions: {},
  };
  enrolmentStore.set(key, created);
  return created;
}

export function updateInMemoryLessonProgress(
  memberKey: string,
  courseId: string,
  lessonId: string,
  watchedSeconds: number,
  totalLessons: number,
) {
  const enrolment = ensureInMemoryEnrolment(memberKey, courseId);
  enrolment.lessonCompletions[lessonId] = watchedSeconds;

  const completionCount = Object.values(enrolment.lessonCompletions).filter(
    (seconds) => seconds > 0,
  ).length;
  const progress = totalLessons > 0 ? (completionCount / totalLessons) * 100 : 0;
  enrolment.progressPct = Number(progress.toFixed(2));

  if (enrolment.progressPct >= 100) {
    enrolment.completedAt = new Date().toISOString();
  }

  enrolmentStore.set(enrolmentKey(memberKey, courseId), enrolment);
  return enrolment;
}
