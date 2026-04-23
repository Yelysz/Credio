import { useState } from "react";
import { loanService } from "../services/loan.service";
import type {
  Installment,
  Loan,
  LoanScheduleResponse,
} from "../types/loan.types";

export const useLoanDisbursement = () => {
  const [preview, setPreview] = useState<Installment[] | null>(null);
  const [schedule, setSchedule] = useState<LoanScheduleResponse | null>(null);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async (applicationId: string) => {
    setIsLoadingPreview(true);
    setError(null);

    try {
      const data = await loanService.previewAmortization({ applicationId });
      setPreview(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar la previsualización";
      setError(message);
      throw err;
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const createLoan = async (loanApplicationId: string) => {
    setIsDisbursing(true);
    setError(null);

    try {
      const loanData = await loanService.createLoan({
        applicationId: loanApplicationId,
      });
      setLoan(loanData);
      return loanData;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear el préstamo";
      setError(message);
      throw err;
    } finally {
      setIsDisbursing(false);
    }
  };

  const disburseLoan = async (loanId: string, disbursementDate?: string) => {
    setIsDisbursing(true);
    setError(null);

    try {
      const result = await loanService.disburseLoan({
        loanId,
        ...(disbursementDate ? { disbursementDate } : {}),
      });
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al desembolsar el préstamo";
      setError(message);
      throw err;
    } finally {
      setIsDisbursing(false);
    }
  };

  const fetchSchedule = async (loanId: string) => {
    setIsLoadingSchedule(true);
    setError(null);

    try {
      const data = await loanService.getSchedule(loanId);
      setSchedule(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el calendario";
      setError(message);
      throw err;
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  return {
    preview,
    schedule,
    loan,
    isLoadingPreview,
    isLoadingSchedule,
    isDisbursing,
    error,
    fetchPreview,
    createLoan,
    disburseLoan,
    fetchSchedule,
  };
};