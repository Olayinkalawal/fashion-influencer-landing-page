"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const priorities = ["High", "Normal", "Low"] as const;

export function ClaimsNotificationForm() {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("High");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitClaim() {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/portal/claims-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          message: details,
          priority,
        }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(body.message ?? "Unable to submit claim notification");
      }

      setMessage("Claim notification submitted. The team will contact you shortly.");
      setSubject("");
      setDetails("");
      setPriority("High");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit claim notification",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="font-medium">Subject</label>
        <Input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="e.g. Incident at main site"
        />
      </div>
      <div className="space-y-1">
        <label className="font-medium">Details</label>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          className="min-h-[120px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
          placeholder="Include incident date, location, and immediate actions taken."
        />
      </div>
      <div className="space-y-1">
        <label className="font-medium">Priority</label>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as (typeof priorities)[number])}
          className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
        >
          {priorities.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={submitClaim} disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit claim notification"}
      </Button>
      {message ? <p className="text-emerald-600">{message}</p> : null}
      {error ? <p className="text-destructive">{error}</p> : null}
    </div>
  );
}
