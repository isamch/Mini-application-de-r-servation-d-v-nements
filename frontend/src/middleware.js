import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if user is accessing protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check for token in cookies
    const token = request.cookies.get('token');
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};