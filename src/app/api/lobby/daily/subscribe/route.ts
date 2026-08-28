import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber, checkSuppression } from '@/server/newsletter/store';

const SubscribeDailySchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  firstName: z.string().optional().default(''),
  company: z.string().optional().default(''),
  role: z.string().optional().default(''),
  preferences: z.array(z.string()).optional().default(['DAILY_LOBBY']),
  signupPage: z.string().optional().default('/lobby'),
  utmSource: z.string().optional().default('lobby_signup'),
  utmMedium: z.string().optional().default('organic'),
  utmCampaign: z.string().optional().default('the_lobby_daily_signup'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = SubscribeDailySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, firstName, company, role, preferences, signupPage, utmSource, utmMedium, utmCampaign } =
      result.data;

    // Check suppression list first
    const isSuppressed = await checkSuppression(email);
    if (isSuppressed) {
      return NextResponse.json(
        { error: 'This email address is currently unsubscribed or suppressed.' },
        { status: 400 }
      );
    }

    const { subscriber, created, error } = await addSubscriber({
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
      message: 'You are confirmed for The Lobby Daily executive intelligence briefing.',
      preferences,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
