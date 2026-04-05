import { useState } from "react";
import { employeeService } from "../services/employee.service";
import type { RegisterEmployeePayload } from "../types/employee.types";

export const useRegisterEmployee = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerEmployee = async (payload: RegisterEmployeePayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      return await employeeService.register(payload);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el empleado.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerEmployee,
    isSubmitting,
    error,
  };
};