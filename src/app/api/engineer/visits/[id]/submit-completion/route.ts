import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { generateDraftServiceReport, saveDraftServiceReport, submitServiceReport } from '@/server/field';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await context.params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // optional body
  }

  const { signaturePath, signatoryName, signatoryOrganisation } = body;

  // Generate or fetch draft service report
  const draftResult = await generateDraftServiceReport(id, session);
  if (!draftResult.report) {
    return NextResponse.json({ error: draftResult.error || 'Failed to generate report' }, { status: 400 });
  }

  const reportIdResult = await saveDraftServiceReport(
    { ...draftResult.report, visitId: id },
    session
  );

  if (!reportIdResult.id) {
    return NextResponse.json({ error: reportIdResult.error || 'Failed to save report' }, { status: 400 });
  }

  const submitResult = await submitServiceReport(
    id,
    reportIdResult.id,
    signaturePath || null,
    signatoryName || null,
    signatoryOrganisation || null,
    session
  );

  if (!submitResult.success) {
    return NextResponse.json({ error: submitResult.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, reportId: reportIdResult.id });
}
