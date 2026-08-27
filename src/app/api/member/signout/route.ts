import { NextResponse } from 'next/server';
import { MEMBER_COOKIE_NAME } from '@/server/member/member-session';

export async function POST(request: Request) {
  const url = new URL('/lobby', request.url);
  const response = NextResponse.redirect(url, { status: 303 });

  response.cookies.set(MEMBER_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function GET(request: Request) {
  const url = new URL('/lobby', request.url);
  const response = NextResponse.redirect(url, { status: 303 });

  response.cookies.set(MEMBER_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
