import { lendingApi } from "@/shared/services/api";
import type {
  PortfolioReportParams,
  PortfolioReportResponse,
} from "../types/report.types";

export const reportService = {
  async getPortfolioReport(params?: PortfolioReportParams) {
    const { data } = await lendingApi.get<PortfolioReportResponse>(
      "/api/v1/report/portfolio",
      { params }
    );
    return data;
  },
};