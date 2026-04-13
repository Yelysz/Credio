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

const buildClientFormData = (payload: CreateClientPayload) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);

  if (payload.email) formData.append("email", payload.email);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.documentNumber) formData.append("documentNumber", payload.documentNumber);
  if (payload.documentType) formData.append("documentType", payload.documentType);
  if (payload.address) formData.append("address", payload.address);
  if (payload.file) formData.append("file", payload.file);

  return formData;
};

export const clientService = {
  async getAll(params?: GetClientsParams) {
    const response = await lendingApi.get<ApiResponse<Client[]>>(
      "/api/v1/client/all",
      { params }
    );

    return response.data.data;
  },

  async getById(id: string) {
    const response = await lendingApi.get<ApiResponse<ClientDetail>>(
      `/api/v1/client/by-id/${id}`
    );

    return response.data.data;
  },

  async getByDocument(documentNumber: string) {
    const response = await lendingApi.get<ApiResponse<Client>>(
      `/api/v1/client/by-document/${documentNumber}`
    );

    return response.data.data;
  },

  async create(payload: CreateClientPayload) {
    const formData = buildClientFormData(payload);

    const response = await lendingApi.post<ApiResponse<unknown>>(
      "/api/v1/client/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  },

  async update(clientId: string, payload: UpdateClientPayload) {
    await lendingApi.put(`/api/v1/client/update/${clientId}`, payload);
    return;
  },

  async remove(clientId: string) {
    await lendingApi.delete(`/api/v1/client/delete/${clientId}`);
    return;
  },
};