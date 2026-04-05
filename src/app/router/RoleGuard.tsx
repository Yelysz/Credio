import { Navigate } from "react-router-dom";
import { getUserFromToken } from "@/shared/utils/auth";
import type { Role } from "@/features/auth/types/auth.types";

interface Props {
  allowed: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: Props) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role as Role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}