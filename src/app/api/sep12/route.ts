// SEP-12 KYC endpoint
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // SEP-12 status endpoint doesn't require account parameter
    // Basic SEP-12 status response
    const status = {
      status: "pending",
      message: "KYC verification in progress"
    };

    return NextResponse.json(status, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
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

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204
  });
}
