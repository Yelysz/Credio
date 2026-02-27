import api from '@/shared/services/api';
import type { AuthResponse, LoginRequest } from '../types/auth.types';
import axios from 'axios';

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
  },

  logoutService: async (): Promise<void> => {
    try {
      await axios.get(`${BASE_PATH}/api/v1/account/logout`); 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

};