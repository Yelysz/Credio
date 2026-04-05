import { useCallback, useEffect, useState } from "react";
import { reportService } from "../services/report.service";
import type {
  PortfolioReportItem,
  PortfolioReportParams,
  PortfolioReportResponse,
} from "../types/report.types";

const extractItems = (response: PortfolioReportResponse): PortfolioReportItem[] => {
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.loans)) return response.loans;
  return [];
};

export const usePortfolioReport = (initialParams?: PortfolioReportParams) => {
  const [report, setReport] = useState<PortfolioReportResponse | null>(null);
  const [items, setItems] = useState<PortfolioReportItem[]>([]);
  const [params, setParams] = useState<PortfolioReportParams>({
    ...initialParams,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await reportService.getPortfolioReport(params);
      setReport(data);
      setItems(extractItems(data));
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el reporte de cartera.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  return {
    report,
    items,
    params,
    setParams,
    isLoading,
    error,
    refetch: fetchReport,
  };
};