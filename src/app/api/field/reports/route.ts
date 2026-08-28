import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { createReportInstance, listReportTemplates } from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { templateCode, siteId, organisationId, workOrderId, visitId, clientAccountId, title } = body;

    if (!templateCode || !siteId) {
      return NextResponse.json({ error: 'templateCode and siteId are required' }, { status: 400 });
    }

    const effectiveOrgId = organisationId || session.orgId || 'org-entirefm';

    const instance = await createReportInstance({
      templateCode,
      siteId,
      organisationId: effectiveOrgId,
      workOrderId: workOrderId || null,
      visitId: visitId || null,
      clientAccountId: clientAccountId || null,
      assignedEngineerId: session.personId || null,
      createdById: session.personId || null,
      title: title || undefined,
    });

    return NextResponse.json({ success: true, instance });
  } catch (err: any) {
    console.error('[API /api/field/reports POST Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const templates = await listReportTemplates();
    return NextResponse.json({ success: true, templates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
