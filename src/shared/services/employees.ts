import { lendingApi } from "./api";
import type { Employee } from "../models/Employee";

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  email: string;
  role: string;
  address: {
    streetNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
  };
  image?: File | null;
}

export const getEmployees = async (
  pageNumber = 1,
  pageSize = 10
): Promise<PaginatedResponse<Employee>> => {
  const response = await lendingApi.get("/api/v1/employee/all", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  const raw = response.data;

  const data = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.records)
    ? raw.records
    : [];

  const totalRecords = Number(
    raw?.totalRecords ?? raw?.totalCount ?? data.length ?? 0
  );

  const totalPages =
    Number(raw?.totalPages) ||
    Math.max(1, Math.ceil(totalRecords / Number(raw?.pageSize ?? pageSize)));

  const currentPage = Number(raw?.pageNumber ?? pageNumber);
  const currentPageSize = Number(raw?.pageSize ?? pageSize);

  return {
    data,
    pageNumber: currentPage,
    pageSize: currentPageSize,
    totalRecords,
    totalPages,
    hasPreviousPage:
      raw?.hasPreviousPage !== undefined
        ? Boolean(raw.hasPreviousPage)
        : currentPage > 1,
    hasNextPage:
      raw?.hasNextPage !== undefined
        ? Boolean(raw.hasNextPage)
        : data.length === currentPageSize,
  };
};

export const createEmployee = async (payload: CreateEmployeePayload) => {
  const formData = new FormData();

  formData.append("FirstName", payload.firstName.trim());
  formData.append("LastName", payload.lastName.trim());
  formData.append("DocumentType", payload.documentType.trim());
  formData.append("DocumentNumber", payload.documentNumber.trim());
  formData.append("Phone", payload.phone.trim());
  formData.append("Email", payload.email.trim());
  formData.append("Role", payload.role.trim());

  formData.append("Address.StreetNumber", payload.address.streetNumber.trim());
  formData.append("Address.AddressLine1", payload.address.addressLine1.trim());
  formData.append("Address.AddressLine2", payload.address.addressLine2.trim());
  formData.append("Address.City", payload.address.city.trim());
  formData.append("Address.Region", payload.address.region.trim());
  formData.append("Address.PostalCode", payload.address.postalCode.trim());

  if (payload.image) {
    formData.append("Image", payload.image);
  }

  for (const [key, value] of formData.entries()) {
    console.log("FormData =>", key, value);
  }

  const response = await lendingApi.post("/api/v1/employee/register", formData);

  return response.data;
};