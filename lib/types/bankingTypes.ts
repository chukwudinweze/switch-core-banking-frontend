import { ApiResponse, PageMeta } from "./responseTypes";

export interface Account {
  id: string;
  accountNumber: string;
  accountType: "Savings" | "Current" | "Loan";
  balance: number;
  currency: string;
  lastTransactionDate: string;
  status: "Active" | "Inactive" | "Suspended";
  customerId: string;
  accountName?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  type: "Credit" | "Debit";
  amount: number;
  balanceAfter: number;
  reference: string;
  category: string;
  beneficiaryAccount?: string;
  sourceAccount?: string;
  beneficiaryName: string;
}

export interface TransferRequest {
  sourceAccountId: string;
  beneficiaryAccountNumber: string;
  amount: number;
  description: string;
}

export interface TransferResponse {
  id: string;
  status: "Pending" | "Completed" | "Failed";
  reference: string;
  timestamp: string;
  message?: string;
}

export interface AccountLookupResponse {
  account: string;
  name: string;
}

// Extend your existing ApiResponse for banking endpoints
export interface BankingApiResponse<T> extends ApiResponse<T> {
  // Inherits all properties from ApiResponse
}

export interface PaginatedBankingResponse<T> {
  data: T[];
  pageMeta: PageMeta; // Using your existing PageMeta structure
}
