import { NextResponse } from 'next/server';
import { createMember } from '@/server/member/member-store';
import { createMemberSessionToken, MEMBER_COOKIE_NAME } from '@/server/member/member-session';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      first_name,
      last_name,
      email,
      password,
      company,
      job_title,
      terms_accepted,
      privacy_acknowledged,
      marketing_consent,
    } = body;

    // Strict validation
    if (!first_name || typeof first_name !== 'string' || first_name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid first name.' }, { status: 400 });
    }

    if (!last_name || typeof last_name !== 'string' || last_name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid last name.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid work email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    if (!terms_accepted) {
      return NextResponse.json(
        { error: 'You must agree to the Terms of Use to create a Member account.' },
        { status: 400 }
      );
    }

    if (!privacy_acknowledged) {
      return NextResponse.json(
        { error: 'You must acknowledge the Privacy Notice to continue.' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const newMember = await createMember({
      first_name,
      last_name,
      email,
      password,
      company: company || undefined,
      job_title: job_title || undefined,
      termsVersion: '2026.1',
      privacyVersion: '2026.1',
      marketingConsent: Boolean(marketing_consent),
      ipAddress,
      userAgent,
    });

    const token = createMemberSessionToken(newMember);

    const response = NextResponse.json({
      success: true,
      member: {
        id: newMember.id,
        displayName: newMember.display_name,
        email: newMember.email,
        username: newMember.username,
      },
      redirectUrl: '/member/profile?welcome=1',
    });

    // Set secure HTTP-only member session cookie
    response.cookies.set(MEMBER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during registration.' },
      { status: 400 }
    );
  }
}
