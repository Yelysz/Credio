import { lendingApi } from "@/shared/services/api";
import type { ApiResponse } from "@/shared/models/Response";
import {
  unwrapApiResponse,
} from "@/shared/models/Response";
import type {
  LoanApplication,
  LoanApplicationDetail,
  LoanApplicationListParams,
  SimulationParams,
  SimulationResponse,
} from "../types/loanApplication.types";

export const loanApplicationService = {
  async getAll(params?: LoanApplicationListParams) {
    const { data } = await lendingApi.get<ApiResponse<LoanApplication[]>>(
      "/api/v1/loan-application/all",
      { params }
    );

    return unwrapApiResponse(data) ?? [];
  },

  async getById(id: string) {
    const { data } = await lendingApi.get<ApiResponse<LoanApplicationDetail>>(
      `/api/v1/loan-application/by-id/${id}`
    );

    return unwrapApiResponse(data);
  },

  async simulate(params: SimulationParams) {
    const { data } = await lendingApi.get<ApiResponse<SimulationResponse>>(
      "/api/v1/loan-application/simulate",
      { params }
    );

    return unwrapApiResponse(data);
  },
};