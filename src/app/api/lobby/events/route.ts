import { NextResponse } from 'next/server';
import { getLobbyEvents } from '@/server/events/event-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationType = searchParams.get('locationType') || undefined;
  const topic = searchParams.get('topic') || undefined;

  const events = getLobbyEvents({ locationType, topic });
  return NextResponse.json({ events });
}
