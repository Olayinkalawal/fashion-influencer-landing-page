import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function getAdminApiSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function requireAdminApiAccess() {
  const session = await getAdminApiSession();
  return Boolean(session);
}
