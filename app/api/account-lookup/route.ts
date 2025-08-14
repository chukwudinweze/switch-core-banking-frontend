import { NextRequest, NextResponse } from "next/server";
import { AccountLookupResponse } from "@/lib/types/bankingTypes";
import Configs from "@/lib/configs";

export async function POST(request: NextRequest) {
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

    const accountNo = await request.json();
    const formatedAcct = String(accountNo).trim();

    console.log(Configs?.beneficiaryAcct?.trim());

    // Check account validity
    if (
      !formatedAcct ||
      formatedAcct.length !== 10 ||
      formatedAcct !== Configs.beneficiaryAcct?.trim()
    ) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 400,
          message: "Account not valid",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["This account number cannot be used for transactions"],
        },
        { status: 400 }
      );
    }

    // Simulate lookup processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock lookup result
    const mockResponse: AccountLookupResponse = {
      account: accountNo,
      name: Configs.beneficiaryName!,
    };

    return NextResponse.json({
      succeeded: true,
      code: 200,
      message: "Account lookup successful",
      data: mockResponse,
      pageMeta: { pageNumber: 1, pageSize: 1, totalPages: 1, totalRecords: 1 },
      error: null,
    });
  } catch (error) {
    console.error("Account lookup error:", error);

    return NextResponse.json(
      {
        succeeded: false,
        code: 500,
        message: "Account lookup failed",
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
