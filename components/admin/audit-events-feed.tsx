"use client";

import { useEffect, useState } from "react";

interface AuditEvent {
  id: string;
  case_ref: string | null;
  actor_role: string;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export function AuditEventsFeed() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [source, setSource] = useState<string>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      const response = await fetch("/api/admin/audit-events?limit=50");
      const body = (await response.json()) as {
        source?: string;
        events?: AuditEvent[];
        message?: string;
      };
      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load audit events");
      }
      setSource(body.source ?? "unknown");
      setEvents(body.events ?? []);
    }

    loadEvents().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load audit events"),
    );
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Data source: {source}
      </p>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No audit events recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-md border border-border p-3 text-sm space-y-1">
              <p>
                <strong>Action:</strong> {event.action}
              </p>
              <p>
                <strong>Actor:</strong> {event.actor_role}
              </p>
              <p>
                <strong>Case:</strong> {event.case_ref ?? "N/A"}
              </p>
              <p>
                <strong>When:</strong> {new Date(event.created_at).toLocaleString()}
              </p>
              <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
