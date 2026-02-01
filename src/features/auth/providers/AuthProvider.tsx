import { useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState, LoginRequest, Role } from "../types/auth.types";
import { mockAuthService } from "../services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });

  const login = useCallback(async (data: LoginRequest) => {
    const res = await mockAuthService.login(data);
    setState({ user: res.user, token: res.token });
  }, []);

  const logout = useCallback(async () => {
    await mockAuthService.logout();
    setState({ user: null, token: null });
  }, []);

  const hasAnyRole = useCallback(
    (roles: Role[]) => {
      const user = state.user;
      if (!user) return false;
      return roles.some((r) => user.roles.includes(r));
    },
    [state.user]
  );

  const value = {
    state,
    isAuthenticated: !!state.user,
    hasAnyRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
