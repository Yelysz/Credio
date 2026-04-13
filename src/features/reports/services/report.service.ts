import { lendingApi } from "@/shared/services/api";
import type {
  ApiResponse,
  PortfolioReportData,
  PortfolioReportParams,
} from "../types/report.types";

export const reportService = {
  async getPortfolioReport(params?: PortfolioReportParams) {
    const response = await lendingApi.get<ApiResponse<PortfolioReportData>>(
      "/api/v1/report/portfolio",
      { params }
    );

    return response.data.data;
  },
};