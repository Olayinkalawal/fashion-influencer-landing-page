import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { log } from "@/lib/logger";

export interface LearningMemberRecord {
  id: string;
  email: string;
}

export async function resolveLearningMemberRecord(
  memberEmail: string,
): Promise<LearningMemberRecord | null> {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const normalizedEmail = memberEmail.trim().toLowerCase();
  if (!normalizedEmail || normalizedEmail === "guest@local") return null;

  const { data, error } = await supabase
    .from("members")
    .upsert(
      {
        email: normalizedEmail,
        name: normalizedEmail.split("@")[0],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id, email")
    .single();

  if (error || !data) {
    log("warn", "Unable to resolve learning member record", {
      email: normalizedEmail,
      error: error?.message,
    });
    return null;
  }

  return {
    id: data.id as string,
    email: data.email as string,
  };
}
