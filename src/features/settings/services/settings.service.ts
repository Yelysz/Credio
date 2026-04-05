import { lendingApi } from "@/shared/services/api";
import type {
  SystemSetting,
  UpdateSystemSettingPayload,
} from "../types/settings.types";

export const settingsService = {
  async getAll() {
    const { data } = await lendingApi.get<SystemSetting[]>("/api/v1/settings/all");
    return data;
  },

  async update(payload: UpdateSystemSettingPayload) {
    const { data } = await lendingApi.put("/api/v1/settings", payload);
    return data;
  },
};