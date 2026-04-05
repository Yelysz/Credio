import { useCallback, useEffect, useState } from "react";
import { loanService } from "../services/loan.service";
import type { LoanScheduleResponse } from "../types/loan.types";

export const useLoanSchedule = (loanId?: string) => {
  const [schedule, setSchedule] = useState<LoanScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!loanId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await loanService.getSchedule(loanId);
      setSchedule(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el calendario del préstamo.");
    } finally {
      setIsLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    void fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
};