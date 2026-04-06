import { jwtDecode } from "jwt-decode";
import type { Role as AuthRole } from "@/features/auth/types/auth.types";
import type { Role as LayoutRole } from "@/shared/types/layout.types";

interface TokenPayload {
  firstName: string;
  lastName: string;
  email: string;
  roles: AuthRole[];
}

function mapAuthRoleToLayoutRole(roles: AuthRole[]): LayoutRole {
  if (roles.includes("Administrator")) {
    return "Administrator";
  }

  if (roles.includes("Officer")) {
    return "Officer";
  }

  if (roles.includes("Collector")) {
    return "Collector";
  }

  return "Client";
}

export function getUserFromToken(): {
  name: string;
  email: string;
  role: LayoutRole;
  roles: AuthRole[];
} | null {
  const rawToken = localStorage.getItem("auth_token");

  if (!rawToken || rawToken === "undefined" || rawToken === "null") {
    return null;
  }

  const token = rawToken.trim();

  if (token.split(".").length !== 3) {
    console.error("Token no tiene formato JWT válido:", token);
    localStorage.removeItem("auth_token");
    return null;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const roles = decoded.roles ?? [];

    return {
      name: `${decoded.firstName ?? ""} ${decoded.lastName ?? ""}`.trim(),
      email: decoded.email ?? "",
      role: mapAuthRoleToLayoutRole(roles),
      roles,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("auth_token");
    return null;
  }
}