import { NextRequest, NextResponse } from "next/server";
import { TransferRequest, TransferResponse } from "@/lib/types/bankingTypes";
import { mockAccounts } from "@/lib/mock-accounts";
import { mockTransactions } from "@/lib/mock-txn-data";
import Configs from "@/lib/configs";

// Transaction type enum
enum TransactionType {
  Debit = "Debit",
  Credit = "Credit",
}

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

    const body: TransferRequest = await request.json();

    // Validate request body
    if (
      !body.sourceAccountId ||
      !body.beneficiaryAccountNumber ||
      !body.amount ||
      !body.description
    ) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 400,
          message: "Missing required fields",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: [
            "sourceAccountId, beneficiaryAccountNumber, amount, and description are required",
          ],
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 400,
          message: "Invalid amount",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Amount must be greater than zero"],
        },
        { status: 400 }
      );
    }

    // Find source account
    const sourceAccount = mockAccounts.find(
      (account) => account.id === body.sourceAccountId
    );
    if (!sourceAccount) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 404,
          message: "Source account not found",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Source account does not exist"],
        },
        { status: 404 }
      );
    }

    // Check sufficient funds
    if (sourceAccount.balance < body.amount) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 400,
          message: "Insufficient funds",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Source account has insufficient balance"],
        },
        { status: 400 }
      );
    }

    // Validate beneficiary account
    if (
      String(body.beneficiaryAccountNumber).trim() !==
      String(Configs.beneficiaryAcct).trim()
    ) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 404,
          message: "Beneficiary account not found",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Beneficiary account does not exist"],
        },
        { status: 404 }
      );
    }

    // Simulate transfer processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Update source account balance
    sourceAccount.balance -= body.amount;

    // Add transaction to mockTransactions
    const transactionId = `txn-${Date.now()}`;
    const reference = `REF${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    mockTransactions.push({
      id: transactionId,
      accountId: body.sourceAccountId,
      date: new Date().toISOString(),
      description: body.description,
      type: TransactionType.Debit,
      amount: body.amount,
      balanceAfter: sourceAccount.balance,
      reference,
      category: "Transfer",
      beneficiaryName: Configs.beneficiaryName!,
      beneficiaryAccount: body.beneficiaryAccountNumber,
    });

    // Create response
    const mockResponse: TransferResponse = {
      id: `transfer-${Date.now()}`,
      status: "Completed",
      reference,
      timestamp: new Date().toISOString(),
      message: "Transfer completed successfully",
    };

    return NextResponse.json({
      succeeded: true,
      code: 200,
      message: "Transfer completed successfully",
      data: mockResponse,
      pageMeta: {
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalRecords: 1,
      },
      error: null,
    });
  } catch (error) {
    console.error("Transfer error:", error);

    return NextResponse.json(
      {
        succeeded: false,
        code: 500,
        message: "Transfer failed",
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
