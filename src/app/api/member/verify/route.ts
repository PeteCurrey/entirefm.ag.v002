/**
 * GET /api/member/verify
 * =======================
 * Canonical Lobby Member Email Verification Callback Endpoint.
 * Validates HMAC token, activates the member account, sets session cookie,
 * and redirects to onboarding.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifyMemberVerificationToken } from '@/server/member/verification';
import { getMemberById, activateMember } from '@/server/member/member-store';
import { createMemberSessionToken, MEMBER_COOKIE_NAME } from '@/server/member/member-session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;

  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=missing_token', baseUrl));
  }

  const payload = verifyMemberVerificationToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid_or_expired', baseUrl));
  }

  const member = await getMemberById(payload.memberId);
  if (!member) {
    return NextResponse.redirect(new URL('/verify-email?error=account_not_found', baseUrl));
  }

  // If already active, issue session and redirect to profile gracefully
  if (member.member_status === 'active') {
    const sessionToken = createMemberSessionToken(member);
    const res = NextResponse.redirect(new URL('/member/profile', baseUrl));
    res.cookies.set(MEMBER_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  // Activate member account
  const activatedMember = await activateMember(member.id);
  if (!activatedMember) {
    return NextResponse.redirect(new URL('/verify-email?error=activation_failed', baseUrl));
  }

  const sessionToken = createMemberSessionToken(activatedMember);
  const res = NextResponse.redirect(new URL('/member/onboarding', baseUrl));
  res.cookies.set(MEMBER_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return res;
}
