import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registration request body:', body);
    
    const response = await fetch('https://pengoo-back-end.vercel.app/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        // Ensure all required fields have default values if not provided
        phone_number: body.phone_number || '',
        address: body.address || '',
        avatar_url: body.avatar_url || '',
        role: body.role || 'user'
      }),
    });

    const data = await response.json().catch(() => ({}));

    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      data
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.message || 'Registration failed',
          details: data.details || {}
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('Registration error details:', {
      error: errorMessage,
      stack: errorStack,
      name: errorName
    });
    return NextResponse.json(
      { 
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
