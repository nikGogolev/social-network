import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAuth } from './api/api';
import { STATUSES } from 'common/constants';

export const config = {
  matcher: ['/users', '/users/:path*', '/friends', '/messages', '/photos'],
};

function readCookie(request: NextRequest, name: string): string | undefined {
  const fromStore = request.cookies.get(name)?.value;
  if (fromStore) {
    return fromStore;
  }

  const raw = request.headers.get('cookie');
  if (!raw) {
    return undefined;
  }

  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) {
      try {
        return decodeURIComponent(rest.join('='));
      } catch {
        return rest.join('=');
      }
    }
  }
  return undefined;
}

export async function middleware(request: NextRequest) {
  const email = readCookie(request, 'email');
  const token = readCookie(request, 'token');

  if (!email || !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const res = await checkAuth({ email, token });

  if (
    !res ||
    res.error ||
    res.status === STATUSES.NOT_AUTHORIZED ||
    res.status === STATUSES.INTERNAL_ERROR
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (res.status === STATUSES.USER_NOT_EXIST) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  return NextResponse.next();
}
