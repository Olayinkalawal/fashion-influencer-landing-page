import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/auth";
import {
  createAdminContactMessage,
  listAdminContactMessages,
} from "@/lib/admin/store";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";

interface CreateContactBody {
  member_email: string;
  subject: string;
  message: string;
  priority?: "Low" | "Normal" | "High";
}

export async function GET() {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return NextResponse.json({ source: "mock", messages: listAdminContactMessages() });
  }

  const { data, error } = await supabase
    .from("support_messages")
    .select("id, member_email, subject, message, priority, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", messages: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await requireAdminApiAccess())) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as CreateContactBody;
  if (!body.member_email || !body.subject || !body.message) {
    return NextResponse.json(
      { message: "member_email, subject and message are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    const created = createAdminContactMessage({
      member_email: body.member_email,
      subject: body.subject,
      message: body.message,
      priority: body.priority ?? "Normal",
      status: "Open",
    });
    return NextResponse.json({ source: "mock", message: created }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      member_email: body.member_email,
      subject: body.subject,
      message: body.message,
      priority: body.priority ?? "Normal",
      status: "Open",
    })
    .select("id, member_email, subject, message, priority, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", message: data }, { status: 201 });
}
