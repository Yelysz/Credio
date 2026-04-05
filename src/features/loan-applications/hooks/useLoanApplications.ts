import { useCallback, useEffect, useState } from "react";
import { loanApplicationService } from "../services/loanApplication.service";
import type {
  LoanApplication,
  LoanApplicationListParams,
} from "../types/loanApplication.types";

export const useLoanApplications = (initialParams?: LoanApplicationListParams) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [params, setParams] = useState<LoanApplicationListParams>({
    pageNumber: 1,
    pageSize: 10,
    ...initialParams,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loanApplicationService.getAll(params);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchApplications,
  };
};