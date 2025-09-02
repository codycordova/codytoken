// SEP-10 Web Auth endpoint
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // SEP-10 challenge endpoint doesn't require account parameter
    // Basic SEP-10 challenge response
    const challenge = {
      transaction: "AAAAAG...", // This would be a real Stellar transaction
      network_passphrase: "Public Global Stellar Network ; September 2015"
    };

    return NextResponse.json(challenge, {
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
    // Basic SEP-10 challenge validation
    // In production, you'd implement proper transaction validation
    const token = {
      token: "eyJ...", // This would be a real JWT token
      type: "jwt"
    };

    return NextResponse.json(token, {
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
