import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber, listSubscribers, checkSuppression } from '@/server/newsletter/store';

const SubscribeSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  firstName: z.string().optional().default(''),
  company: z.string().optional().default(''),
  role: z.string().optional().default(''),
  consentTextVersion: z.string().optional().default('2026-V1'),
  signupPage: z.string().optional().default('/fm-briefing'),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  interests: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { subscriber, created, error } = await addSubscriber({
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const data = await listSubscribers({ status, limit, offset });
  return NextResponse.json(data);
}
