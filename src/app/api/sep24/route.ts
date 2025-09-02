// SEP-24 Transfer endpoint
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // SEP-24 info endpoint doesn't require account parameter
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

    return NextResponse.json(info, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
    // Basic SEP-24 transaction response
    const response = {
      id: "txn_" + Date.now(),
      status: "pending"
    };

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
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
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
