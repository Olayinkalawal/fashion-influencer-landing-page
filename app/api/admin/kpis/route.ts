import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import {
  buildMockAdminKpis,
  calculateQuoteToPolicyRate,
} from "@/lib/admin/kpis";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

async function countRows(supabase: any, table: string, filter?: (query: any) => any) {
  const baseQuery = supabase.from(table).select("id", { count: "exact", head: true });
  const query = filter ? filter(baseQuery) : baseQuery;
  const { count } = await query;
  return count ?? 0;
}

export async function GET() {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({
      source: "mock",
      metrics: buildMockAdminKpis(),
    });
  }

  const [
    totalMembers,
    totalQuotes,
    pendingReferrals,
    policiesOnCover,
    totalCourses,
    activeEnrolments,
  ] = await Promise.all([
    countRows(supabase, "members"),
    countRows(supabase, "quotes"),
    countRows(supabase, "referrals", (query) => query.neq("status", "Resolved")),
    countRows(supabase, "policies", (query) => query.eq("status", "On Cover")),
    countRows(supabase, "courses"),
    countRows(supabase, "enrolments", (query) => query.is("completed_at", null)),
  ]);

  return NextResponse.json({
    source: "supabase",
    metrics: {
      total_members: totalMembers,
      total_quotes: totalQuotes,
      pending_referrals: pendingReferrals,
      policies_on_cover: policiesOnCover,
      total_courses: totalCourses,
      active_enrolments: activeEnrolments,
      quote_to_policy_rate_pct: calculateQuoteToPolicyRate(totalQuotes, policiesOnCover),
    },
  });
}
