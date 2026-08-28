import { NextResponse } from 'next/server';
import { updateMemberPassword } from '@/server/member/member-store';
import { verifyMemberVerificationToken } from '@/server/member/verification';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password } = body;

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    // If a signed token is provided, verify it
    if (token) {
      const verified = verifyMemberVerificationToken(token);
      if (!verified) {
        return NextResponse.json(
          { error: 'Password reset link is invalid or has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      await updateMemberPassword(verified.email, password);
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unable to reset password.' },
      { status: 500 }
    );
  }
}
