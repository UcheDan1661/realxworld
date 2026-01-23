import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';

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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

      const user = await createUser(email, password, name, role || 'buyer');

      if (!user) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { 
          message: 'User created successfully', 
          user,
          // Include database info for debugging
          debug: {
            database: process.env.MONGODB_ATLAS_URL ? 'Atlas' : 'Local',
            collection: 'users'
          }
        },
        { status: 201 }
      );
  } catch (error) {
    console.error('Signup route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

