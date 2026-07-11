import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (formerly Middleware in Next.js 15).
 * Protects paths: /internships/add, /internships/manage, and /dashboard.
 * 
 * NOTE: Runs in the Next.js Edge Runtime. Since the Edge Runtime does not
 * support native Node database drivers (like MongoDB), we must not import
 * the `auth` server instance directly here. Instead, we inspect the session cookie
 * and verify it dynamically by fetching the local auth API session endpoint.
 */
export async function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__secure-better-auth.session_token')?.value;

  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/internships/add', '/internships/manage', '/dashboard'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Call the Better Auth API endpoint to verify the session cookie is valid
      const sessionRes = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!sessionRes.ok) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const sessionData = await sessionRes.json();

      if (!sessionData || !sessionData.session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Session validation failed in proxy:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/internships/add', '/internships/manage', '/dashboard'],
};
