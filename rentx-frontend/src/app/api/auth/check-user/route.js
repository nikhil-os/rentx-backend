import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('API route: check-user called with email:', email);

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Special case for test email
    if (email === 'test@example.com') {
      console.log('Test email detected, returning test user data');
      return NextResponse.json({
        message: 'User found',
        phone: '9876549280'
      }, { status: 200 });
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    console.log(`Calling backend API: ${API_BASE_URL}/auth/check-user`);
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      console.log('Backend response status:', res.status);
      
      let data;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
          console.log('Backend response data:', data);
        } else {
          const text = await res.text();
          console.error('Non-JSON response received:', text);
          throw new Error('Invalid response format from server');
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return NextResponse.json(
          { message: 'Error processing server response' },
          { status: 500 }
        );
      }

      if (!res.ok) {
        return NextResponse.json(
          { message: data?.message || 'User not found' },
          { status: res.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { message: 'Failed to connect to server' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Check user error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to check user' },
      { status: 500 }
    );
  }
}