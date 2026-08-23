import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { processOfflineSyncQueue } from '@/server/field';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { actions, engineerPersonId, deviceId } = body;

  if (!actions || !Array.isArray(actions)) {
    return NextResponse.json({ error: 'actions array required' }, { status: 400 });
  }

  // Security: engineer can only sync their own actions
  if (engineerPersonId && engineerPersonId !== session.personId) {
    return NextResponse.json({ error: 'Forbidden: cannot sync actions for another engineer' }, { status: 403 });
  }

  const result = await processOfflineSyncQueue(
    actions,
    session.personId,
    deviceId || 'unknown',
    session
  );

  return NextResponse.json(result);
}
