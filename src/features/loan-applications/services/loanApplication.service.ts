import { lendingApi } from "@/shared/services/api";
import type {
  ApiResponse,
  ClientItem,
  CreateLoanApplicationPayload,
  PaymentFrequency,
  SimulateLoanApplicationParams,
  SimulationResult,
} from "../types/loanApplication.types";
import { getUserFromToken } from "@/shared/utils/auth";
import { employeeService } from "../../employee/services/employee.service";


const unwrapResponse = <T>(responseData: T | ApiResponse<T>): T => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as ApiResponse<T>).data;
  }

  return responseData as T;
};

export const loanApplicationService = {
  async getClients(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
  }) {
    const { data } = await lendingApi.get<ApiResponse<ClientItem[]> | ClientItem[]>(
      "/api/v1/client/all",
      { params }
    );

    return unwrapResponse<ClientItem[]>(data);
  },

  async getPaymentFrequencies() {
    const { data } = await lendingApi.get<
      ApiResponse<PaymentFrequency[]> | PaymentFrequency[]
    >("/api/v1/catalog/payment-frequencies");

    return unwrapResponse<PaymentFrequency[]>(data);
  },

  async simulate(params: SimulateLoanApplicationParams) {
    const finalParams = {
      amount: params.requestedAmount,
      term: params.requestTerm,
      interestRate: params.requestedInterestRate,
      paymentFrequencyId: params.paymentFrequencyId,
    };

    const { data } = await lendingApi.get<
      ApiResponse<SimulationResult> | SimulationResult
    >("/api/v1/loan-application/simulate", {
      params: finalParams,
    });

    return unwrapResponse<SimulationResult>(data);
  },

async create(payload: CreateLoanApplicationPayload) {
  // 🔥 1. obtener usuario logueado
  const currentUser = getUserFromToken();

  if (!currentUser?.email) {
    throw new Error("No se pudo obtener el usuario autenticado.");
  }

  // 🔥 2. buscar el empleado real en el backend
  const employees = await employeeService.getAll({
    pageNumber: 1,
    pageSize: 1000,
  });

  const employee = employees.find(
    (item) =>
      item.email?.trim().toLowerCase() ===
      currentUser.email.trim().toLowerCase()
  );

  if (!employee || !employee.id) {
    console.error("USER:", currentUser);
    console.error("EMPLOYEES:", employees);

    throw new Error("No se encontró el empleado asociado al usuario.");
  }

  const finalPayload = {
    requestedAmount: payload.requestedAmount,
    requestedInterestRate: payload.requestedInterestRate,
    requestedTerm: payload.requestedTerm,
    clientId: payload.clientId,
    employeeId: employee.id, // ✅ FIX AQUÍ
    paymentFrequencyId: payload.paymentFrequencyId,
  };

  console.log("FINAL PAYLOAD:", finalPayload);

  const { data } = await lendingApi.post(
    "/api/v1/loan-application/create",
    finalPayload
  );

  return unwrapResponse(data);
}
};