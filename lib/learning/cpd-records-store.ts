interface InMemoryCpdRecord {
  id: string;
  memberKey: string;
  source: "course";
  activity: string;
  cpd_hours: number;
  date: string;
  courseId: string;
  evidence_url: string;
}

const cpdRecordStore = new Map<string, InMemoryCpdRecord>();

function recordKey(memberKey: string, courseId: string) {
  return `${memberKey}::${courseId}`;
}

export function upsertInMemoryCourseCpdRecord(input: {
  memberKey: string;
  courseId: string;
  activity: string;
  cpdHours: number;
}) {
  const key = recordKey(input.memberKey, input.courseId);
  const existing = cpdRecordStore.get(key);
  if (existing) {
    return existing;
  }

  const created: InMemoryCpdRecord = {
    id: `cpd-${Date.now()}`,
    memberKey: input.memberKey,
    source: "course",
    activity: input.activity,
    cpd_hours: input.cpdHours,
    date: new Date().toISOString().slice(0, 10),
    courseId: input.courseId,
    evidence_url: input.courseId,
  };

  cpdRecordStore.set(key, created);
  return created;
}

export function listInMemoryCpdRecords(memberKey: string) {
  return Array.from(cpdRecordStore.values()).filter((record) => record.memberKey === memberKey);
}
