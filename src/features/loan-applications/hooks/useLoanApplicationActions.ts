import { useState } from "react";
import axios from "axios";
import { loanService } from "../../loans/services/loan.service";
import type {
  CreateLoanPayload,
  DisburseLoanPayload,
  Loan,
} from "../../loans/types/loan.types";
import type {
  CreateLoanApplicationPayload,
  LoanApplication,
} from "../../loan-applications/types/loanApplication.types";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.title ||
      error.message ||
      "Ocurrió un error en la solicitud."
    );
  }

  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado.";
}

export function useLoanActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoanApplication = async (
    payload: CreateLoanApplicationPayload
  ): Promise<LoanApplication | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await loanService.createLoanApplication(payload);
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const createLoan = async (payload: CreateLoanPayload): Promise<Loan | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await loanService.createLoan(payload);
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const disburseLoan = async (payload: DisburseLoanPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await loanService.disburseLoan(payload);
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createLoanApplication,
    createLoan,
    disburseLoan,
    isSubmitting,
    error,
  };
}