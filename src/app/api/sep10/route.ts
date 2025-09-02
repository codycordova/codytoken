// SEP-10 Web Auth endpoint
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

    // Basic SEP-10 challenge response
    // In production, you'd implement proper challenge generation and validation
    const challenge = {
      transaction: "AAAAAG...", // This would be a real Stellar transaction
      network_passphrase: "Public Global Stellar Network ; September 2015"
    };

    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Basic SEP-10 challenge validation
    // In production, you'd implement proper transaction validation
    const token = {
      token: "eyJ...", // This would be a real JWT token
      type: "jwt"
    };

    return NextResponse.json(token);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
