import { NextResponse } from 'next/server';
import { createMember } from '@/server/member/member-store';
import { createMemberVerificationToken, sendMemberVerificationEmail } from '@/server/member/verification';
import { sendAdminSignupAlert } from '@/server/notifications/admin-alert';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { verifyTurnstileToken } from '@/server/security/turnstile';
import { assessRegistrationRisk } from '@/server/security/risk-scorer';
import { logSecurityEvent } from '@/server/security/security-logger';
import { HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal = local.length > 2
    ? `${local[0]}••••${local[local.length - 1]}`
    : `${local[0] || '•'}••••`;
  return `${maskedLocal}@${domain}`;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  // 1. IP-Based Rate Limiting
  const rateLimitResult = checkRateLimit(`register:${clientIp}`, RATE_LIMITS.REGISTER);
  if (!rateLimitResult.allowed) {
    await logSecurityEvent({
      eventType: 'RATE_LIMITED',
      ipAddress: clientIp,
      userAgent,
      details: {
        endpoint: '/api/member/register',
        retryAfterSeconds: rateLimitResult.retryAfterSeconds,
      },
    });

    return NextResponse.json(
      { error: 'Too many registration requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfterSeconds),
        },
      }
    );
  }

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
      turnstile_token,
      turnstileToken,
      [HONEYPOT_FIELD_NAME]: honeypotValue,
      fill_duration_ms,
    } = body;

    const emailClean = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const token = turnstile_token || turnstileToken;
    const formElapsedSeconds = typeof fill_duration_ms === 'number' ? fill_duration_ms / 1000 : undefined;

    // 2. Strict Input Format Validation
    if (!first_name || typeof first_name !== 'string' || first_name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid first name.' }, { status: 400 });
    }

    if (!last_name || typeof last_name !== 'string' || last_name.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide a valid last name.' }, { status: 400 });
    }

    if (!emailClean || !emailClean.includes('@') || emailClean.length > 254) {
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

    // 3. Server-Side Turnstile Token Validation
    const turnstileResult = await verifyTurnstileToken(token, clientIp);

    // 4. Layered Risk Assessment (Turnstile + Honeypot + Disposable Email + UA + Velocity)
    const risk = assessRegistrationRisk({
      email: emailClean,
      turnstileResult,
      honeypotValue,
      userAgent,
      formElapsedSeconds,
    });

    // 5. Action on Elevated Risk
    if (risk.shouldBlock) {
      let eventType: any = 'REGISTRATION_BLOCKED';
      if (risk.flags.includes('HONEYPOT_TRIGGERED')) eventType = 'HONEYPOT_TRIGGERED';
      else if (risk.flags.includes('TURNSTILE_FAILED')) eventType = 'TURNSTILE_FAILED';
      else if (risk.flags.includes('DISPOSABLE_EMAIL')) eventType = 'DISPOSABLE_EMAIL_BLOCKED';

      await logSecurityEvent({
        eventType,
        ipAddress: clientIp,
        userAgent,
        email: emailClean,
        riskScore: risk.score,
        details: {
          flags: risk.flags,
          blockReason: risk.blockReason,
        },
      });

      // Reject without revealing internal detection specifics
      const genericMsg = risk.flags.includes('TURNSTILE_FAILED')
        ? 'Security verification was not completed. Please refresh and try again.'
        : 'Registration could not be completed at this time. Please contact community@entirefm.com if you require assistance.';

      return NextResponse.json({ error: genericMsg }, { status: 400 });
    }

    // 6. Attempt Member Creation
    let newMember;
    try {
      newMember = await createMember({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: emailClean,
        password,
        company: company ? String(company).trim() : undefined,
        job_title: job_title ? String(job_title).trim() : undefined,
        termsVersion: '2026.1',
        privacyVersion: '2026.1',
        marketingConsent: Boolean(marketing_consent),
        ipAddress: clientIp,
        userAgent,
        riskScore: risk.score,
        securityFlags: risk.flags,
      });
    } catch (createErr: any) {
      const errMsg = (createErr?.message || '').toLowerCase();
      const isDuplicate =
        errMsg.includes('already registered') ||
        errMsg.includes('already exists') ||
        errMsg.includes('unique constraint') ||
        errMsg.includes('sign in instead');

      if (isDuplicate) {
        // Anti-enumeration: Log security event but return generic success so
        // registration endpoint cannot be used to harvest existing email addresses.
        await logSecurityEvent({
          eventType: 'SUSPICIOUS_REGISTRATION',
          ipAddress: clientIp,
          userAgent,
          email: emailClean,
          riskScore: 35,
          details: { reason: 'Duplicate registration attempt suppressed' },
        });

        const masked = maskEmail(emailClean);
        return NextResponse.json({
          success: true,
          pendingVerification: true,
          email: masked,
          redirectUrl: `/verify-email?email=${encodeURIComponent(masked)}&raw=${encodeURIComponent(emailClean)}`,
        });
      }

      // Re-throw genuine system/database errors to be caught below
      throw createErr;
    }

    // 7. Generate Signed Verification Token
    const verificationToken = createMemberVerificationToken(newMember.id, newMember.email);

    // Build canonical verification URL
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const verificationUrl = `${proto}://${host}/api/member/verify?token=${encodeURIComponent(verificationToken)}`;

    // Dispatch branded verification email
    await sendMemberVerificationEmail(newMember.email, newMember.first_name, verificationUrl);

    // 8. Log Success Security Event
    await logSecurityEvent({
      eventType: 'REGISTRATION_SUCCESSFUL',
      ipAddress: clientIp,
      userAgent,
      email: newMember.email,
      memberId: newMember.id,
      authUserId: newMember.auth_user_id,
      riskScore: risk.score,
      details: {
        flags: risk.flags,
        marketingConsent: Boolean(marketing_consent),
      },
    });

    // 9. Dispatch Admin Notification (asynchronously)
    sendAdminSignupAlert({
      type: 'LOBBY_MEMBER_JOINED',
      name: `${first_name} ${last_name}`.trim(),
      email: newMember.email,
      company: company || 'Independent',
      roleOrTrade: job_title || 'Facilities Professional',
      referenceId: newMember.id,
      actionUrl: '/admin/lobby',
      details: {
        Company: company || 'Not specified',
        'Job Title': job_title || 'Not specified',
        'Marketing Consent': marketing_consent ? 'Opted In' : 'No',
        'Risk Score': String(risk.score),
      },
    }).catch((err) => console.error('[ADMIN_ALERT_ERROR: Member Joined]', err));

    const masked = maskEmail(newMember.email);

    return NextResponse.json({
      success: true,
      pendingVerification: true,
      email: masked,
      redirectUrl: `/verify-email?email=${encodeURIComponent(masked)}&raw=${encodeURIComponent(newMember.email)}`,
    });
  } catch (err: any) {
    console.error('[REGISTRATION_ERROR]', err);
    // Never leak database errors or internal stack traces to the client
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
