// SEP-10 Web Auth endpoint
import { NextResponse } from "next/server";
import { SEP10Service } from "@/services/sep10Service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account');

    if (!account) {
      return NextResponse.json(
        { error: "Missing required parameter: account" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Generate SEP-10 challenge
    const challenge = await SEP10Service.generateChallenge(account);

    return NextResponse.json(challenge, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('SEP-10 challenge generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction } = body;

    if (!transaction) {
      return NextResponse.json(
        { error: "Missing required parameter: transaction" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate challenge and generate JWT token
    const tokenResponse = await SEP10Service.validateChallenge(transaction);

    return NextResponse.json(tokenResponse, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('SEP-10 challenge validation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
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
