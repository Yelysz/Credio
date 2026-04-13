export type DashboardMetricsApiResponse = {
  totalPortfolio: number;
  availableLiquidity: number;
  totalDelinquency: number;
  activeLoans: number;

  cashFlow: {
    disbursements: number[];
    collections: number[];
  };

  portfolioState: {
    currentPercentage: number;
    overduePercentage: number;
    dueSoonPercentage: number;
  };
};

export type UpcomingInstallment = {
  client: string;
  loan: number;
  dueAmount: number;
  dueDate: string;
  state: string;
};

export type DashboardUpcomingInstallment = {
  client: string;
  loan: number | string;
  installment: string;
  dueDate: string;
  amount: number;
  status: string;
};

export type DashboardData = {
  totalPortfolio: number;
  availableLiquidity: number;
  totalDelinquency: number;
  activeLoans: number;

  upcomingInstallments: DashboardUpcomingInstallment[];

  // nuevos campos
  cashFlow: {
    disbursements: number[];
    collections: number[];
  };

  portfolioState: {
    currentPercentage: number;
    overduePercentage: number;
    dueSoonPercentage: number;
  };
};