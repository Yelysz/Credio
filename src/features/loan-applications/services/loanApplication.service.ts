import { lendingApi } from "@/shared/services/api";
import type {
  LoanApplication,
  LoanApplicationDetail,
  LoanApplicationListParams,
  SimulationParams,
  SimulationResponse,
} from "../types/loanApplication.types";

export const loanApplicationService = {
  async getAll(params?: LoanApplicationListParams) {
    const { data } = await lendingApi.get<LoanApplication[]>(
      "/api/v1/loan-application/all",
      { params }
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await lendingApi.get<LoanApplicationDetail>(
      `/api/v1/loan-application/by-id/${id}`
    );
    return data;
  },

  async simulate(params: SimulationParams) {
    const { data } = await lendingApi.get<SimulationResponse>(
      "/api/v1/loan-application/simulate",
      { params }
    );
    return data;
  },
};