export type Role = "ADMIN" | "OFFICER" | "COLLECTOR" | "CLIENT";

export interface AuthUser {
  id: string;
  fullName: string;
  roles: Role[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

/** Request*/
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response*/
export interface LoginResponse {
  token: string;
  user: AuthUser;
}