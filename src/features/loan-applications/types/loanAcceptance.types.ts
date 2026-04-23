export interface LoanApplicationItem {
  id: string;
  applicationCode?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;

  requestedAmount?: number;
  requestedTerm?: number;
  requestedInterestRate?: number;
  paymentFrequencyId?: string;
  paymentFrequency?: string | null;

  purpose?: string;
  applicationStatusId?: string;
  applicationStatusName?: string;

  approvedAmount?: number | null;
  approvedTerm?: number | null;
  approvedInterestRate?: number | null;

  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface LoanApplicationDetail extends LoanApplicationItem {
  rejectionReason?: string | null;
}

export interface ApproveLoanApplicationPayload {
  approvedAmount: number;
  approvedTerm: number;
  approvedInterestRate: number;
  comments?: string;
}

export interface SimulationInstallment {
  installmentNumber?: number;
  dueDate?: string;
  principal?: number;
  interest?: number;
  installmentAmount?: number;
  balance?: number;
  [key: string]: unknown;
}

export interface LoanSimulationResponse {
  installments?: SimulationInstallment[];
  totalInterest?: number;
  totalAmount?: number;
  monthlyInstallment?: number;
  [key: string]: unknown;
}