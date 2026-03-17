import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const url = config.url ?? '';

  const publicEndpoints = [
    '/login',
    '/register-client',
    '/reset-password',
    '/confirm-code',
    '/confirm-email',
    '/thanks',
    '/refresh-access-token',
    '/validate-refresh-token'
  ];

  const isPublic = publicEndpoints.some((endpoint) =>
    url.includes(endpoint)
  );

  if (token && config.headers && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;