import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ succeeded: true, message: "Logout successful" });
}
