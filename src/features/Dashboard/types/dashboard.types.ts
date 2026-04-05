export interface DashboardMetricsApiResponse {
  carteraTotal?: number | string;
  liquidezDisponible?: number | string;
  moraTotal?: number | string;
  prestamosActivos?: number | string;

  totalPortfolio?: number | string;
  availableLiquidity?: number | string;
  totalDelinquency?: number | string;
  activeLoans?: number | string;

  [key: string]: unknown;
}

export interface UpcomingInstallment {
  id?: string;
  loanId?: string;
  loanNumber?: string;
  clientName?: string;
  dueDate?: string;
  amount?: number | string;
  installmentNumber?: number;
  status?: string;
  [key: string]: unknown;
}

export interface DashboardViewModel {
  carteraTotal: number;
  liquidezDisponible: number;
  moraTotal: number;
  prestamosActivos: number;
  upcomingInstallments: UpcomingInstallment[];
}