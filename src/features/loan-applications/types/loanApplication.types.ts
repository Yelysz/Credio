export interface LoanApplication {
  id: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  requestedAmount?: number;
  approvedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  paymentFrequency?: string;
  applicationStatus?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface LoanApplicationDetail extends LoanApplication {
  documentNumber?: string;
  notes?: string;
  rejectionReason?: string;
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