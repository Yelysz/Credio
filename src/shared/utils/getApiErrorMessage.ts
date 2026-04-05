import axios from "axios";

type ApiErrorResponse = {
  status?: string;
  details?: Array<{
    code?: string;
    message?: string;
  }>;
  message?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Ocurrió un error"
) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.details?.[0]?.message ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};