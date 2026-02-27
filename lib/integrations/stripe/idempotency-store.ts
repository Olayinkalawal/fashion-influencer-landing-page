const processedEventIds = new Set<string>();

export function hasProcessedEvent(eventId: string) {
  return processedEventIds.has(eventId);
}

export function markEventProcessed(eventId: string) {
  processedEventIds.add(eventId);
}
