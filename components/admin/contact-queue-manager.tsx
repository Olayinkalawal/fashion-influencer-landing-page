"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactMessageItem {
  id: string;
  member_email: string;
  subject: string;
  message: string;
  priority: "Low" | "Normal" | "High";
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
}

export function ContactQueueManager() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    const response = await fetch("/api/admin/contact-queue");
    const body = (await response.json()) as {
      messages?: ContactMessageItem[];
      message?: string;
    };

    if (!response.ok) {
      throw new Error(body.message ?? "Unable to load contact queue");
    }

    setMessages(body.messages ?? []);
  }

  useEffect(() => {
    loadMessages().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load queue"),
    );
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/admin/contact-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_email: memberEmail,
        subject,
        message,
      }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to create queue message");
      return;
    }

    setMemberEmail("");
    setSubject("");
    setMessage("");
    await loadMessages();
  }

  async function updateStatus(id: string, status: ContactMessageItem["status"]) {
    const response = await fetch(`/api/admin/contact-queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to update message");
      return;
    }

    await loadMessages();
  }

  async function removeMessage(id: string) {
    const response = await fetch(`/api/admin/contact-queue/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to delete message");
      return;
    }

    await loadMessages();
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-2 md:grid-cols-3" onSubmit={submitMessage}>
        <Input
          value={memberEmail}
          onChange={(event) => setMemberEmail(event.target.value)}
          placeholder="member@example.com"
        />
        <Input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject"
        />
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
        />
        <Button type="submit" className="md:col-span-3">
          Add queue message
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-2">
        {messages.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-border px-3 py-2 text-sm space-y-2"
          >
            <p>
              <strong>{item.subject}</strong> · {item.member_email}
            </p>
            <p className="text-muted-foreground">{item.message}</p>
            <p>
              Priority: {item.priority} · Status: {item.status}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, "Open")}>
                Open
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus(item.id, "In Progress")}
              >
                In Progress
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, "Resolved")}>
                Resolved
              </Button>
              <Button size="sm" variant="outline" onClick={() => removeMessage(item.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
