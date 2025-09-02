import { NextResponse } from 'next/server';
import { PriceService } from '@/services/priceService';

export async function GET() {
  try {
    // Add CORS headers for cross-origin requests
    const response = NextResponse.json(await PriceService.getCodyPrice());
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 'public, max-age=5'); // 5-second cache
    response.headers.set('Content-Type', 'application/json');
    
    return response;
  } catch (error) {
    console.error('Error in price API:', error);
    
    const errorResponse = NextResponse.json(
      { 
        error: 'Failed to fetch price data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
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