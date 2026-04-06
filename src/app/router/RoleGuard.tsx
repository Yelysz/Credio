import { Navigate } from "react-router-dom";
import { getUserFromToken } from "@/shared/utils/auth";
import type { Role } from "@/features/layout/constants/role";

interface Props {
  allowed: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: Props) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role as Role;

  if (!allowed.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}