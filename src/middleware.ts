import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/types/auth';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
  });

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect agent-only routes
  if (pathname.startsWith('/agent')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    const userRole = token.role as UserRole;
    if (userRole !== 'agent' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect admin-only routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    const userRole = token.role as UserRole;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/agent/:path*',
    '/admin/:path*',
    '/signin',
    '/signup',
  ],
};
