import apiService from "./ApiService";
import { toast } from "@/hooks/use-toast";
import {
  Account,
  Transaction,
  TransferRequest,
  TransferResponse,
  BankingApiResponse,
  PaginatedBankingResponse,
  AccountLookupResponse,
} from "@/lib/types/bankingTypes";

import { ApiResponse, AuthResponseType } from "@/lib/types/responseTypes";
import { AuthRequestType } from "../types/requestTypes";
import Configs from "../configs";

export async function apiAuthenticate(
  payload: AuthRequestType
): Promise<AuthResponseType | null> {
  return apiService
    .request<ApiResponse<AuthResponseType>, any>({
      url: `/api/auth/login`,
      method: "post",
      data: payload,
    })
    .then((res) => {
      if (!res.data.succeeded) {
        toast({
          variant: "destructive",
          title: res?.data?.message ?? "An error occurred.",
        });
        return null;
      }

      // Store tokens
      if (res.data.data?.jwToken) {
        sessionStorage.setItem(Configs.authToken, res.data.data.jwToken);

        if ((res.data.data as any)?.refreshToken) {
          sessionStorage.setItem(
            "refreshToken",
            (res.data.data as any).refreshToken
          );
        }

        if (res.data.data?.expiresIn) {
          const expiresAt = Date.now() + res.data.data.expiresIn * 1000;
          sessionStorage.setItem("tokenExpiresAt", expiresAt.toString());
        }
      }

      return res.data?.data ?? ({} as AuthResponseType);
    })
    .catch((err) => {
      const errorMessage =
        err.response?.data?.message ?? "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: errorMessage,
      });
      return null;
    });
}

export async function apiDownloadData(url: {
  exportUrl?: string;
  query?: string;
}): Promise<void> {
  return apiService
    .request<Blob>({
      url: `${url.exportUrl}${url.query}`,
      method: "GET",
      responseType: "blob",
      headers: {
        ...Configs.getAuthorization(),
      },
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message ?? "An error occurred.";
      toast({
        variant: "destructive",
        title: errorMessage,
      });
    });
}

export async function apiLogout(): Promise<boolean | string> {
  return apiService
    .request<ApiResponse<boolean | string>, any>({
      url: `/api/auth/logout`,
      method: "post",
      headers: {
        ...Configs.getAuthorization(),
      },
    })
    .then((res) => {
      if (res.data?.succeeded) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(Configs.authToken);
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("tokenExpiresAt");
        }
        return res.data?.succeeded;
      } else {
        toast({
          title: "Error",
          description:
            res.data?.message || "An error occurred, please try again",
          variant: "destructive",
        });
        throw new Error(
          res.data?.message || "An error occurred, please try again"
        );
      }
    })
    .catch((err) => {
      console.log(Configs.authToken);
      toast({
        variant: "destructive",
        title: err.response?.data?.message ?? "An error occured.",
      });

      return "";
    });
}

// API functions using your existing apiService pattern
export const fetchAccounts = async (): Promise<Account[]> => {
  try {
    const response = await apiService.request<BankingApiResponse<Account[]>>({
      url: "/api/accounts",
      method: "get",
    });

    if (response.data.succeeded) {
      return response.data.data || [];
    } else {
      toast({
        variant: "destructive",
        title: response.data.message || "Failed to fetch accounts",
      });
      return [];
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed to fetch accounts",
    });
    return [];
  }
};

export const fetchTransactions = async (
  accountId: string,
  page: number = 1,
  limit: number = 20,
  filters?: {
    category?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<PaginatedBankingResponse<Transaction>> => {
  try {
    const params = { page, limit, ...filters };
    const response = await apiService.request<
      BankingApiResponse<PaginatedBankingResponse<Transaction>>
    >({
      url: `/api/accounts/${accountId}/transactions`,
      method: "get",
      params,
    });

    if (response.data.succeeded) {
      return (
        response.data.data || {
          data: [],
          pageMeta: {
            pageNumber: 1,
            pageSize: 20,
            totalPages: 0,
            totalRecords: 0,
          },
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: response.data.message || "Failed to fetch transactions",
      });
      return {
        data: [],
        pageMeta: {
          pageNumber: 1,
          pageSize: 20,
          totalPages: 0,
          totalRecords: 0,
        },
      };
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Failed to fetch transactions",
    });
    return {
      data: [],
      pageMeta: { pageNumber: 1, pageSize: 20, totalPages: 0, totalRecords: 0 },
    };
  }
};

export const apiAccountLookup = async (
  account: string
): Promise<BankingApiResponse<AccountLookupResponse>> => {
  const response = await apiService.request<
    BankingApiResponse<AccountLookupResponse>
  >({
    url: "/api/account-lookup",
    method: "post",
    data: account,
  });

  return response.data;
};

export const apiInitiateTransfer = async (
  transferData: TransferRequest
): Promise<TransferResponse | null> => {
  try {
    const response = await apiService.request<
      BankingApiResponse<TransferResponse>
    >({
      url: "/api/transfers",
      method: "post",
      data: transferData,
    });

    if (response.data.succeeded) {
      return response.data.data || null;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
