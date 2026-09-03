import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listEligibleInternalEngineers } from '@/server/work/engineers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const engineers = await listEligibleInternalEngineers();
    return NextResponse.json({ success: true, engineers });
  } catch (err: any) {
    console.error('[ADMIN_ENGINEERS_GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve engineers' }, { status: 500 });
  }
}
