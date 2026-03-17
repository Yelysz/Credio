import api from "@/shared/services/api";
import type { AuthResponse, LoginRequest } from "../types/auth.types";

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
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  },

  refreshAccessToken: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>(`${BASE_PATH}/refresh-access-token`);
    return data;
  },
};