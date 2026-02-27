import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createPortalClaimNotification } from "@/lib/portal/member";

interface ClaimsNotificationBody {
  subject?: string;
  message?: string;
  priority?: "Low" | "Normal" | "High";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as ClaimsNotificationBody;
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const priority = body.priority ?? "High";

  if (!subject || !message) {
    return NextResponse.json(
      { message: "subject and message are required" },
      { status: 400 },
    );
  }

  if (!["Low", "Normal", "High"].includes(priority)) {
    return NextResponse.json({ message: "Invalid priority value" }, { status: 400 });
  }

  try {
    const notification = await createPortalClaimNotification({
      email,
      subject,
      message,
      priority,
    });

    return NextResponse.json(
      {
        status: "submitted",
        notification,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to submit claim notification" },
      { status: 500 },
    );
  }
}
