import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getReportInstanceById, canUserAccessReport } from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    const pack = await getReportInstanceById(id);
    if (!pack) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const authCheck = canUserAccessReport(session, pack.instance);
    if (!authCheck.allowed) {
      return NextResponse.json({ error: authCheck.reason || 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, pack });
  } catch (err: any) {
    console.error('[API /api/field/reports/[id] GET Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
