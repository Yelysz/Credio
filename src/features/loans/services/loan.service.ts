import { lendingApi } from "@/shared/services/api";
import type {
  CreateLoanPayload,
  DisburseLoanPayload,
  Installment,
  Loan,
  LoanScheduleResponse,
  PreviewAmortizationParams,
} from "../types/loan.types";

export const loanService = {
  async previewAmortization(params: PreviewAmortizationParams) {
    const { data } = await lendingApi.get<Installment[]>(
      "/api/v1/loan/preview-amortization",
      { params }
    );
    return data;
  },

  async createLoan(payload: CreateLoanPayload) {
    const { data } = await lendingApi.post<Loan>("/api/v1/loan/create", payload);
    return data;
  },

  async disburseLoan(payload: DisburseLoanPayload) {
    const { data } = await lendingApi.post("/api/v1/loan/disburse", payload);
    return data;
  },

  async getSchedule(loanId: string) {
    const { data } = await lendingApi.get<LoanScheduleResponse>(
      `/api/v1/loan/${loanId}/schedule`
    );
    return data;
  },
};