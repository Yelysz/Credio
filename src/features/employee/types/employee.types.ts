export interface Employee {
  id: string;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  roleName?: string;
  status?: string;
  statusName?: string;
  createdAt?: string;
  avatarUrl?: string;
  documentNumber?: string;
  documentType?: string;
  addressId?: string;
  isActive?: boolean;

  [key: string]: unknown;
}



export interface EmployeeAddress {
  streetNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

export interface EmployeeDetail extends Employee {
  address?: EmployeeAddress;
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
  documentType?: string;
  role?: string;
  file?: File | null;
  address?: {
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
  };
}

export interface RegisterEmployeeResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  documentType?: string; 
  role?: string;
  password?: string;
  file?: File | null;
}