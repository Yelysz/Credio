import { lendingApi } from "@/shared/services/api";
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  GetClientsParams,
  UpdateClientPayload,
} from "../types/client.types";

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
    const { data } = await lendingApi.get<Client[]>("/api/v1/client/all", {
      params,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await lendingApi.get<ClientDetail>(`/api/v1/client/by-id/${id}`);
    return data;
  },

  async getByDocument(documentNumber: string) {
    const { data } = await lendingApi.get<Client>(
      `/api/v1/client/by-document/${documentNumber}`
    );
    return data;
  },

  async create(payload: CreateClientPayload) {
    const formData = buildClientFormData(payload);

    const { data } = await lendingApi.post("/api/v1/client/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async update(clientId: string, payload: UpdateClientPayload) {
    const { data } = await lendingApi.put(
      `/api/v1/client/update/${clientId}`,
      payload
    );
    return data;
  },

  async remove(clientId: string) {
    const { data } = await lendingApi.delete(`/api/v1/client/delete/${clientId}`);
    return data;
  },
};