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

export async function POST(request: Request) {
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

    // Server-side rate limit check (60s cooldown per email)
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
    return NextResponse.json(
      { error: err.message || 'Failed to process resend request.' },
      { status: 500 }
    );
  }
}
