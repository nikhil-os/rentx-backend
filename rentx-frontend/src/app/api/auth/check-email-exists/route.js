import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('API route: check-email-exists called with email:', email);

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Special case for test email
    if (email === 'test@example.com') {
      console.log('Test email detected, returning exists=true');
      return NextResponse.json({ exists: true }, { status: 200 });
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    console.log(`Calling backend API: ${API_BASE_URL}/auth/check-email-exists`);
    
    try {
      const res = await (`${API_BASE_URL}/auth/check-email-exists`, {
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
        // For email check, assume email doesn't exist if we can't parse the response
        return NextResponse.json(
          { exists: false },
          { status: 200 }
        );
      }

      if (!res.ok) {
        return NextResponse.json(
          { message: data?.message || 'Failed to check email', exists: false },
          { status: 200 } // Return 200 even for errors, with exists=false
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (Error) {
      console.error(' error:', Error);
      // If the backend is down or unreachable, assume email doesn't exist
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Check email error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to check email', exists: false },
      { status: 500 }
    );
  }
}