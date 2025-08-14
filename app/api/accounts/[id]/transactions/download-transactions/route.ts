import { NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mock-txn-data";
import { Parser } from "json2csv";

interface IParams {
  id: string;
}

// Type for server component props
interface PageProps {
  params: Promise<IParams>;
}

export async function GET(request: NextRequest, { params }: PageProps) {
  try {
    const { searchParams } = new URL(request.url);

    // Filters (support both camelCase and PascalCase used in the table/query builder)
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

    const { id: accountId } = await params;

    // Start with this account's transactions
    let filtered = mockTransactions.filter((t) => t.accountId === accountId);

    // Apply filters
    if (category) {
      filtered = filtered.filter(
        (t) => (t.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    if (type) {
      filtered = filtered.filter(
        (t) => (t.type || "").toLowerCase() === type.toLowerCase()
      );
    }

    if (dateFrom) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(dateTo));
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((t) =>
        [t.id, t.description, t.reference, t.beneficiaryAccount]
          .filter(Boolean)
          .some((v) => v!.toString().toLowerCase().includes(q))
      );
    }

    // Sorting (same options as table)
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      filtered = filtered.sort((a, b) => {
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

    // Build CSV
    const parser = new Parser({
      fields: [
        { label: "Date", value: "date" },
        { label: "Description", value: "description" },
        { label: "Type", value: "type" },
        { label: "Amount", value: "amount" },
        { label: "Balance After", value: "balanceAfter" },
        { label: "Reference", value: "reference" },
        { label: "Category", value: "category" },
        { label: "Beneficiary Account", value: "beneficiaryAccount" },
        { label: "Beneficiary Name", value: "beneficiaryName" },
        { label: "Transaction ID", value: "id" },
      ],
    });
    const csv = parser.parse(filtered);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=transactions.csv",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}
