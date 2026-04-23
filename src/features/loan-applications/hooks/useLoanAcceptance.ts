import { useCallback, useEffect, useState } from "react";
import { loanAcceptanceService } from "../services/loanAcceptance.service";
import type {
  ApproveLoanApplicationPayload,
  LoanApplicationDetail,
  LoanApplicationItem,
} from "../types/loanAcceptance.types";

export const useLoanAcceptance = () => {
  const [applications, setApplications] = useState<LoanApplicationItem[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loanAcceptanceService.getPending();
      setApplications(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar las solicitudes pendientes";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchApproved = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loanAcceptanceService.getApproved();
      setApplications(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar las solicitudes aprobadas";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      setError(null);
      const data = await loanAcceptanceService.getById(id);
      setSelectedApplication(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el detalle";
      setError(message);
      throw err;
    }
  }, []);

  const approve = useCallback(
    async (id: string, payload: ApproveLoanApplicationPayload) => {
      try {
        setIsApproving(true);
        setError(null);
        await loanAcceptanceService.approve(id, payload);
        await fetchPending();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al aprobar la solicitud";
        setError(message);
        throw err;
      } finally {
        setIsApproving(false);
      }
    },
    [fetchPending]
  );

  useEffect(() => {
    void fetchPending();
  }, [fetchPending]);

  return {
    applications,
    selectedApplication,
    isLoading,
    isApproving,
    error,
    fetchPending,
    fetchApproved,
    fetchDetail,
    approve,
    setSelectedApplication,
  };
};