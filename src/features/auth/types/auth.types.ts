// auth.types.ts
export const Roles = {
  Administrator: "Administrator",
  Client: "Client",
  Collector: "Collector",
  Officer: "Officer",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmCodeRequest {
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  data: {
    expiresAt: string;
    expiresIn: string;
    jwToken: string;
    refreshExpiresAt: string;
    refreshExpiresIn: string;
    refreshToken: string;
  };
  detail: string;
  statusCode: number;
  type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}