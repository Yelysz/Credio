import { createContext } from "react";
import type { AuthState, LoginRequest, Role } from "../types/auth.types";

export interface AuthContextType {
  state: AuthState;
  isAuthenticated: boolean;
  hasAnyRole: (roles: Role[]) => boolean;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
