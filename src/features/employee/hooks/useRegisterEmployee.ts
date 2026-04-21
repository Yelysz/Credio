import { useState } from "react";
import axios from "axios";
import { employeeService } from "../services/employee.service";

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

interface ApiErrorResponse {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export function useRegisterEmployee() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerEmployee = async (
    payload: RegisterEmployeePayload
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);

      await employeeService.register(payload);
      return true;
    } catch (err: unknown) {
      console.error("Register employee error:", err);

      let apiError = "No se pudo registrar el empleado.";

      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        const responseData = err.response?.data;

        apiError =
          responseData?.detail ||
          responseData?.errors?.DocumentType?.[0] ||
          responseData?.errors?.documentType?.[0] ||
          responseData?.errors?.Role?.[0] ||
          responseData?.errors?.role?.[0] ||
          responseData?.errors?.Address?.[0] ||
          responseData?.errors?.address?.[0] ||
          responseData?.title ||
          apiError;
      } else if (err instanceof Error && err.message) {
        apiError = err.message;
      }

      setError(apiError);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerEmployee,
    isSubmitting,
    error,
  };
}