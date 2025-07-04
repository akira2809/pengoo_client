import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(req: NextRequest, context: { params: Promise<{ productId: string }> }) {
  const { productId } = await context.params;
  const res = await fetch(`${BACKEND_URL}/reviews/product/${productId}`);
  if (!res.ok) {
    return NextResponse.json([], { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, context: { params: Promise<{ productId: string }> }) {
  const { productId } = await context.params;
  const body = await req.json();

  // Forward the Authorization header if present
  const authHeader = req.headers.get('authorization');

  const res = await fetch(`${BACKEND_URL}/reviews/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}