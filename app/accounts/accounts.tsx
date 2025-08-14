"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUserAcounts } from "@/hooks/fetchers/useFetchUserAcounts";
import Configs from "@/lib/configs";
import { UseQueryParams } from "@/hooks/custom-hook/UseQueryParams";
import useFilterStore from "@/hooks/store/useFilterStore";
import { Filter } from "@/components/table/filter";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Accounts = () => {
  const filterBy = useFilterStore((state) => state.filterby);
  const sortBy = useFilterStore((state) => state.sortBy);
  const sortOrder = useFilterStore((state) => state.sortOrder);
  const dateRange = useFilterStore((state) => state.dateRange);
  const router = useRouter();

  const { requestUrl } = UseQueryParams({
    endpoint: "api/accounts",
    filterBy,
    sortBy,
    sortOrder,
    // dateRange,
  });
  const { data: accounts, isLoading, error } = useFetchUserAcounts(requestUrl);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;

    const lastFour = accountNumber.slice(-4);
    const maskedPart = "*".repeat(accountNumber.length - 4);
    return `${maskedPart}${lastFour}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Savings":
        return "bg-blue-100 text-blue-800";
      case "Current":
        return "bg-purple-100 text-purple-800";
      case "Loan":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accounts</h1>
        {error && <p className="text-red-600 mb-4">Unable to load account</p>}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900"></h1>
        <div className="text-sm text-gray-500">
          {accounts.length} account{accounts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add the filter component with sorting enabled */}
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No accounts found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/accounts/${account.id}/transaction-history`}
            >
              <Card
                key={account.id}
                className="hover:shadow-md transition-shadow"
                onClick={() => router.push(`/app/accounts/[account]/`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {account.accountName ||
                        maskAccountNumber(account.accountNumber)}
                    </CardTitle>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {maskAccountNumber(account.accountNumber)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={getAccountTypeColor(account.accountType)}
                      >
                        {account.accountType}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {account.currency}
                      </span>
                    </div>

                    {account.lastTransactionDate && (
                      <div className="text-xs text-gray-500">
                        Last transaction:{" "}
                        {new Date(
                          account.lastTransactionDate
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accounts;
