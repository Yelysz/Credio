import api from '@/shared/services/api';
import type { AuthResponse, LoginRequest } from '../types/auth.types';

const BASE_PATH = '/api/v1/account';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>(`${BASE_PATH}/login`, credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.get(`${BASE_PATH}/logout`);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  refreshAccessToken: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>(`${BASE_PATH}/refresh-access-token`);
    return data;
  }
};