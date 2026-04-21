import axios from "axios";
import { lendingApi } from "@/shared/services/api";
import type {
  Employee,
  EmployeeDetail,
  GetEmployeesParams,
  RegisterEmployeeResponse,
} from "../types/employee.types";

export interface RegisterEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  documentType: string;
  role: string;
  password: string;
  file: File | null;
  address: {
    streetNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
  };
}

type ApiResponse<T> = {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
};

const buildEmployeeFormData = (payload: RegisterEmployeePayload) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName?.trim() ?? "");
  formData.append("lastName", payload.lastName?.trim() ?? "");
  formData.append("email", payload.email?.trim() ?? "");
  formData.append("phone", payload.phone?.trim() ?? "");
  formData.append("documentNumber", payload.documentNumber?.trim() ?? "");
  formData.append("documentType", payload.documentType?.trim() ?? "");
  formData.append("role", payload.role?.trim() ?? "");

  formData.append("address.streetNumber", payload.address?.streetNumber?.trim() ?? "");
  formData.append("address.addressLine1", payload.address?.addressLine1?.trim() ?? "");
  formData.append("address.addressLine2", payload.address?.addressLine2?.trim() ?? "");
  formData.append("address.city", payload.address?.city?.trim() ?? "");
  formData.append("address.region", payload.address?.region?.trim() ?? "");
  formData.append("address.postalCode", payload.address?.postalCode?.trim() ?? "");

  if (payload.file) {
    formData.append("image", payload.file);
  }

  return formData;
};

export const employeeService = {
  async register(payload: RegisterEmployeePayload) {
    const formData = buildEmployeeFormData(payload);

    for (const [key, value] of formData.entries()) {
      console.log("FORMDATA:", key, value);
    }

    try {
      const response = await lendingApi.post<ApiResponse<RegisterEmployeeResponse>>(
        "/api/v1/employee/register",
        formData
      );

      console.log("REGISTER RESPONSE SUCCESS:", response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("REGISTER ERROR STATUS:", error.response?.status);
        console.log("REGISTER ERROR DATA:", error.response?.data);
        console.log("REGISTER ERROR HEADERS:", error.response?.headers);
      } else {
        console.log("REGISTER UNKNOWN ERROR:", error);
      }

      throw error;
    }
  },

  async getAll(params?: GetEmployeesParams) {
    const { data } = await lendingApi.get<ApiResponse<Employee[]>>(
      "/api/v1/employee/all",
      { params }
    );

    return data.data;
  },

  async getByCode(employeeCode: string) {
  const { data } = await lendingApi.get<ApiResponse<EmployeeDetail>>(
    `/api/v1/employee/by-code/${employeeCode}`
  );

  return data.data;
},

  async getById(id: string) {
    const { data } = await lendingApi.get<ApiResponse<EmployeeDetail>>(
      `/api/v1/employee/by-id/${id}`
    );

    return data.data;
  },
};