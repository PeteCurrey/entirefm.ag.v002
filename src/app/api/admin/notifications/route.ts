import { NextResponse } from 'next/server';
import { listNotifications, getNotificationCounts, createNotification, syncOperationalNotifications } from '@/server/notifications';
import { NotificationCategory } from '@/server/notifications/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') as NotificationCategory) || 'ALL';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const [notifications, counts] = await Promise.all([
      listNotifications({ category, unreadOnly, limit }),
      getNotificationCounts(),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadTotal: counts.unreadTotal,
      newLeadsCount: counts.newLeadsCount,
      unreadByCat: counts.unreadByCat,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notification = await createNotification(body);

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}
