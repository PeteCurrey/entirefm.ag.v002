import { NextResponse } from 'next/server';
import { unsubscribeByToken, getSubscriberByToken } from '@/server/newsletter/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 });
  }

  const sub = await getSubscriberByToken(token);
  if (!sub) {
    return NextResponse.json({ error: 'Invalid or expired unsubscribe token' }, { status: 404 });
  }

  return NextResponse.json({
    email: sub.email,
    status: sub.status,
    interests: sub.interests,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, reason } = body;

    if (!token) {
      return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 });
    }

    const res = await unsubscribeByToken(token, reason || 'User requested unsubscribe via web link');
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: res.email,
      message: 'You have been successfully unsubscribed from The FM Briefing.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
