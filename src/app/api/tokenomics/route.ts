import { NextResponse } from 'next/server';
import { TokenomicsService } from '../../../services/tokenomicsService';

export async function GET() {
  try {
    const summary = TokenomicsService.getTokenomics();
    const response = NextResponse.json({
      totalSupply: summary.totalSupply,
      circulatingSupply: summary.circulatingSupply,
      source: summary.source,
      timestamp: new Date().toISOString()
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 'public, max-age=30');
    return response;
  } catch {
    const errorResponse = NextResponse.json(
      { error: 'Failed to load tokenomics' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}


