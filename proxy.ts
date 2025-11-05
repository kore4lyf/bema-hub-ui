import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes are protected (require authentication)
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/campaigns',
];

// Define which routes are auth-only (accessible only when NOT authenticated)
const authOnlyRoutes = [
  '/signin',
  '/signup',
  '/reset-password'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is auth-only
  const isAuthOnlyRoute = authOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // For more precise control, we would need to decode the JWT token to check email verification status
  // But for now, we'll modify the logic to be more specific about which signup routes to protect
  
  // Redirect authenticated users away from auth-only routes, but allow access to verification page
  if (isAuthOnlyRoute && isAuthenticated && !pathname.startsWith('/signup/verify')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/events/:path*',
    '/campaigns/:path*',
    '/leaderboard/:path*',
    '/signin',
    '/signup/:path*',
    '/(auth)/reset-password/:path*',
    '/blog/create',
    '/blog/edit',
    '/blog/manage',
  ]
};