import type {
  DashboardMetricsApiResponse,
  UpcomingInstallment,
} from "../types/dashboard.types";
import { mapDashboardMetrics } from "../utils/dashboard.mappers";
import { lendingApi } from "@/shared/services/api";

export const dashboardService = {
  async getMetrics(params?: Record<string, string | number | boolean>) {
    const { data } = await lendingApi.get<DashboardMetricsApiResponse>(
      "/api/v1/dashboard/metrics",
      { params }
    );

    return data;
  },

  async getUpcomingInstallments(
    params?: Record<string, string | number | boolean>
  ) {
    const { data } = await lendingApi.get<UpcomingInstallment[]>(
      "/api/v1/dashboard/upcoming-installments",
      { params }
    );

    return data;
  },

  async getDashboardData(params?: Record<string, string | number | boolean>) {
    const [metrics, installments] = await Promise.all([
      this.getMetrics(params),
      this.getUpcomingInstallments(params),
    ]);

    return mapDashboardMetrics(metrics, installments);
  },
};