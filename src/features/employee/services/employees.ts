import type { Employee } from "../../../shared/models/Employee";
import type { ApiResponse } from "../../../shared/models/Response";
import { api } from "../../../shared/services/api";

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>("/api/v1/employee/all");
  return response.data.data;
};