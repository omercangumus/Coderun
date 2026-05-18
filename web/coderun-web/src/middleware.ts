import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

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

  // /admin route koruması — is_superuser kontrolü
  // Not: JWT payload'ından is_superuser okumak için token decode gerekir.
  // Middleware'de tam decode yapamayız (edge runtime), bu yüzden
  // admin sayfaları client-side'da da kontrol eder.
  // Burada sadece token varlığını kontrol ediyoruz; superuser kontrolü
  // admin layout'ta client-side yapılır.
  if (pathname.startsWith('/admin') && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('reason', 'admin_required');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
