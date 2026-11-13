import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, goal, message } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

    // Here you can easily connect Resend, Sendgrid, or a Database (Prisma/Supabase)
    console.log('[BOOKING RECEIVED]', {
      bookingId,
      name,
      email,
      rating,
      goal,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: 'Free consultation request successfully registered!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[BOOKING API ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing booking.' },
      { status: 500 }
    );
  }
}
