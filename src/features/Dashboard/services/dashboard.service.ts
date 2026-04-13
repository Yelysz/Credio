import type {
  DashboardMetricsApiResponse,
  UpcomingInstallment,
} from "../types/dashboard.types";
import { mapDashboardMetrics } from "../utils/dashboard.mappers";
import { lendingApi } from "@/shared/services/api";

type ApiResponse<T> = {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
};

export const dashboardService = {
  async getMetrics(params?: Record<string, string | number | boolean>) {
    const response = await lendingApi.get<ApiResponse<DashboardMetricsApiResponse>>(
      "/api/v1/dashboard/metrics",
      { params }
    );

    return response.data.data;
  },

  async getUpcomingInstallments(
    params?: Record<string, string | number | boolean>
  ) {
    const response = await lendingApi.get<ApiResponse<UpcomingInstallment[]>>(
      "/api/v1/dashboard/upcoming-installments",
      { params }
    );

    return response.data.data;
  },

  async getDashboardData(params?: Record<string, string | number | boolean>) {
    const [metrics, installments] = await Promise.all([
      this.getMetrics(params),
      this.getUpcomingInstallments(params),
    ]);

    return mapDashboardMetrics(metrics, installments);
  },
};