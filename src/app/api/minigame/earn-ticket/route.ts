import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token =
    req.cookies.get('token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  const body = await req.json();

  const backendRes = await fetch('https://pengoo-back-end.vercel.app/minigame/earn-ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}