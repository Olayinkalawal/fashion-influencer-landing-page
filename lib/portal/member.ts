import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { log } from "@/lib/logger";

export interface PortalMemberProfile {
  id: string;
  email: string;
  name: string | null;
  org_name: string | null;
  setting_type: string | null;
  joined_at: string | null;
}

async function ensureMemberByEmail(email: string) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const { data: existing } = await supabase
    .from("members")
    .select("id, email, name, org_name, setting_type, joined_at")
    .eq("email", normalizedEmail)
    .single();

  if (existing) {
    return existing as PortalMemberProfile;
  }

  const { data: created, error } = await supabase
    .from("members")
    .insert({
      email: normalizedEmail,
      name: normalizedEmail.split("@")[0],
    })
    .select("id, email, name, org_name, setting_type, joined_at")
    .single();

  if (error || !created) {
    log("warn", "Unable to create member profile for portal access", {
      email: normalizedEmail,
      error: error?.message,
    });
    return null;
  }

  return created as PortalMemberProfile;
}

export async function getPortalMemberProfile(email: string): Promise<PortalMemberProfile> {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return {
      id: "mock-member",
      email,
      name: email.split("@")[0],
      org_name: null,
      setting_type: null,
      joined_at: null,
    };
  }

  const member = await ensureMemberByEmail(email);
  if (!member) {
    return {
      id: "supabase-unavailable-member",
      email,
      name: email.split("@")[0],
      org_name: null,
      setting_type: null,
      joined_at: null,
    };
  }

  return member;
}

export async function updatePortalMemberProfile(
  email: string,
  updates: Partial<Pick<PortalMemberProfile, "name" | "org_name" | "setting_type">>,
): Promise<PortalMemberProfile> {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const base = await getPortalMemberProfile(email);
    return {
      ...base,
      ...updates,
    };
  }

  const existing = await ensureMemberByEmail(email);
  if (!existing) {
    throw new Error("Unable to resolve member profile");
  }

  const { data, error } = await supabase
    .from("members")
    .update({
      name: updates.name ?? existing.name,
      org_name: updates.org_name ?? existing.org_name,
      setting_type: updates.setting_type ?? existing.setting_type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select("id, email, name, org_name, setting_type, joined_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update member profile");
  }

  return data as PortalMemberProfile;
}

export async function createPortalClaimNotification(input: {
  email: string;
  subject: string;
  message: string;
  priority: "Low" | "Normal" | "High";
}) {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return {
      id: `mock-claim-${Date.now()}`,
      source: "mock" as const,
      status: "Open",
    };
  }

  const member = await ensureMemberByEmail(input.email);

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      member_id: member?.id ?? null,
      member_email: input.email,
      subject: input.subject,
      message: input.message,
      priority: input.priority,
      status: "Open",
    })
    .select("id, status")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to submit claim notification");
  }

  return {
    id: data.id as string,
    source: "supabase" as const,
    status: data.status as string,
  };
}
