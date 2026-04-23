import { lendingApi } from "@/shared/services/api";
import type {
  CreateLoanPayload,
  DisburseLoanPayload,
  Installment,
  Loan,
  LoanScheduleResponse,
  PreviewAmortizationParams,
} from "../types/loan.types";

type ApiEnvelope<T> = {
  detail?: string;
  type?: string;
  statusCode?: number;
  data?: T;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

export const loanService = {
  async previewAmortization(params: PreviewAmortizationParams) {
    const response = await lendingApi.get<
      ApiEnvelope<Installment[]> | Installment[]
    >("/api/v1/loan/preview-amortization", {
      params,
    });

    return unwrap<Installment[]>(response.data);
  },

  async createLoan(payload: CreateLoanPayload) {
    const response = await lendingApi.post<ApiEnvelope<Loan> | Loan>(
      "/api/v1/loan/create",
      payload
    );

    return unwrap<Loan>(response.data);
  },

  async disburseLoan(payload: DisburseLoanPayload) {
    const response = await lendingApi.post("/api/v1/loan/disburse", payload);
    return unwrap(response.data);
  },

  async getSchedule(loanId: string) {
    const response = await lendingApi.get<
      ApiEnvelope<LoanScheduleResponse> | LoanScheduleResponse
    >(`/api/v1/loan/${loanId}/schedule`);

    return unwrap<LoanScheduleResponse>(response.data);
  },
};