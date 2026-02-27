"use client";

import { useEffect, useState } from "react";

export function ReferralsSummary() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/referrals")
      .then((response) => response.json())
      .then((body: { referrals?: Array<{ status: string }> }) => {
        const referrals = body.referrals ?? [];
        const pending = referrals.filter((item) => item.status !== "Resolved").length;
        setPendingCount(pending);
      })
      .catch(() => setPendingCount(0));
  }, []);

  if (pendingCount === null) {
    return <p className="text-sm text-muted-foreground">Loading referral metrics…</p>;
  }

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p>Open referrals: {pendingCount}</p>
      <p>Track and resolve specialist/manual underwriting cases.</p>
    </div>
  );
}
