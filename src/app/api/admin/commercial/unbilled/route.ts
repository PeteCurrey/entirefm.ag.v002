import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listUnbilledCompletedWork } from '@/server/commercial';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const unbilled = await listUnbilledCompletedWork(session);
  return NextResponse.json({ data: unbilled });
}
