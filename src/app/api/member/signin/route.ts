import { NextResponse } from 'next/server';
import { authenticateMemberCredentials } from '@/server/member/member-store';
import { createMemberSessionToken, MEMBER_COOKIE_NAME } from '@/server/member/member-session';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email address and password.' },
        { status: 400 }
      );
    }

    const authResult = await authenticateMemberCredentials(email, password);

    if (!authResult.success || !authResult.member) {
      return NextResponse.json(
        { error: authResult.error || 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    const member = authResult.member;
    const duration = rememberMe ? 1000 * 60 * 60 * 24 * 60 : 1000 * 60 * 60 * 24 * 7;
    const token = createMemberSessionToken(member, duration);

    const response = NextResponse.json({
      success: true,
      member: {
        id: member.id,
        displayName: member.display_name,
        email: member.email,
        username: member.username,
        avatarUrl: member.avatar_url,
      },
      redirectUrl: '/member/profile',
    });

    response.cookies.set(MEMBER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(duration / 1000),
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during sign in.' },
      { status: 500 }
    );
  }
}
