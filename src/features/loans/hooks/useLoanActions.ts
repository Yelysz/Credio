import { useState } from "react";
import { loanService } from "../services/loan.service";
import type { CreateLoanPayload, DisburseLoanPayload } from "../types/loan.types";

export const useLoanActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoan = async (payload: CreateLoanPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await loanService.createLoan(payload);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el préstamo.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const disburseLoan = async (payload: DisburseLoanPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await loanService.disburseLoan(payload);
    } catch (err) {
      console.error(err);
      setError("No se pudo desembolsar el préstamo.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createLoan,
    disburseLoan,
    isSubmitting,
    error,
  };
};