import { lendingApi } from "@/shared/services/api";
import type {
  ApproveLoanApplicationPayload,
  LoanApplicationDetail,
  LoanApplicationItem,
  LoanSimulationResponse,
} from "../types/loanAcceptance.types";

type ApiEnvelope<T> = {
  data?: T;
  detail?: string;
  statusCode?: number;
};

const unwrap = <T>(response: { data: T | ApiEnvelope<T> }): T => {
  const payload = response.data as T | ApiEnvelope<T>;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

const normalizeStatus = (value?: string | null) =>
  String(value ?? "").trim().toLowerCase();

export interface SimulateLoanPayload {
  amount: number;
  term: number;
  interestRate: number;
  paymentFrequencyId: string;
}

export const loanAcceptanceService = {
  async getAll() {
    const response = await lendingApi.get<
      ApiEnvelope<LoanApplicationItem[]> | LoanApplicationItem[]
    >("/api/v1/loan-application/all");

    const data = unwrap<LoanApplicationItem[]>(response);
    return Array.isArray(data) ? data : [];
  },

  async getPending() {
    const list = await this.getAll();

    return list.filter((item) => {
      const status = normalizeStatus(item.applicationStatusName);
      return status === "pending" || status === "pendiente";
    });
  },

  async getApproved() {
    const list = await this.getAll();

    return list.filter((item) => {
      const status = normalizeStatus(item.applicationStatusName);
      return (
        status === "approved" ||
        status === "aprobado" ||
        status.includes("aprob")
      );
    });
  },

  async getById(id: string) {
    const response = await lendingApi.get<
      ApiEnvelope<LoanApplicationDetail> | LoanApplicationDetail
    >(`/api/v1/loan-application/by-id/${id}`);

    return unwrap<LoanApplicationDetail>(response);
  },

  async approve(id: string, payload: ApproveLoanApplicationPayload) {
    await lendingApi.put(`/api/v1/loan-application/approve/${id}`, payload);
  },

  async simulate(payload: SimulateLoanPayload) {
    const response = await lendingApi.get<
      ApiEnvelope<LoanSimulationResponse> | LoanSimulationResponse
    >("/api/v1/loan-application/simulate", {
      params: {
        amount: payload.amount,
        term: payload.term,
        interestRate: payload.interestRate,
        paymentFrequencyId: payload.paymentFrequencyId,
      },
    });

    return unwrap<LoanSimulationResponse>(response);
  },
};