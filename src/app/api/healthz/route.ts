// put this at line:01 in file app/api/healthz/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Return minimal payload so Fly's health checks are fast/light.
  return NextResponse.json({ ok: true, service: 'codytoken', ts: Date.now() });
}
