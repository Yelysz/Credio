export interface PortfolioReportItem {
  loanId?: string;
  loanNumber?: string;
  clientName?: string;
  documentNumber?: string;
  amount?: number;
  balance?: number;
  status?: string;
  dueDate?: string;
  daysPastDue?: number;
  [key: string]: unknown;
}

export interface PortfolioReportResponse {
  totalPortfolio?: number;
  totalBalance?: number;
  totalOverdue?: number;
  totalLoans?: number;
  items?: PortfolioReportItem[];
  data?: PortfolioReportItem[];
  loans?: PortfolioReportItem[];
  [key: string]: unknown;
}

export interface PortfolioReportParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  clientId?: string;
}