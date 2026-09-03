import { NextResponse } from 'next/server';
import { getMemberByEmail } from '@/server/member/member-store';
import {
  createMemberVerificationToken,
  sendMemberPasswordResetEmail,
  checkVerificationRateLimit,
} from '@/server/member/verification';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { logSecurityEvent } from '@/server/security/security-logger';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Rate Limiting
  const ipCheck = checkRateLimit(`forgot_pw:${clientIp}`, RATE_LIMITS.FORGOT_PASSWORD);
  if (!ipCheck.allowed) {
    await logSecurityEvent({
      eventType: 'PASSWORD_RESET_RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      details: {
        endpoint: '/api/member/forgot-password',
        retryAfterSeconds: ipCheck.retryAfterSeconds,
      },
    });

    return NextResponse.json(
      { error: 'Too many password reset requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(ipCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const emailClean = email.trim().toLowerCase();

    // 2. Email-based throttling (60s cooldown per email)
    const emailCheck = checkVerificationRateLimit(`pw_reset_${emailClean}`);
    if (!emailCheck.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${emailCheck.remainingSeconds} seconds before requesting another reset link.`,
          cooldownRemaining: emailCheck.remainingSeconds,
        },
        { status: 429 }
      );
    }

    // 3. Find member (silently proceed if not found to prevent enumeration)
    const member = await getMemberByEmail(emailClean);

    if (member && member.member_status !== 'deleted' && member.member_status !== 'banned') {
      const token = createMemberVerificationToken(member.id, member.email);
      const host = request.headers.get('host') || 'localhost:3000';
      const proto = request.headers.get('x-forwarded-proto') || 'http';
      const resetUrl = `${proto}://${host}/reset-password?token=${encodeURIComponent(token)}`;

      await sendMemberPasswordResetEmail(member.email, member.first_name, resetUrl);
    }

    // 4. Always return generic privacy-preserving response
    return NextResponse.json({
      success: true,
      message:
        'If an account exists with this email address, password reset instructions have been dispatched.',
    });
  } catch (err: any) {
    console.error('[FORGOT_PASSWORD_ERROR]', err);
    return NextResponse.json(
      { error: 'Unable to process password reset request. Please try again later.' },
      { status: 500 }
    );
  }
}
