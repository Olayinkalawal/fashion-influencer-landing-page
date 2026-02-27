"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CpdRecordItem {
  id: string;
  activity: string;
  cpd_hours: number;
  date: string;
  evidence_url?: string | null;
}

export function CertificatesClient() {
  const [records, setRecords] = useState<CpdRecordItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/learning/cpd-records")
      .then((response) => response.json())
      .then((body: { records?: CpdRecordItem[]; message?: string }) => {
        if (body.message) {
          setError(body.message);
          return;
        }
        setRecords(body.records ?? []);
      })
      .catch(() => setError("Unable to load CPD records"));
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (records.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No completed course certificates yet. Complete a course lesson path to generate one.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <CardTitle>{record.activity}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Date: {record.date}</p>
            <p>CPD hours: {record.cpd_hours}</p>
            {record.evidence_url ? (
              <a
                href={`/api/learning/certificates/${record.evidence_url}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Download certificate PDF
              </a>
            ) : (
              <p className="text-muted-foreground">Certificate course link unavailable.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
