import type {
  DashboardMetricsApiResponse,
  UpcomingInstallment,
  DashboardData,
} from "../types/dashboard.types";

export const mapDashboardMetrics = (
  metrics: DashboardMetricsApiResponse,
  installments: UpcomingInstallment[]
): DashboardData => {
  return {
    totalPortfolio: Number(metrics?.totalPortfolio ?? 0),
    availableLiquidity: Number(metrics?.availableLiquidity ?? 0),
    totalDelinquency: Number(metrics?.totalDelinquency ?? 0),
    activeLoans: Number(metrics?.activeLoans ?? 0),

    cashFlow: {
      disbursements: metrics?.cashFlow?.disbursements ?? [],
      collections: metrics?.cashFlow?.collections ?? [],
    },

    portfolioState: {
      currentPercentage:
        Number(metrics?.portfolioState?.currentPercentage ?? 0),
      overduePercentage:
        Number(metrics?.portfolioState?.overduePercentage ?? 0),
      dueSoonPercentage:
        Number(metrics?.portfolioState?.dueSoonPercentage ?? 0),
    },

    upcomingInstallments: installments.map((item) => ({
      client: item.client ?? "—",
      loan: item.loan ?? "—",
      installment: "—",
      dueDate: item.dueDate ?? "—",
      amount: Number(item.dueAmount ?? 0),
      status: item.state ?? "—",
    })),
  };
};