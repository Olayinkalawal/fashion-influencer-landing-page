import { AppRole } from "@/types/app";

export const appRoles: AppRole[] = ["member", "admin", "broker"];

export function isAppRole(value: string): value is AppRole {
  return appRoles.includes(value as AppRole);
}

export function canAccessAdmin(role: AppRole) {
  return role === "admin";
}
