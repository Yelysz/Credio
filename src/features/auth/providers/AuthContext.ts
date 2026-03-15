import { createContext } from 'react';
import type { AuthState, LoginRequest, Role } from '../types/auth.types';

export interface AuthContextType {
  state: AuthState;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasAnyRole: (roles: Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);