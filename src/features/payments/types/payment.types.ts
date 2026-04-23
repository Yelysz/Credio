export interface UpcomingInstallment {
  loanId: string;
  clientName?: string;
  documentNumber?: string;
  loanCode?: string;
  installmentNumber?: number;
  dueDate?: string;
  amount?: number;
  principal?: number;
  interest?: number;
  lateFee?: number;
  status?: string;
  [key: string]: unknown;
}

export interface LoanScheduleItem {
  installmentNumber?: number;
  dueDate?: string;
  paymentDate?: string | null;
  principal?: number;
  interest?: number;
  installmentAmount?: number;
  balance?: number;
  status?: string;
  [key: string]: unknown;
}

export interface LoanScheduleResponse {
  loanId?: string;
  loanCode?: string;
  clientName?: string;
  installments?: LoanScheduleItem[];
  [key: string]: unknown;
}

export interface RegisterPaymentForm {
  loanId: string;
  amountPaid: number;
  paymentMethod: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterPaymentResponse {
  id?: string;
  receiptNumber?: string;
  message?: string;
  [key: string]: unknown;
}