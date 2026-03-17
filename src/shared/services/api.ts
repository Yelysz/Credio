import axios from "axios";

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

const attachAuthInterceptor = (instance: ReturnType<typeof axios.create>) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    const url = config.url ?? "";

    const isPublic = publicEndpoints.some((endpoint) => url.includes(endpoint));

    if (token && config.headers && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const lendingApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_LENDING,
  headers: {
    "Content-Type": "application/json",
  },
});

attachAuthInterceptor(authApi);
attachAuthInterceptor(lendingApi);

// Mantén este export para no romper imports existentes que esperan `api`
export const api = authApi;
export default authApi;