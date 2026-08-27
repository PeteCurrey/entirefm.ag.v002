import { NextResponse } from 'next/server';
import { getMemberNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/server/member/member-notifications';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const result = getMemberNotifications(session.memberId);
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { notificationId, markAll } = body;

  if (markAll) {
    markAllNotificationsAsRead(session.memberId);
    return NextResponse.json({ success: true });
  }

  if (notificationId) {
    const success = markNotificationAsRead(notificationId, session.memberId);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
