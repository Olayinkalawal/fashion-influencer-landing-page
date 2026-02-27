"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LiveSessionItem {
  id: string;
  title: string;
  scheduled_at: string;
  host: string;
}

export function LiveSessionsManager() {
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadSessions() {
    const response = await fetch("/api/admin/live-sessions");
    const body = (await response.json()) as {
      live_sessions?: LiveSessionItem[];
      message?: string;
    };
    if (!response.ok) {
      throw new Error(body.message ?? "Unable to load live sessions");
    }
    setSessions(body.live_sessions ?? []);
  }

  useEffect(() => {
    loadSessions().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load"),
    );
  }, []);

  async function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/admin/live-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: 60,
      }),
    });

    const body = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(body.message ?? "Unable to create live session");
      return;
    }

    setTitle("");
    setScheduledAt("");
    await loadSessions();
  }

  async function removeSession(id: string) {
    const response = await fetch(`/api/admin/live-sessions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to delete live session");
      return;
    }
    await loadSessions();
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-2 md:grid-cols-3" onSubmit={createSession}>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Session title"
        />
        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
        />
        <Button type="submit">Create live session</Button>
      </form>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{session.title}</p>
              <p className="text-muted-foreground">
                {new Date(session.scheduled_at).toLocaleString()} · {session.host}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => removeSession(session.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
