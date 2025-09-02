// SEP-24 Transfer endpoint
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

    // Basic SEP-24 info response
    const info = {
      deposit: {
        CODY: {
          enabled: true,
          fee_fixed: 0,
          fee_percent: 0,
          min_amount: 1,
          max_amount: 1000000
        }
      },
      withdraw: {
        CODY: {
          enabled: true,
          fee_fixed: 0,
          fee_percent: 0,
          min_amount: 1,
          max_amount: 1000000
        }
      },
      fee: {
        enabled: true
      }
    };

    return NextResponse.json(info);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Basic SEP-24 transaction response
    const response = {
      id: "txn_" + Date.now(),
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
