import type { Client } from "@/shared/models/Client";
import type { ApiResponse } from "../../../shared/models/Response";
import { lendingApi } from "@/shared/services/api";


export const getClients = async (): Promise<Client[]> => {
  const response = await lendingApi.get<ApiResponse<Client[]>>("/api/v1/client/all");
  return response.data.data;
};

export const getClientById = async (id: string): Promise<Client> => {
  const response = await lendingApi.get<ApiResponse<Client>>(`/api/v1/client/by-id/${id}`);
  return response.data.data;
};

export const createClient = async (data: FormData): Promise<Client> => {
  const response = await lendingApi.post<ApiResponse<Client>>( "/api/v1/client/create",data);
  return response.data.data;
};