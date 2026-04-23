export interface PreviewAmortizationParams {
  applicationId: string;
}

export interface CreateLoanPayload {
   loanApplicationId: string;
   amortizationMethodId: string;
   firstPaymentDate: string;
}

export interface DisburseLoanPayload {
  loanId: string;
  effectiveDate: string;
}

export interface Installment {
  installmentNumber?: number;
  dueDate?: string;
  principal?: number;
  interest?: number;
  installmentAmount?: number;
  balance?: number;
  [key: string]: unknown;
}

export interface Loan {
  id: string;
  applicationId?: string;
  loanNumber?: string;
  status?: string;
  amount?: number;
  term?: number;
  interestRate?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export interface LoanScheduleResponse {
  installments?: Installment[];
  totalInterest?: number;
  totalAmount?: number;
  monthlyInstallment?: number;
  [key: string]: unknown;
}