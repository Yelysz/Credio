import type { LoginRequest, LoginResponse } from "../types/auth.types";

export interface AuthService {
  login: (data: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export const mockAuthService: AuthService = {
  async login(data) {

    await new Promise((r) => setTimeout(r, 500));

    const roleByEmail =
      data.email.includes("admin") ? (["ADMIN"] as const) :
      data.email.includes("officer") ? (["OFFICER"] as const) :
      data.email.includes("collector") ? (["COLLECTOR"] as const) :
      (["CLIENT"] as const);

    return {
      token: "mock-token-123",
      user: {
        id: "1",
        fullName: "Anyelys Torres",
        roles: [...roleByEmail],
      },
    };
  },

  async logout() {
    await Promise.resolve();
  },
};
