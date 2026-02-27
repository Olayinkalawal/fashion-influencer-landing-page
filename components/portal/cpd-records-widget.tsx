"use client";

import { useEffect, useState } from "react";

interface CpdRecord {
  id: string;
  source: string;
  activity: string;
  cpd_hours: number;
  date: string;
  evidence_url: string | null;
}

export function CpdRecordsWidget() {
  const [records, setRecords] = useState<CpdRecord[]>([]);
  const [source, setSource] = useState("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecords() {
      const response = await fetch("/api/learning/cpd-records");
      const body = (await response.json()) as {
        source?: string;
        records?: CpdRecord[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load CPD records");
      }

      setSource(body.source ?? "unknown");
      setRecords(body.records ?? []);
    }

    loadRecords().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load CPD records"),
    );
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (records.length === 0) {
    return (
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Data source: {source}</p>
        <p className="text-sm text-muted-foreground">No completed CPD records yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Data source: {source}</p>
      <ul className="space-y-2">
        {records.map((record) => (
          <li key={record.id} className="rounded-md border border-border p-3">
            <p className="font-medium">{record.activity}</p>
            <p className="text-muted-foreground">
              {record.cpd_hours} CPD hour(s) · {new Date(record.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
