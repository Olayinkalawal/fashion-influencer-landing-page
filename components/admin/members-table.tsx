"use client";

import { useEffect, useState } from "react";

interface MemberRow {
  id: string;
  email: string;
  role: string;
  nexus_case_ref: string | null;
}

interface MembersApiResponse {
  source: "mock" | "supabase";
  members: MemberRow[];
  message?: string;
}

export function MembersTable() {
  const [response, setResponse] = useState<MembersApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/members")
      .then((result) => result.json())
      .then((body: MembersApiResponse | { message?: string }) => {
        if ("members" in body) {
          setResponse(body);
          return;
        }
        setError(body.message ?? "Unable to load members");
      })
      .catch(() => setError("Unable to load members"));
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!response) return <p className="text-sm text-muted-foreground">Loading members…</p>;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Data source: {response.source}</p>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Nexus case ref</th>
            </tr>
          </thead>
          <tbody>
            {response.members.map((member) => (
              <tr key={member.id} className="border-t border-border">
                <td className="px-3 py-2">{member.email}</td>
                <td className="px-3 py-2">{member.role}</td>
                <td className="px-3 py-2">{member.nexus_case_ref ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
