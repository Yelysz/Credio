import { lendingApi } from "@/shared/services/api";
import type {
  Employee,
  EmployeeDetail,
  GetEmployeesParams,
  RegisterEmployeePayload,
} from "../types/employee.types";

interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}

const buildFormData = (payload: RegisterEmployeePayload) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);

  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.documentNumber) formData.append("documentNumber", payload.documentNumber);
  if (payload.role) formData.append("role", payload.role);
  if (payload.password) formData.append("password", payload.password);
  if (payload.file) formData.append("file", payload.file);

  return formData;
};

export const employeeService = {
  async getAll(params?: GetEmployeesParams) {
    const response = await lendingApi.get<ApiResponse<Employee[]>>(
      "/api/v1/employee/all",
      { params }
    );

    return response.data.data;
  },

  async getById(id: string) {
    const response = await lendingApi.get<ApiResponse<EmployeeDetail>>(
      `/api/v1/employee/by-id/${id}`
    );

    return response.data.data;
  },

  async getByCode(employeeCode: string) {
    const response = await lendingApi.get<ApiResponse<EmployeeDetail>>(
      `/api/v1/employee/by-code/${employeeCode}`
    );

    return response.data.data;
  },

  async register(payload: RegisterEmployeePayload) {
    const formData = buildFormData(payload);

    const response = await lendingApi.post<ApiResponse<unknown>>(
      "/api/v1/employee/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },
};