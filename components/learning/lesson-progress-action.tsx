"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LessonProgressAction({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function markComplete() {
    setIsSaving(true);
    setMessage(null);
    const response = await fetch("/api/learning/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        lessonId,
        watchedSeconds: 300,
      }),
    });
    const body = (await response.json()) as { progress_pct?: number; message?: string };
    if (!response.ok) {
      setMessage(body.message ?? "Unable to update progress");
      setIsSaving(false);
      return;
    }

    setMessage(`Progress updated: ${body.progress_pct ?? 0}%`);
    setIsSaving(false);
  }

  return (
    <div className="space-y-2">
      <Button size="sm" onClick={markComplete} disabled={isSaving}>
        {isSaving ? "Saving..." : "Mark lesson complete"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
