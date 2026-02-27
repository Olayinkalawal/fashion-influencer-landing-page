import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessAdmin, isAppRole } from "@/lib/auth/roles";
import { AppRole } from "@/types/app";

export async function requireSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session;
}

export async function requireRole(requiredRole: AppRole) {
  const session = await requireSession();
  const role = session.user.role;

  if (!isAppRole(role)) {
    redirect("/portal");
  }

  if (requiredRole === "admin" && !canAccessAdmin(role)) {
    redirect("/portal");
  }

  return session;
}
