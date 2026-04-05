import { useState } from "react";
import { clientService } from "../services/client.service";
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client.types";

export const useClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (payload: CreateClientPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await clientService.create(payload);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el cliente.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateClient = async (clientId: string, payload: UpdateClientPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await clientService.update(clientId, payload);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el cliente.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await clientService.remove(clientId);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el cliente.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
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