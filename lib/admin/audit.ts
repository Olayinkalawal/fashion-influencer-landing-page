import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { log } from "@/lib/logger";

interface RecordAdminAuditEventInput {
  action: string;
  payload: Record<string, unknown>;
  actorId?: string | null;
  actorRole?: string;
  caseRef?: string | null;
}

async function resolveCaseIdByCaseRef(caseRef: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const { data } = await supabase
    .from("cases")
    .select("id")
    .eq("case_ref", caseRef)
    .single();

  return data?.id ?? null;
}

export async function recordAdminAuditEvent({
  action,
  payload,
  actorId = null,
  actorRole = "admin",
  caseRef = null,
}: RecordAdminAuditEventInput) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return;

  try {
    const caseId = caseRef ? await resolveCaseIdByCaseRef(caseRef) : null;
    const { error } = await supabase.from("audit_events").insert({
      case_id: caseId,
      actor_id: actorId,
      actor_role: actorRole,
      action,
      payload,
    });

    if (error) {
      log("warn", "Unable to persist admin audit event", {
        action,
        error: error.message,
      });
    }
  } catch (error) {
    log("warn", "Unexpected admin audit persistence failure", {
      action,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
