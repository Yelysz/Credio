import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import type { Role } from "../../features/auth/types/auth.types";

export function RoleGuard({
  allowed,
  children,
}: {
  allowed: Role[];
  children: ReactNode;
}) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowed)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
