import { useState } from "react";
import { loanService } from "../services/loan.service";
import type { Installment, PreviewAmortizationParams } from "../types/loan.types";

export const useLoanPreview = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = async (params: PreviewAmortizationParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loanService.previewAmortization(params);
      setInstallments(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error(err);
      setError("No se pudo generar la previsualización.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    installments,
    isLoading,
    error,
    preview,
  };
};