import { NextResponse } from "next/server";
import { getAdminApiSession, requireAdminApiAccess } from "@/lib/admin/auth";
import { createAdminLiveSession, listAdminLiveSessions } from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { recordAdminAuditEvent } from "@/lib/admin/audit";

interface CreateLiveSessionBody {
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
  host?: string;
}

export async function GET() {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({ source: "mock", live_sessions: listAdminLiveSessions() });
  }

  const { data, error } = await supabase
    .from("live_sessions")
    .select("id, title, description, scheduled_at, duration_minutes, host")
    .order("scheduled_at", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", live_sessions: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as CreateLiveSessionBody;
  if (!body.title || !body.scheduled_at) {
    return NextResponse.json(
      { message: "title and scheduled_at are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const created = createAdminLiveSession({
      title: body.title,
      description: body.description ?? "",
      scheduled_at: body.scheduled_at,
      duration_minutes: Number(body.duration_minutes ?? 60),
      host: body.host ?? "EYA Team",
    });
    await recordAdminAuditEvent({
      actorId: session.user.email ?? null,
      action: "admin_live_session_created",
      payload: { live_session_id: created.id, source: "mock" },
    });
    return NextResponse.json({ source: "mock", live_session: created }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("live_sessions")
    .insert({
      title: body.title,
      description: body.description ?? "",
      scheduled_at: body.scheduled_at,
      duration_minutes: Number(body.duration_minutes ?? 60),
      host: body.host ?? "EYA Team",
      is_member_only: true,
    })
    .select("id, title, description, scheduled_at, duration_minutes, host")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  await recordAdminAuditEvent({
    actorId: session.user.email ?? null,
    action: "admin_live_session_created",
    payload: { live_session_id: data.id, source: "supabase" },
  });

  return NextResponse.json({ source: "supabase", live_session: data }, { status: 201 });
}
