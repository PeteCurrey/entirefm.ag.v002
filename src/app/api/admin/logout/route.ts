/** Clears the admin session cookie and returns to the sign-in screen. */
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/leads/auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
