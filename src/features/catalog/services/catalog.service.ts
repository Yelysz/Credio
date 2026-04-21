import { lendingApi } from "@/shared/services/api";

interface ApiResponse<T> {
  detail?: string;
  type?: string;
  statusCode?: number;
  data: T;
}

export interface CatalogOption {
  id: string;
  name: string;
}

export const catalogService = {
  async getDocumentTypes(): Promise<CatalogOption[]> {
    const { data } = await lendingApi.get<ApiResponse<CatalogOption[]>>(
      "/api/v1/catalog/document-types"
    );

    return data.data ?? [];
  },
};