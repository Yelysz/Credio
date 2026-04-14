export interface ApiResponse<T> {
  detail?: string;
  type?: string;
  statusCode?: number;
  data: T;
}

export interface ClientItem {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  documentNumber?: string;
  score?: number;
  email?: string;
  phone?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  [key: string]: unknown;
}

export interface PaymentFrequency {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface SimulationInstallment {
  installmentNumber: number;
  dueDate: string;
  dueAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

export interface SimulationResult {
  installmentAmount: number;
  totalInterest: number;
  totalToPay: number;
  totalAmount: number;
  schedule: SimulationInstallment[];
}

export interface SimulateLoanApplicationParams {
  requestedAmount: number;
  requestTerm: number;
  requestedInterestRate: number;
  paymentFrequencyId: string;
}

export interface CreateLoanApplicationPayload {
  clientId: string;
  employeeId: string;
  requestedAmount: number;
  requestedTerm: number;
  requestedInterestRate: number;
  paymentFrequencyId: string;
  purpose?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export interface LoanApplicationFormData {
  clientId: string;
  clientName: string;
  clientDocument: string;

  requestedAmount: number | "";
  requestTerm: number | "";
  requestedInterestRate: number | "";
  paymentFrequencyId: string;
  purpose: string;
  monthlyIncome: number | "";
  monthlyExpenses: number | "";
}

export type LoanApplicationStep = 1 | 2 | 3 | 4;