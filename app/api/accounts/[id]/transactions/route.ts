import { NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mock-txn-data";

interface IParams {
  id: string;
}

// Type for server component props
interface PageProps {
  params: Promise<IParams>;
}

export async function GET(request: NextRequest, { params }: PageProps) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(
      searchParams.get("PageNumber") || searchParams.get("page") || "1"
    );
    const limit = parseInt(
      searchParams.get("PageSize") || searchParams.get("limit") || "20"
    );

    // Filters
    const category =
      searchParams.get("category") || searchParams.get("Category") || "";
    const type = searchParams.get("type") || searchParams.get("Type") || "";
    const dateFrom =
      searchParams.get("StartDate") || searchParams.get("dateFrom") || "";
    const dateTo =
      searchParams.get("EndDate") || searchParams.get("dateTo") || "";
    const query = searchParams.get("Query") || searchParams.get("q") || "";

    // Sorting
    const sortBy = (
      searchParams.get("SortBy") ||
      searchParams.get("sortBy") ||
      ""
    ).toLowerCase();
    const sortOrder = (
      searchParams.get("SortOrder") ||
      searchParams.get("sortOrder") ||
      "asc"
    ).toLowerCase();

    const { id: accoundId } = await params;

    let filteredTransactions = mockTransactions.filter(
      (t) => t.accountId === accoundId
    );

    // Apply filters
    if (category) {
      filteredTransactions = filteredTransactions.filter(
        (t) => (t.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    if (type) {
      filteredTransactions = filteredTransactions.filter(
        (t) => (t.type || "").toLowerCase() === type.toLowerCase()
      );
    }

    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.date) <= new Date(dateTo)
      );
    }

    if (query) {
      const q = query.toLowerCase();
      filteredTransactions = filteredTransactions.filter((t) =>
        [t.id, t.description, t.reference, t.beneficiaryAccount]
          .filter(Boolean)
          .some((v) => v!.toString().toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      filteredTransactions = filteredTransactions.sort((a, b) => {
        let av: number | string = "";
        let bv: number | string = "";

        switch (sortBy) {
          case "date":
            av = new Date(a.date).getTime();
            bv = new Date(b.date).getTime();
            break;
          case "amount":
            av = a.amount;
            bv = b.amount;
            break;
          case "type":
            av = a.type;
            bv = b.type;
            break;
          case "category":
            av = a.category || "";
            bv = b.category || "";
            break;
          case "reference":
            av = a.reference || "";
            bv = b.reference || "";
            break;
          case "beneficiaryaccount":
            av = a.beneficiaryAccount || "";
            bv = b.beneficiaryAccount || "";
            break;
          case "id":
            av = a.id;
            bv = b.id;
            break;
          case "description":
            av = a.description || "";
            bv = b.description || "";
            break;
          default:
            return 0;
        }

        if (av < bv) return -1 * order;
        if (av > bv) return 1 * order;
        return 0;
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      endIndex
    );

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (filteredTransactions.length === 0) {
      return NextResponse.json({
        succeeded: true,
        code: 200,
        message: "No transactions found",
        data: [],
        pageMeta: {
          pageNumber: page,
          pageSize: limit,
          totalPages: 0,
          totalRecords: 0,
        },
        error: null,
      });
    }

    return NextResponse.json({
      succeeded: true,
      code: 200,
      message: "Transactions fetched successfully",
      data: paginatedTransactions,
      pageMeta: {
        pageNumber: page,
        pageSize: limit,
        totalPages: Math.ceil(filteredTransactions.length / limit),
        totalRecords: filteredTransactions.length,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        code: 500,
        message: "Failed to fetch transactions",
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
