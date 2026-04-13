export interface PortfolioReportParams {
  startDate?: string;
  endDate?: string;
  state?: string;
  client?: string;
}

export interface PortfolioSummary {
  totalLoans: number;
  totalPortfolio: number;
  lateFees: number;
}

export interface PortfolioReportItem {
  loanNumber: number;
  client: string;
  originalAmount: number;
  outstandingBalance: number;
  totalFeePaidCount: number;
  totalFeeCount: number;
  daysInArrears: number | null;
  state: string;
}

export interface PortfolioReportData {
  summary: PortfolioSummary;
  data: PortfolioReportItem[];
}

export interface ApiResponse<T> {
  detail: string;
  type: string;
  statusCode: number;
  data: T;
}