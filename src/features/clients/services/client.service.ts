import { lendingApi } from "@/shared/services/api";
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  GetClientsParams,
  UpdateClientPayload,
} from "../types/client.types";

interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}

const buildClientFormData = (payload: CreateClientPayload): FormData => {
  const formData = new FormData();

  formData.append("FirstName", payload.firstName.trim());
  formData.append("LastName", payload.lastName.trim());
  formData.append("Age", String(payload.age));
  formData.append("Email", payload.email.trim());
  formData.append("DocumentType", payload.documentType.trim());
  formData.append("Phone", payload.phone.trim());
  formData.append("DocumentNumber", payload.documentNumber.trim());
  formData.append("EmployeeId", payload.employeeId);
  formData.append("HomeLatitude", String(payload.homeLatitude));
  formData.append("HomeLongitude", String(payload.homeLongitude));

  formData.append("AddressDto.StreetNumber", payload.addressDto.streetNumber.trim());
  formData.append("AddressDto.AddressLine1", payload.addressDto.addressLine1.trim());
  formData.append("AddressDto.AddressLine2", payload.addressDto.addressLine2.trim());
  formData.append("AddressDto.City", payload.addressDto.city.trim());
  formData.append("AddressDto.Region", payload.addressDto.region.trim());
  formData.append("AddressDto.PostalCode", payload.addressDto.postalCode.trim());

  if (payload.file) {
    formData.append("Image", payload.file);
  }

  return formData;
};

export const clientService = {
  async getAll(params?: GetClientsParams): Promise<Client[]> {
    const response = await lendingApi.get<ApiResponse<Client[]>>(
      "/api/v1/client/all",
      { params }
    );

    return response.data.data;
  },

  async getById(id: string): Promise<ClientDetail> {
    const response = await lendingApi.get<ApiResponse<ClientDetail>>(
      `/api/v1/client/by-id/${id}`
    );

    return response.data.data;
  },

  async getByDocument(documentNumber: string): Promise<Client> {
    const response = await lendingApi.get<ApiResponse<Client>>(
      `/api/v1/client/by-document/${documentNumber}`
    );

    return response.data.data;
  },

  async create(payload: CreateClientPayload): Promise<unknown> {
    const formData = buildClientFormData(payload);

    for (const [key, value] of formData.entries()) {
      console.log("CLIENT FORMDATA:", key, value);
    }

    const response = await lendingApi.post<ApiResponse<unknown>>(
      "/api/v1/client/create",
      formData
    );

    return response.data.data;
  },

  async update(clientId: string, payload: UpdateClientPayload): Promise<void> {
    await lendingApi.put(`/api/v1/client/update/${clientId}`, payload);
  },

  async remove(clientId: string): Promise<void> {
    await lendingApi.delete(`/api/v1/client/delete/${clientId}`);
  },
};