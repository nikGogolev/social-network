import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAuth } from './api/api';
import { STATUSES } from 'common/constants';

export const config = {
  matcher: ['/users', '/users/:id*', '/friends', '/messages', '/photos'],
};

export async function middleware(request: NextRequest) {
  const email = request.cookies.get('email')?.value;
  const token = request.cookies.get('token')?.value;

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
}
