import { useCallback, useState } from "react";
import { loanService } from "../services/loan.service";
import type { Loan, LoanScheduleResponse } from "../types/loan.types";

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (err as {
      response?: {
        data?: {
          detail?: string;
          title?: string;
          message?: string;
          errors?: Array<{ description?: string }>;
        };
      };
    }).response;

    return (
      response?.data?.errors?.[0]?.description ||
      response?.data?.detail ||
      response?.data?.title ||
      response?.data?.message ||
      fallback
    );
  }

  if (err instanceof Error) return err.message;
  return fallback;
};

export const useLoanDisbursement = () => {
  const [schedule, setSchedule] = useState<LoanScheduleResponse | null>(null);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoan = async (
    loanApplicationId: string,
    firstPaymentDate: string,
    amortizationMethodId = ""
  ) => {
    setIsDisbursing(true);
    setError(null);

    try {
      const loanData = await loanService.createLoan({
        loanApplicationId,
        amortizationMethodId,
        firstPaymentDate,
      });

      setLoan(loanData);
      return loanData;
    } catch (err) {
      const message = getErrorMessage(err, "Error al crear el préstamo");
      setError(message);
      throw err;
    } finally {
      setIsDisbursing(false);
    }
  };

  const disburseLoan = async (loanId: string, effectiveDate: string) => {
    setIsDisbursing(true);
    setError(null);

    try {
      const result = await loanService.disburseLoan({
        loanId,
        effectiveDate,
      });

      return result;
    } catch (err) {
      const message = getErrorMessage(err, "Error al desembolsar el préstamo");
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
      const message = getErrorMessage(err, "Error al cargar el calendario");
      setError(message);
      throw err;
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const resetLoanFlow = useCallback(() => {
    setSchedule(null);
    setLoan(null);
    setError(null);
  }, []);

  return {
    schedule,
    loan,
    isLoadingSchedule,
    isDisbursing,
    error,
    createLoan,
    disburseLoan,
    fetchSchedule,
    resetLoanFlow,
  };
};