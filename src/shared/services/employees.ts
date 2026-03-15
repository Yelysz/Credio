import type { Employee } from "../models/Employee";
import type { ApiResponse } from "../models/Response";
import { api } from "./api";

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>("/api/v1/employee/all");
  return response.data.data;
};