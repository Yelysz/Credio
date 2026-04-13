import axios, { type InternalAxiosRequestConfig } from "axios";

const publicEndpoints = [
  "/login",
  "/register-client",
  "/reset-password",
  "/confirm-code",
  "/confirm-email",
  "/thanks",
  "/refresh-access-token",
  "/validate-refresh-token",
];

const isPublicEndpoint = (url?: string) => {
  if (!url) return false;
  return publicEndpoints.some((endpoint) => url.includes(endpoint));
};

const attachAuthInterceptor = (instance: ReturnType<typeof axios.create>) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    const url = config.url ?? "";
    const isPublic = isPublicEndpoint(url);

    if (token && config.headers && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_AUTH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const lendingApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_LENDING,
  withCredentials: true,
});

attachAuthInterceptor(authApi);
attachAuthInterceptor(lendingApi);

export const api = authApi;
export default authApi;