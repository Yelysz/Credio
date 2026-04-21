import { useState } from "react";
import axios from "axios";
import { clientService } from "../services/client.service";
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client.types";

interface ApiErrorResponse {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export const useClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiErrorMessage = (
    err: unknown,
    fallback: string
  ): string => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      const responseData = err.response?.data;

      return (
        responseData?.detail ||
        responseData?.errors?.AddressDto?.[0] ||
        responseData?.errors?.EmployeeId?.[0] ||
        responseData?.errors?.Age?.[0] ||
        responseData?.errors?.HomeLatitude?.[0] ||
        responseData?.errors?.HomeLongitude?.[0] ||
        responseData?.errors?.DocumentType?.[0] ||
        responseData?.errors?.DocumentNumber?.[0] ||
        responseData?.errors?.Email?.[0] ||
        responseData?.errors?.Phone?.[0] ||
        responseData?.errors?.FirstName?.[0] ||
        responseData?.errors?.LastName?.[0] ||
        responseData?.title ||
        fallback
      );
    }

    if (err instanceof Error && err.message) {
      return err.message;
    }

    return fallback;
  };

  const runAction = async <T>(
    action: () => Promise<T>,
    fallbackMessage: string
  ): Promise<T> => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await action();
    } catch (err: unknown) {
      console.error(err);
      const message = getApiErrorMessage(err, fallbackMessage);
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const createClient = async (payload: CreateClientPayload) => {
    return runAction(
      () => clientService.create(payload),
      "No se pudo crear el cliente."
    );
  };

  const updateClient = async (
    clientId: string,
    payload: UpdateClientPayload
  ) => {
    return runAction(
      () => clientService.update(clientId, payload),
      "No se pudo actualizar el cliente."
    );
  };

  const deleteClient = async (clientId: string) => {
    return runAction(
      () => clientService.remove(clientId),
      "No se pudo eliminar el cliente."
    );
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    isSubmitting,
    error,
    setError,
  };
};