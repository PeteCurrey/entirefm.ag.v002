import { NextResponse } from 'next/server';
import { markNotificationRead, markAllNotificationsRead } from '@/server/notifications';
import { NotificationCategory } from '@/server/notifications/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, all, category } = body;

    if (all) {
      await markAllNotificationsRead((category as NotificationCategory) || undefined);
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Notification ID required' }, { status: 400 });
    }

    await markNotificationRead(id);
    return NextResponse.json({ success: true, id, message: 'Notification marked as read' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notification state' },
      { status: 500 }
    );
  }
}
