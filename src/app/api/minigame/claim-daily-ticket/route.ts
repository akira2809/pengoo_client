import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  const backendRes = await fetch('http://localhost:3000/minigame/claim-daily-ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}