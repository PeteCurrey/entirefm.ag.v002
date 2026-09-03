import { NextResponse } from 'next/server';
import { updateMemberPassword } from '@/server/member/member-store';
import { verifyMemberVerificationToken } from '@/server/member/verification';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { logSecurityEvent } from '@/server/security/security-logger';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Rate Limiting
  const ipCheck = checkRateLimit(`reset_pw:${clientIp}`, RATE_LIMITS.RESET_PASSWORD);
  if (!ipCheck.allowed) {
    await logSecurityEvent({
      eventType: 'PASSWORD_RESET_RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      details: {
        endpoint: '/api/member/reset-password',
        retryAfterSeconds: ipCheck.retryAfterSeconds,
      },
    });

    return NextResponse.json(
      { error: 'Too many password reset attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(ipCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { token, password } = body;

    // 2. Mandatory Token Validation
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { error: 'A valid password reset token is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    // 3. Cryptographic Token Verification
    const verified = verifyMemberVerificationToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Password reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 4. Update Password in Identity Store
    const result = await updateMemberPassword(verified.email, password);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Unable to update password. Please try again or request a new reset link.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated.',
    });
  } catch (err: any) {
    console.error('[RESET_PASSWORD_ERROR]', err);
    return NextResponse.json(
      { error: 'Unable to reset password. Please try again later.' },
      { status: 500 }
    );
  }
}
