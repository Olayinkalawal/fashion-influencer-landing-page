"use client";

import { useEffect, useState } from "react";
import type { AdminKpis } from "@/lib/admin/kpis";

interface KpiResponse {
  source?: string;
  metrics?: AdminKpis;
  message?: string;
}

const emptyMetrics: AdminKpis = {
  total_members: 0,
  total_quotes: 0,
  pending_referrals: 0,
  policies_on_cover: 0,
  total_courses: 0,
  active_enrolments: 0,
  quote_to_policy_rate_pct: 0,
};

export function KpiOverview() {
  const [metrics, setMetrics] = useState<AdminKpis>(emptyMetrics);
  const [source, setSource] = useState<string>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const response = await fetch("/api/admin/kpis");
      const body = (await response.json()) as KpiResponse;
      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load KPI metrics");
      }
      setMetrics(body.metrics ?? emptyMetrics);
      setSource(body.source ?? "unknown");
    }

    loadMetrics().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load KPI metrics"),
    );
  }, []);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className="text-xs uppercase tracking-wide">Data source: {source}</p>
      <p>Total members: {metrics.total_members}</p>
      <p>Total quotes: {metrics.total_quotes}</p>
      <p>Policies on cover: {metrics.policies_on_cover}</p>
      <p>Pending referrals: {metrics.pending_referrals}</p>
      <p>Active enrolments: {metrics.active_enrolments}</p>
      <p>Quote → policy conversion: {metrics.quote_to_policy_rate_pct}%</p>
    </div>
  );
}
