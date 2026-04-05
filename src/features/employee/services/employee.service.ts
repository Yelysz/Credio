import { lendingApi } from "@/shared/services/api";
import type {
  Employee,
  EmployeeDetail,
  GetEmployeesParams,
  RegisterEmployeePayload,
} from "../types/employee.types";

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
    const { data } = await lendingApi.get<Employee[]>("/api/v1/employee/all", {
      params,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await lendingApi.get<EmployeeDetail>(`/api/v1/employee/by-id/${id}`);
    return data;
  },

  async getByCode(employeeCode: string) {
    const { data } = await lendingApi.get<EmployeeDetail>(
      `/api/v1/employee/by-code/${employeeCode}`
    );
    return data;
  },

  async register(payload: RegisterEmployeePayload) {
    const formData = buildFormData(payload);

    const { data } = await lendingApi.post("/api/v1/employee/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};