import { lendingApi } from "@/shared/services/api";
import type {
  SystemSetting,
  UpdateSystemSettingPayload,
} from "../types/settings.types";

interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}


//await lendingApi.get("/api/v1/settings/all", {
  params: { documentNumber: "00112345678" }
//});

export const settingsService = {
  async getAll() {
    const response = await lendingApi.get<ApiResponse<SystemSetting[]>>(
      "/api/v1/settings/all"
    );

    return response.data.data;
  },

  async update(payload: UpdateSystemSettingPayload) {
    const response = await lendingApi.put<ApiResponse<SystemSetting>>(
      "/api/v1/settings",
      payload
    );

    return response.data.data;
  },
};