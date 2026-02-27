import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import {
  getPortalMemberProfile,
  updatePortalMemberProfile,
} from "@/lib/portal/member";

interface UpdateProfileBody {
  name?: string;
  org_name?: string;
  setting_type?: string;
}

async function getSessionEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email?.trim().toLowerCase() ?? null;
}

export async function GET() {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const profile = await getPortalMemberProfile(email);
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as UpdateProfileBody;
  const nextName = body.name?.trim() ?? "";
  if (!nextName) {
    return NextResponse.json({ message: "name is required" }, { status: 400 });
  }

  try {
    const profile = await updatePortalMemberProfile(email, {
      name: nextName,
      org_name: body.org_name?.trim() || null,
      setting_type: body.setting_type?.trim() || null,
    });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update profile" },
      { status: 500 },
    );
  }
}
