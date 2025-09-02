// SEP-12 KYC endpoint
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get("account");
    
    if (!account) {
      return NextResponse.json(
        { error: "Missing 'account' parameter" },
        { status: 400 }
      );
    }

    // Basic SEP-12 status response
    const status = {
      status: "pending",
      message: "KYC verification in progress"
    };

    return NextResponse.json(status);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Basic SEP-12 KYC submission
    const response = {
      id: "kyc_" + Date.now(),
      status: "pending"
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
