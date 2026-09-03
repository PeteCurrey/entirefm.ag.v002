/**
 * POST /api/member/resend-verification
 * =====================================
 * Resends Lobby Member email verification link with rate-limiting and anti-enumeration.
 */

import { NextResponse } from 'next/server';
import { getMemberByEmail } from '@/server/member/member-store';
import {
  createMemberVerificationToken,
  sendMemberVerificationEmail,
  checkVerificationRateLimit,
} from '@/server/member/verification';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { logSecurityEvent } from '@/server/security/security-logger';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Rate Limiting (prevents email bombing across multiple addresses)
  const ipCheck = checkRateLimit(`resend_vf:${clientIp}`, RATE_LIMITS.RESEND_VERIFICATION);
  if (!ipCheck.allowed) {
    await logSecurityEvent({
      eventType: 'VERIFICATION_RESEND_RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      details: {
        endpoint: '/api/member/resend-verification',
        retryAfterSeconds: ipCheck.retryAfterSeconds,
      },
    });

    return NextResponse.json(
      { error: 'Too many verification email requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(ipCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body as { email?: string };

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid work email address.' },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();

    // 2. Server-side email cooldown check (60s cooldown per email address)
    const rateCheck = checkVerificationRateLimit(`resend_${emailClean}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${rateCheck.remainingSeconds} seconds before requesting another email.`,
          cooldownRemaining: rateCheck.remainingSeconds,
        },
        { status: 429 }
      );
    }

    const member = await getMemberByEmail(emailClean);

    if (member && member.member_status === 'pending_verification') {
      const token = createMemberVerificationToken(member.id, member.email);
      const host = request.headers.get('host') || 'localhost:3000';
      const proto = request.headers.get('x-forwarded-proto') || 'http';
      const verificationUrl = `${proto}://${host}/api/member/verify?token=${encodeURIComponent(token)}`;

      await sendMemberVerificationEmail(member.email, member.first_name, verificationUrl);
    }

    // Always return generic success to prevent account enumeration
    return NextResponse.json({
      success: true,
      message: 'If a pending Member account exists for this address, a new verification link has been sent.',
    });
  } catch (err: any) {
    console.error('[RESEND_VERIFICATION_ERROR]', err);
    return NextResponse.json(
      { error: 'Unable to process verification request. Please try again later.' },
      { status: 500 }
    );
  }
}
