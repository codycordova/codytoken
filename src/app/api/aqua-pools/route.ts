import { NextResponse } from 'next/server';
import { AquaService } from '@/services/aquaService';

export async function GET() {
  try {
    const aquaData = await AquaService.getAllCodyPools();
    
    const response = NextResponse.json(aquaData);
    response.headers.set('Cache-Control', 'public, max-age=10'); // 10-second cache for pool data
    response.headers.set('Content-Type', 'application/json');
    return response;
  } catch (error) {
    console.error('Error in Aqua pools API:', error);
    
    const errorResponse = NextResponse.json(
      { 
        error: 'Failed to fetch Aqua pool data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return response;
}
