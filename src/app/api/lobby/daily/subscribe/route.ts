import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber, checkSuppression } from '@/server/newsletter/store';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/server/security/rate-limiter';
import { checkHoneypot, HONEYPOT_FIELD_NAME } from '@/server/security/honeypot';
import { checkEmailDomain } from '@/server/security/disposable-email';

const SubscribeDailySchema = z.object({
  email: z.string().email('Please enter a valid work email address').max(254),
  firstName: z.string().max(100).optional().default(''),
  company: z.string().max(120).optional().default(''),
  role: z.string().max(100).optional().default(''),
  preferences: z.array(z.string().max(50)).optional().default(['DAILY_LOBBY']),
  signupPage: z.string().max(300).optional().default('/lobby'),
  utmSource: z.string().max(100).optional().default('lobby_signup'),
  utmMedium: z.string().max(100).optional().default('organic'),
  utmCampaign: z.string().max(100).optional().default('the_lobby_daily_signup'),
  [HONEYPOT_FIELD_NAME]: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // 1. Rate limiting check
    const rateCheck = checkRateLimit(`lobby-daily:${clientIp}`, RATE_LIMITS.NEWSLETTER);
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
      return NextResponse.json({ success: true, message: 'Subscribed to The Lobby Daily.' });
    }

    const result = SubscribeDailySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, firstName, company, role, preferences, signupPage, utmSource, utmMedium, utmCampaign } =
      result.data;

    // 3. Disposable email check
    const domainCheck = checkEmailDomain(email);
    if (domainCheck.isDisposable) {
      return NextResponse.json(
        { error: 'Please enter a valid corporate or professional email address.' },
        { status: 400 }
      );
    }

    // Check suppression list first
    const isSuppressed = await checkSuppression(email);
    if (isSuppressed) {
      return NextResponse.json(
        { error: 'This email address is currently unsubscribed or suppressed.' },
        { status: 400 }
      );
    }

    const { created, error } = await addSubscriber({
      email,
      firstName,
      company,
      role,
      status: 'ACTIVE',
      consentSource: signupPage,
      consentTextVersion: '2026-LOBBY-DAILY-V1',
      consentedAt: new Date().toISOString(),
      signupPage,
      utmSource,
      utmMedium,
      utmCampaign,
      interests: preferences,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      created,
      message: created
        ? 'You are now subscribed to The Lobby Daily edition.'
        : 'Your subscription preferences have been updated.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
