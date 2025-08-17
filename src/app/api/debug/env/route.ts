import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  return NextResponse.json({
    message: 'Environment Variables Debug',
    env: envVars,
    timestamp: new Date().toISOString(),
  })
}