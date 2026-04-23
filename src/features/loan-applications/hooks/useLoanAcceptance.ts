import { useCallback, useEffect, useState } from "react";
import { loanAcceptanceService } from "../services/loanAcceptance.service";
import type {
  ApproveLoanApplicationPayload,
  LoanApplicationDetail,
  LoanApplicationItem,
  LoanSimulationResponse,
} from "../types/loanAcceptance.types";

export function useLoanAcceptance() {
  const [applications, setApplications] = useState<LoanApplicationItem[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplicationDetail | null>(null);

  const [simulation, setSimulation] = useState<LoanSimulationResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loanAcceptanceService.getAll();
      setApplications(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    try {
      setIsDetailLoading(true);
      setError(null);
      setSimulation(null);
      const data = await loanAcceptanceService.getById(id);
      setSelectedApplication(data);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el detalle de la solicitud.");
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: string, payload: ApproveLoanApplicationPayload) => {
    try {
      setIsApproving(true);
      setError(null);

      await loanAcceptanceService.approve(id, payload);

      const detail = await loanAcceptanceService.getById(id);
      setSelectedApplication(detail);

      const list = await loanAcceptanceService.getAll();
      setApplications(list);
    } catch (error) {
      console.error(error);
      setError("No se pudo aprobar la solicitud.");
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, []);

  const simulate = useCallback(async () => {
    if (!selectedApplication) return;

    try {
      setIsSimulating(true);
      setError(null);

      const result = await loanAcceptanceService.simulate({
        amount: Number(selectedApplication.approvedAmount ?? selectedApplication.requestedAmount ?? 0),
        term: Number(selectedApplication.approvedTerm ?? selectedApplication.requestedTerm ?? 0),
        interestRate: Number(
          selectedApplication.approvedInterestRate ??
            selectedApplication.requestedInterestRate ??
            0
        ),
        paymentFrequencyId: String(selectedApplication.paymentFrequencyId ?? ""),
      });

      setSimulation(result);
      return result;
    } catch (error) {
      console.error(error);
      setError("No se pudo generar la simulación.");
      throw error;
    } finally {
      setIsSimulating(false);
    }
  }, [selectedApplication]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    applications,
    selectedApplication,
    simulation,
    isLoading,
    isDetailLoading,
    isApproving,
    isSimulating,
    error,
    fetchAll,
    fetchDetail,
    approve,
    simulate,
    setSelectedApplication,
  };
}