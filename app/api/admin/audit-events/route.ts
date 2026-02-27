import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import { listAdminAuditEvents } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parseLimit(value: string | null) {
  if (!value) return DEFAULT_LIMIT;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

export async function GET(request: Request) {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const limit = parseLimit(url.searchParams.get("limit"));

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({
      source: "mock",
      events: listAdminAuditEvents().slice(0, limit),
    });
  }

  const { data, error } = await supabase
    .from("audit_events")
    .select("id, case_id, actor_role, action, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const caseIds = Array.from(new Set((data ?? []).map((event: any) => event.case_id).filter(Boolean)));
  const { data: cases } =
    caseIds.length > 0
      ? await supabase.from("cases").select("id, case_ref").in("id", caseIds)
      : { data: [] };

  const caseRefById = new Map((cases ?? []).map((item: any) => [item.id, item.case_ref]));
  const events = (data ?? []).map((event: any) => ({
    id: event.id,
    case_ref: event.case_id ? caseRefById.get(event.case_id) ?? null : null,
    actor_role: event.actor_role ?? "system",
    action: event.action,
    payload: event.payload ?? {},
    created_at: event.created_at,
  }));

  return NextResponse.json({
    source: "supabase",
    events,
  });
}
