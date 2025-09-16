import { NextResponse } from 'next/server';
import { TokenomicsService } from '@/services/tokenomicsService';

export async function GET() {
  try {
    const summary = TokenomicsService.getTokenomics();
    const response = NextResponse.json({
      totalSupply: summary.totalSupply,
      circulatingSupply: summary.circulatingSupply,
      source: summary.source,
      timestamp: new Date().toISOString()
    });
    response.headers.set('Cache-Control', 'public, max-age=30');
    return response;
  } catch {
    const errorResponse = NextResponse.json(
      { error: 'Failed to load tokenomics' },
      { status: 500 }
    );
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return response;
}


