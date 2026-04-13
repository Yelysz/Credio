export interface LoanApplication {
  id: string;
  applicationCode?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;

  requestedAmount?: number;
  requestedTerm?: number;
  requestedInterestRate?: number;
  purpose?: string;

  approvedAmount?: number | null;
  approvedTerm?: number | null;
  approvedInterestRate?: number | null;

  applicationStatusId?: string;
  applicationStatusName?: string;

  rejectionReason?: string;
  paymentFrequencyId?: string;
  paymentFrequency?: string | null;

  createdAt?: string;
  [key: string]: unknown;
}

export interface LoanApplicationDetail extends LoanApplication {
  documentNumber?: string;
}

export interface LoanApplicationListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  employeeId?: string;
  status?: string;
}

export interface SimulationParams {
  amount: number;
  interestRate: number;
  termMonths: number;
  paymentFrequencyId?: string;
}

export interface SimulationInstallment {
  installmentNumber?: number;
  dueDate?: string;
  principal?: number;
  interest?: number;
  totalPayment?: number;
  remainingBalance?: number;
  [key: string]: unknown;
}

export interface SimulationResponse {
  installments?: SimulationInstallment[];
  totalInterest?: number;
  totalPayment?: number;
  [key: string]: unknown;
}

export interface CreateLoanApplicationPayload {
  requestedInterestRate: number;
  requestedAmount: number;
  requestedTerm: number;
  clientId: string;
  employeeId: string;
  paymentFrequencyId: string;
  purpose?: string;
}