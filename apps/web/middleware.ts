import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAuth } from './api/api';
import { STATUSES } from 'common/constants';

export const config = {
  matcher: ['/users', '/users/:id*', '/friends', '/messages', '/photos'],
};

export async function middleware(request: NextRequest) {
  const email = request.cookies.get('email');
  const token = request.cookies.get('token');
  const res = await checkAuth({ email, token });
  if (res.status === STATUSES.NOT_AUTHORIZED) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (res.status === STATUSES.USER_NOT_EXIST) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }
}
