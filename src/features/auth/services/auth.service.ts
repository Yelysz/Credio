// auth.service.ts
import api from "@/shared/services/api";
import type {
  AuthResponse,
  LoginRequest,
  ResetPasswordRequest,
  ConfirmCodeRequest,
  ChangePasswordRequest,
} from "../types/auth.types";

const BASE_PATH = "/api/v1/account";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(`${BASE_PATH}/login`, credentials);

    const token = data.data?.jwToken?.trim();

    if (!token || token.split(".").length !== 3) {
      throw new Error("El token recibido no es un JWT válido.");
    }

    localStorage.setItem("auth_token", token);

    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.get(`${BASE_PATH}/logout`);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("remember_userName");
    }
  },

  refreshAccessToken: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>(`${BASE_PATH}/refresh-access-token`);

    const token = data.data?.jwToken?.trim();

    if (token) {
      localStorage.setItem("auth_token", token);
    }

    return data;
  },

  validateRefreshToken: async () => {
    const { data } = await api.get(`${BASE_PATH}/validate-refresh-token`);
    return data;
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    const { data } = await api.post(`${BASE_PATH}/reset-password`, payload);
    return data;
  },

  confirmCode: async (payload: ConfirmCodeRequest) => {
    const { data } = await api.post(`${BASE_PATH}/confirm-code`, payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const { data } = await api.post(`${BASE_PATH}/change-password`, payload);
    return data;
  },
};