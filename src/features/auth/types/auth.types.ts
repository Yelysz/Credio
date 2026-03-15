
export const Roles = {
  SuperAdmin: 'SuperAdmin',
  Administrator: 'Administrator',
  Client: 'Client',
  Collector: 'Collector',
  Officer: 'Officer',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface LoginRequest {
  userName: string;     
  password: string;     
}


export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  jwToken: string; 
  expiresIn: string;
  expiresAt: string;
  refreshToken: string;
  refreshExpiresIn: string;
  refreshExpiresAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}