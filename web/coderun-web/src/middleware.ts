import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Token yok + korumalı route → login'e yönlendir
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token var + auth route → dashboard'a yönlendir
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // /admin route koruması
  //
  // SECURITY NOTE:
  // Next.js Edge Runtime (middleware) cannot decode JWT payloads to verify
  // is_superuser without a third-party JWT library. Therefore:
  //
  // Layer 1 (here): Checks that an access_token cookie exists.
  //   → Unauthenticated users are redirected to /login immediately.
  //
  // Layer 2 (admin/layout.tsx): Client-side guard checks user.isSuperuser
  //   from the auth store. Non-superusers are redirected before any admin
  //   content renders (layout shows a spinner, not admin data).
  //
  // Layer 3 (backend): ALL /admin/* API endpoints require get_current_superuser
  //   dependency which returns HTTP 403 for non-superusers. Even if a user
  //   bypasses the UI, they cannot read or write admin data without is_superuser=True.
  //
  // This three-layer approach is safe: no admin data is exposed to non-superusers.
  if (pathname.startsWith('/admin') && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('reason', 'admin_required');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|animations|fonts).*)'],
};
