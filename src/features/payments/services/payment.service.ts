import { lendingApi } from "@/shared/services/api";
import type {
  LoanScheduleResponse,
  RegisterPaymentForm,
  RegisterPaymentResponse,
  UpcomingInstallment,
} from "../types/payment.types";

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

export const paymentService = {
  async getUpcomingInstallments() {
    const response = await lendingApi.get<
      ApiEnvelope<UpcomingInstallment[]> | UpcomingInstallment[]
    >("/api/v1/dashboard/upcoming-installments");

    const data = unwrap<UpcomingInstallment[]>(response);
    return Array.isArray(data) ? data : [];
  },

  async getLoanSchedule(loanId: string) {
    const response = await lendingApi.get<
      ApiEnvelope<LoanScheduleResponse> | LoanScheduleResponse
    >(`/api/v1/loan/${loanId}/schedule`);

    return unwrap<LoanScheduleResponse>(response);
  },

  async registerPayment(payload: RegisterPaymentForm) {
    const body = {
      loanId: payload.loanId,
      collectorCode: payload.collectorCode,
      amountPaid: payload.amountPaid,
      paymentMethodId: payload.paymentMethodId,
      gpsLatitude: payload.latitude,
      gpsLongitude: payload.longitude,
    };

    const response = await lendingApi.post<
      ApiEnvelope<RegisterPaymentResponse> | RegisterPaymentResponse
    >("/api/v1/payments/register", body);

    return unwrap<RegisterPaymentResponse>(response);
  },
};