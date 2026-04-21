export interface Installment {
  installmentNumber?: number;
  dueDate?: string;
  principal?: number;
  interest?: number;
  totalPayment?: number;
  remainingBalance?: number;
  status?: string;
  [key: string]: unknown;
}

export interface Loan {
  id: string;
  loanNumber?: string;
  clientId?: string;
  clientName?: string;
  applicationId?: string;
  amount?: number;
  interestRate?: number;
  termMonths?: number;
  paymentFrequency?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface LoanScheduleResponse {
  loanId?: string;
  loanNumber?: string;
  installments?: Installment[];
  [key: string]: unknown;
}

export interface PreviewAmortizationParams {
  applicationId?: string;
  amount?: number;
  interestRate?: number;
  termMonths?: number;
  paymentFrequencyId?: string;
}

export interface CreateLoanPayload {
  applicationId: string;
  amount?: number;
  interestRate?: number;
  termMonths?: number;
  paymentFrequencyId?: string;
  firstPaymentDate?: string;
}

export interface DisburseLoanPayload {
  loanId: string;
  disbursementDate?: string;
  notes?: string;
}

export interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}