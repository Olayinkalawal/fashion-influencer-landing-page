"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ReferralItem {
  id: string;
  case_ref: string;
  referral_type: string;
  status: string;
  notes: string;
  created_at: string;
}

export function ReferralsQueue() {
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadReferrals() {
    const response = await fetch("/api/admin/referrals");
    const body = (await response.json()) as { referrals?: ReferralItem[]; message?: string };
    if (!response.ok) {
      throw new Error(body.message ?? "Unable to load referrals");
    }
    setReferrals(body.referrals ?? []);
  }

  useEffect(() => {
    loadReferrals().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load referrals"),
    );
  }, []);

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to update referral");
      return;
    }
    await loadReferrals();
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {referrals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No referrals currently queued.</p>
      ) : null}
      <div className="space-y-2">
        {referrals.map((referral) => (
          <div
            key={referral.id}
            className="rounded-md border border-border p-3 text-sm space-y-2"
          >
            <p>
              <strong>Case:</strong> {referral.case_ref}
            </p>
            <p>
              <strong>Type:</strong> {referral.referral_type}
            </p>
            <p>
              <strong>Status:</strong> {referral.status}
            </p>
            <p className="text-muted-foreground">{referral.notes}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => updateStatus(referral.id, "Pending")}>
                Pending
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(referral.id, "In Review")}>
                In Review
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(referral.id, "Resolved")}>
                Resolved
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
