import { NextResponse } from 'next/server';
import { PriceService } from '@/services/priceService';

const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || '*';

export async function GET() {
  try {
    const payload = await PriceService.getCodyPrice();
    const response = NextResponse.json(payload);
    response.headers.set('Cache-Control', 'public, max-age=5'); // 5-second cache
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Vary', 'Origin');
    return response;
  } catch (error) {
    console.error('Error in price API:', error);

    const errorResponse = NextResponse.json(
      {
        error: 'Failed to fetch price data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    errorResponse.headers.set('Vary', 'Origin');
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Vary', 'Origin');
  return response;
} 