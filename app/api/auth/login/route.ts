import { NextRequest, NextResponse } from "next/server";
import { AuthRequestType } from "@/lib/types/requestTypes";

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequestType = await request.json();

    // Validate request
    if (!body.phoneNumber || !body.password) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 400,
          message: "Phone number and password are required",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Missing required fields"],
        },
        { status: 400 }
      );
    }

    const mockOAuthResponse = await mockOAuth2Authentication(body);

    if (!mockOAuthResponse) {
      return NextResponse.json(
        {
          succeeded: false,
          code: 401,
          message: "Invalid credentials",
          data: null,
          pageMeta: {
            pageNumber: 1,
            pageSize: 0,
            totalPages: 0,
            totalRecords: 0,
          },
          error: ["Invalid phone number or password"],
        },
        { status: 401 }
      );
    }

    // delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      succeeded: true,
      code: 200,
      message: "Authentication successful",
      data: mockOAuthResponse,
      pageMeta: {
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalRecords: 1,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        succeeded: false,
        code: 500,
        message: "Internal server error",
        data: null,
        pageMeta: {
          pageNumber: 1,
          pageSize: 0,
          totalPages: 0,
          totalRecords: 0,
        },
        error: ["Authentication service unavailable"],
      },
      { status: 500 }
    );
  }
}

async function mockOAuth2Authentication(credentials: AuthRequestType) {
  // Mock user
  const mockUsers = [
    {
      phoneNumber: "08060281867",
      password: "Password@123",
      userData: {
        id: "switch-user-123",
        userName: "switchUser",
        email: "user@switchbank.com",
        firstName: "Switch",
        lastName: "User",
        isActive: true,
        isLoggedIn: true,
        lastLoginTime: new Date().toISOString(),
      },
    },
  ];

  // Find user
  const user = mockUsers.find(
    (u) =>
      u.phoneNumber === credentials.phoneNumber &&
      u.password === credentials.password
  );

  if (!user) {
    return null;
  }

  // Generate OAuth 2.0 tokens
  const accessToken = `mock-access-token-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const refreshToken = `mock-refresh-token-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const expiresIn = 3600;

  return {
    ...user.userData,
    jwToken: accessToken,
    refreshToken: refreshToken,
    expiresIn: expiresIn,
    expiryDate: new Date(Date.now() + expiresIn * 1000).toISOString(),
  };
}
