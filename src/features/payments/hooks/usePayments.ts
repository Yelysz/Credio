import { useCallback, useEffect, useState } from "react";
import { paymentService } from "../services/payment.service";
import type {
  LoanScheduleResponse,
  RegisterPaymentForm,
  RegisterPaymentResponse,
  UpcomingInstallment,
} from "../types/payment.types";

export function usePayments() {
  const [installments, setInstallments] = useState<UpcomingInstallment[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanScheduleResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<RegisterPaymentResponse | null>(null);

  const fetchUpcomingInstallments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await paymentService.getUpcomingInstallments();
      setInstallments(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las cuotas próximas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLoanSchedule = useCallback(async (loanId: string) => {
    try {
      setIsScheduleLoading(true);
      setError(null);
      setPaymentResult(null);
      const data = await paymentService.getLoanSchedule(loanId);
      setSelectedLoan(data);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el calendario de pagos del préstamo.");
    } finally {
      setIsScheduleLoading(false);
    }
  }, []);

  const registerPayment = useCallback(async (payload: RegisterPaymentForm) => {
    try {
      setIsRegistering(true);
      setError(null);
      setPaymentResult(null);

      const response = await paymentService.registerPayment(payload);
      setPaymentResult(response);

      await fetchLoanSchedule(payload.loanId);
      await fetchUpcomingInstallments();

      return response;
    } catch (error) {
      console.error(error);
      setError("No se pudo registrar el pago.");
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [fetchLoanSchedule, fetchUpcomingInstallments]);

  useEffect(() => {
    void fetchUpcomingInstallments();
  }, [fetchUpcomingInstallments]);

  return {
    installments,
    selectedLoan,
    isLoading,
    isScheduleLoading,
    isRegistering,
    error,
    paymentResult,
    fetchUpcomingInstallments,
    fetchLoanSchedule,
    registerPayment,
    setSelectedLoan,
  };
}