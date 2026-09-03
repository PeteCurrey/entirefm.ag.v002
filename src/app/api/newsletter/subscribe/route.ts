import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber } from '@/server/newsletter/store';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { checkHoneypot, HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';
import { checkEmailDomain } from '@/server/security/disposable-email';

const SubscribeSchema = z.object({
  email: z.string().email('Please enter a valid work email address').max(254),
  firstName: z.string().max(100).optional().default(''),
  company: z.string().max(120).optional().default(''),
  role: z.string().max(100).optional().default(''),
  consentTextVersion: z.string().max(50).optional().default('2026-V1'),
  signupPage: z.string().max(300).optional().default('/fm-briefing'),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  utmTerm: z.string().max(100).optional(),
  utmContent: z.string().max(100).optional(),
  interests: z.array(z.string().max(100)).optional().default([]),
  [HONEYPOT_FIELD_NAME]: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP rate limit check
    const rateCheck = checkRateLimit(`newsletter:${clientIp}`, RATE_LIMITS.NEWSLETTER);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many subscription requests from your connection. Please wait.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // 2. Honeypot check
    const honeypot = checkHoneypot(body[HONEYPOT_FIELD_NAME]);
    if (honeypot.triggered) {
      return NextResponse.json({ success: true, message: 'Subscription preferences updated.' });
    }

    const result = SubscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    // 3. Disposable email check
    const domainCheck = checkEmailDomain(result.data.email);
    if (domainCheck.isDisposable) {
      return NextResponse.json(
        { error: 'Please use a valid corporate or permanent email address.' },
        { status: 400 }
      );
    }

    const { created, error } = await addSubscriber({
      email: result.data.email,
      firstName: result.data.firstName,
      company: result.data.company,
      role: result.data.role,
      status: 'ACTIVE',
      consentSource: result.data.signupPage,
      consentTextVersion: result.data.consentTextVersion,
      consentedAt: new Date().toISOString(),
      signupPage: result.data.signupPage,
      utmSource: result.data.utmSource,
      utmMedium: result.data.utmMedium,
      utmCampaign: result.data.utmCampaign,
      utmTerm: result.data.utmTerm,
      utmContent: result.data.utmContent,
      interests: result.data.interests,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      created,
      message: created
        ? 'Thank you for subscribing to The FM Briefing.'
        : 'Your subscription preferences have been updated.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
