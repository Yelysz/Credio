// AuthProvider.tsx
import { useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/auth.service";
import type { AuthState, LoginRequest, Role, AuthResponse } from "../types/auth.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: false,
  });

  const login = async (credentials: LoginRequest, rememberMe?: boolean) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response: AuthResponse = await authService.login(credentials);
      const token = response.data.jwToken;

      localStorage.setItem("auth_token", token);

      if (rememberMe) {
        localStorage.setItem("remember_userName", credentials.userName);
      } else {
        localStorage.removeItem("remember_userName");
      }

      setState((prev) => ({
        ...prev,
        token,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasAnyRole = useCallback((roles: Role[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  const value = useMemo(
    () => ({
      state,
      isAuthenticated: state.isAuthenticated,
      login,
      logout,
      hasAnyRole,
    }),
    [state, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};