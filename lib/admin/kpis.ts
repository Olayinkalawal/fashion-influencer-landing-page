export interface AdminKpis {
  total_members: number;
  total_quotes: number;
  pending_referrals: number;
  policies_on_cover: number;
  total_courses: number;
  active_enrolments: number;
  quote_to_policy_rate_pct: number;
}

export function buildMockAdminKpis(): AdminKpis {
  return {
    total_members: 24,
    total_quotes: 58,
    pending_referrals: 4,
    policies_on_cover: 31,
    total_courses: 6,
    active_enrolments: 47,
    quote_to_policy_rate_pct: 53.45,
  };
}

export function calculateQuoteToPolicyRate(quotes: number, policies: number) {
  if (quotes <= 0 || policies <= 0) {
    return 0;
  }

  return Number(((policies / quotes) * 100).toFixed(2));
}
