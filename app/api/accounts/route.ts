import { mockAccounts } from "@/lib/mock-accounts";
import { NextRequest, NextResponse } from "next/server";

// Mock data for development

export async function GET(request: NextRequest) {
  try {
    // token validation
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 401,
          message: "Unauthorized",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Bearer token required"],
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token || token.length < 10) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 401,
          message: "Unauthorized - Invalid token",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Invalid token"],
        },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const filterBy = searchParams.get("FilterBy");
    const sortBy = searchParams.get("SortBy");
    const sortOrder = searchParams.get("SortOrder") || "asc";
    const startDate = searchParams.get("StartDate");
    const endDate = searchParams.get("EndDate");
    const pageSize = parseInt(searchParams.get("PageSize") || "12");
    const pageNumber = parseInt(searchParams.get("PageNumber") || "1");

    // Apply filtering based on filterBy parameter
    let filteredAccounts = [...mockAccounts];

    if (filterBy) {
      switch (filterBy.toLowerCase()) {
        case "savings":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.accountType === "Savings"
          );
          break;
        case "current":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.accountType === "Current"
          );
          break;
        case "loan":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.accountType === "Loan"
          );
          break;
        case "active":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.status === "Active"
          );
          break;
        case "inactive":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.status === "Inactive"
          );
          break;
        case "suspended":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.status === "Suspended"
          );
          break;
        case "ngn":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.currency === "NGN"
          );
          break;
        case "usd":
          filteredAccounts = mockAccounts.filter(
            (acc) => acc.currency === "USD"
          );
          break;
        case "positive":
          filteredAccounts = mockAccounts.filter((acc) => acc.balance > 0);
          break;
        case "negative":
          filteredAccounts = mockAccounts.filter((acc) => acc.balance < 0);
          break;
        default:
          // If filterBy doesn't match any known filter, return all accounts
          filteredAccounts = [...mockAccounts];
      }
    }

    // Apply date range filtering
    if (startDate || endDate) {
      filteredAccounts = filteredAccounts.filter((acc) => {
        const transactionDate = new Date(acc.lastTransactionDate);

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return transactionDate >= start && transactionDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          return transactionDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          return transactionDate <= end;
        }

        return true;
      });
    }

    // Apply sorting
    if (sortBy) {
      filteredAccounts.sort((a, b) => {
        let comparison = 0;

        switch (sortBy.toLowerCase()) {
          case "balance":
            comparison = a.balance - b.balance;
            break;
          case "lasttransactiondate":
            comparison =
              new Date(a.lastTransactionDate).getTime() -
              new Date(b.lastTransactionDate).getTime();
            break;
          case "accountname":
            comparison = (a.accountName || "").localeCompare(
              b.accountName || ""
            );
            break;
          case "accounttype":
            comparison = a.accountType.localeCompare(b.accountType);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          default:
            // Default sort by account number if unknown sort field
            comparison = a.accountNumber.localeCompare(b.accountNumber);
        }

        // Apply sort order
        return sortOrder.toLowerCase() === "desc" ? -comparison : comparison;
      });
    }

    // Apply pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      succeeded: true,
      code: 200,
      message: "Accounts fetched successfully",
      data: paginatedAccounts,
      pageMeta: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredAccounts.length / pageSize),
        totalRecords: filteredAccounts.length,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        code: 500,
        message: "Failed to fetch accounts",
        data: null,
        pageMeta: {
          pageNumber: 1,
          pageSize: 0,
          totalPages: 0,
          totalRecords: 0,
        },
        error: ["Internal server error"],
      },
      { status: 500 }
    );
  }
}
