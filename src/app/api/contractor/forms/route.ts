import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listSubmittedForms, submitDigitalForm } from '@/server/contractor/digital-forms-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get('orgId') || session.orgId;
  const category = request.nextUrl.searchParams.get('category') || 'ALL';
  const workOrderId = request.nextUrl.searchParams.get('workOrderId') || undefined;
  const searchQuery = request.nextUrl.searchParams.get('q') || undefined;

  try {
    const forms = await listSubmittedForms(orgId, session, { category, workOrderId, searchQuery });
    return NextResponse.json({ forms });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Access denied' }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { templateId, workOrderId, workOrderNumber, visitId, formData, evidenceUrls, signatureData } = body;
  if (!templateId || !formData) {
    return NextResponse.json({ error: 'templateId and formData are required' }, { status: 400 });
  }

  const contractorOrgId = body.contractorOrgId || session.orgId;

  const result = await submitDigitalForm(
    {
      templateId,
      workOrderId,
      workOrderNumber,
      visitId,
      contractorOrgId,
      formData,
      evidenceUrls,
      signatureData,
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Submission failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
