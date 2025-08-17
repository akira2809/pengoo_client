import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Simple API test working!',
    timestamp: new Date().toISOString(),
  })
}