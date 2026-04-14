import axios from "axios";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  errors?: Array<{
    errorCode?: string;
    description?: string;
    type?: number;
  }>;
};

export const getApiErrorMessages = (
  error: unknown,
  fallback = "Ocurrió un error"
): string[] => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors && Array.isArray(data.errors)) {
      const messages = data.errors
        .map((item) => item.description?.trim())
        .filter((msg): msg is string => Boolean(msg));

      if (messages.length > 0) {
        return messages;
      }
    }

    if (data?.detail) return [data.detail];
    if (data?.message) return [data.message];
    if (error.message) return [error.message];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return [fallback];
};