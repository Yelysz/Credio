import { useCallback, useEffect, useState } from "react";
import { employeeService } from "../services/employee.service";
import type { Employee, GetEmployeesParams } from "../types/employee.types";

export const useEmployees = (initialParams?: GetEmployeesParams) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [params, setParams] = useState<GetEmployeesParams>({
    pageNumber: 1,
    pageSize: 10,
    ...initialParams,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await employeeService.getAll(params);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los empleados.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchEmployees,
  };
};