import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface IRoutes {
  [key: string]: boolean;
}

const publicOnlyUrls: IRoutes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
  '/github/start': true,
  '/github/complete': true,
  '/kakao/start': true,
  '/kakao/complete': true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
