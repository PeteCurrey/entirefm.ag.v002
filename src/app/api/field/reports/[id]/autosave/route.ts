import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getReportInstanceById,
  saveReportResponses,
  saveRepeatableRows,
  canUserEditReport,
} from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const editCheck = canUserEditReport(session, pack.instance);
    if (!editCheck.allowed) {
      return NextResponse.json({ error: editCheck.reason || 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { responses, repeatableRows } = body;

    let updatedResponseCount = 0;
    if (responses && Array.isArray(responses) && responses.length > 0) {
      const res = await saveReportResponses(id, responses);
      updatedResponseCount = res.updatedCount;
    }

    if (repeatableRows && typeof repeatableRows === 'object') {
      for (const [sectionKey, rows] of Object.entries(repeatableRows)) {
        if (Array.isArray(rows)) {
          await saveRepeatableRows(id, sectionKey, rows as any[]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
      updatedResponseCount,
    });
  } catch (err: any) {
    console.error('[API /api/field/reports/[id]/autosave Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
