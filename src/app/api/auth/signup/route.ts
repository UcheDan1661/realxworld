import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';

const ALLOWED_ROLES = ['buyer', 'seller', 'agent'] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const safeRole = role && ALLOWED_ROLES.includes(role) ? role : 'buyer';

    const user = await createUser(email, password, name, safeRole);

    if (!user) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in or use a different email.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup route error:', error);
    return NextResponse.json(
      { error: 'Unable to create account. Please try again or use a different email.' },
      { status: 500 }
    );
  }
}

