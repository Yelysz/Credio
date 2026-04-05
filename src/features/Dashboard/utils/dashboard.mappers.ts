import type {
  DashboardMetricsApiResponse,
  DashboardViewModel,
  UpcomingInstallment,
} from "../types/dashboard.types";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[,$\s]/g, "");
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const mapDashboardMetrics = (
  metrics: DashboardMetricsApiResponse,
  installments: UpcomingInstallment[]
): DashboardViewModel => {
  return {
    carteraTotal: toNumber(metrics.carteraTotal ?? metrics.totalPortfolio),
    liquidezDisponible: toNumber(
      metrics.liquidezDisponible ?? metrics.availableLiquidity
    ),
    moraTotal: toNumber(metrics.moraTotal ?? metrics.totalDelinquency),
    prestamosActivos: toNumber(
      metrics.prestamosActivos ?? metrics.activeLoans
    ),
    upcomingInstallments: Array.isArray(installments) ? installments : [],
  };
};