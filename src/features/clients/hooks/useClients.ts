import { useCallback, useEffect, useState } from "react";
import { clientService } from "../services/client.service";
import type { Client, GetClientsParams } from "../types/client.types";

export const useClients = (initialParams?: GetClientsParams) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [params, setParams] = useState<GetClientsParams>({
    pageNumber: 1,
    pageSize: 10,
    ...initialParams,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await clientService.getAll(params);
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchClients,
    setClients,
  };
};