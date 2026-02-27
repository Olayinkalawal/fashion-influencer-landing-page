import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function requireAdminApiAccess() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}
