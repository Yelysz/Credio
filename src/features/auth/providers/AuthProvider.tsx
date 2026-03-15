import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from './AuthContext';
import { authService } from '../services/auth.service';
import type { AuthState, LoginRequest, Role, AuthResponse } from '../types/auth.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (credentials: LoginRequest) => {
    // Mapeamos el jwToken de la respuesta al estado
    const response: AuthResponse = await authService.login(credentials);
    const token = response.jwToken;
    
    localStorage.setItem('auth_token', token);
    
    // Aquí podrías decodificar el token para obtener el objeto User si tu API no lo envía
    setState(prev => ({ ...prev, token, isAuthenticated: true, isLoading: false }));
  };

  const hasAnyRole = useCallback((roles: Role[]) => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, isAuthenticated: state.isAuthenticated, login, logout: authService.logout, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
};