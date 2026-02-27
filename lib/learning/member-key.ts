import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function getLearningMemberKey() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? "guest@local";
}
