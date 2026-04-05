export interface Employee {
  id: string;
  employeeCode?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface EmployeeDetail extends Employee {
  documentNumber?: string;
  documentType?: string;
  address?: string;
}

export interface GetEmployeesParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface RegisterEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  role?: string;
  password?: string;
  file?: File | null;
}