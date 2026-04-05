import { useState } from "react";
import { loanApplicationService } from "../services/loanApplication.service";
import type {
  SimulationParams,
  SimulationResponse,
} from "../types/loanApplication.types";

export const useLoanApplicationSimulation = () => {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = async (params: SimulationParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loanApplicationService.simulate(params);
      setResult(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("No se pudo generar la simulación.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    result,
    isLoading,
    error,
    simulate,
  };
};