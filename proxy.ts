import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes are protected (require authentication)
const protectedRoutes = [
  '/hub',
  '/dashboard',
  '/profile',
  '/campaigns',
  '/leaderboard',
  '/blog/create',
  '/blog/edit',
  '/blog/manage',
  '/campaigns/create',
];

// Define which routes are auth-only (accessible only when NOT authenticated)
const authOnlyRoutes = [
  '/signin',
  '/signup',
  '/reset-password'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth data from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // Handle root path - redirect based on auth status
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/hub', request.url));
    }
    return NextResponse.next();
  }
  
  // Special handling for /signup/verify
  if (pathname.startsWith('/signup/verify')) {
    // Allow access regardless of auth status - page will handle redirects
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is auth-only
  const isAuthOnlyRoute = authOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Redirect authenticated users away from auth-only routes
  if (isAuthOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/hub', request.url));
  }
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/hub/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/campaigns/:path*',
    '/leaderboard/:path*',
    '/signin',
    '/signup/:path*',
    '/(auth)/reset-password/:path*',
    '/blog/create',
    '/blog/edit/:path*',
    '/blog/manage',
    '/campaigns/create',
  ]
};
