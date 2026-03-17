import type { Client } from "@/shared/models/Client";
import type { ApiResponse } from "../../../shared/models/Response";
import { api } from "../../../shared/services/api";

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get<ApiResponse<Client[]>>("/api/v1/client/all");
  return response.data.data;
};