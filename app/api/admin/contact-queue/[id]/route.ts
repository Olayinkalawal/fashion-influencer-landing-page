import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/admin/auth";
import { deleteAdminContactMessage, updateAdminContactMessage } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { recordAdminAuditEvent } from "@/lib/admin/audit";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updates = (await request.json()) as {
    status?: "Open" | "In Progress" | "Resolved";
    priority?: "Low" | "Normal" | "High";
    subject?: string;
    message?: string;
  };

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const updated = updateAdminContactMessage(params.id, updates);
    if (!updated) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_contact_message_updated",
      payload: {
        message_id: updated.id,
        source: "mock",
        updated_fields: Object.keys(updates),
      },
    });
    return NextResponse.json({ source: "mock", message: updated });
  }

  const { data, error } = await supabase
    .from("support_messages")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("id, member_email, subject, message, priority, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_contact_message_updated",
    payload: {
      message_id: data.id,
      source: "supabase",
      updated_fields: Object.keys(updates),
    },
  });

  return NextResponse.json({ source: "supabase", message: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const deleted = deleteAdminContactMessage(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_contact_message_deleted",
      payload: { message_id: params.id, source: "mock" },
    });
    return NextResponse.json({ source: "mock", deleted: true });
  }

  const { error } = await supabase.from("support_messages").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_contact_message_deleted",
    payload: { message_id: params.id, source: "supabase" },
  });
  return NextResponse.json({ source: "supabase", deleted: true });
}
