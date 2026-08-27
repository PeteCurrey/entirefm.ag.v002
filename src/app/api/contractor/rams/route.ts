import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listRamsRecords, createRamsRecord } from '@/server/contractor/rams-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get('orgId') || session.orgId;
  const status = request.nextUrl.searchParams.get('status') || 'ALL';
  const searchQuery = request.nextUrl.searchParams.get('q') || undefined;

  try {
    const list = await listRamsRecords(orgId, session, { status, searchQuery });
    return NextResponse.json({ rams: list });
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

  const {
    title,
    clientName,
    siteName,
    siteAddress,
    workCategory,
    workScopeDescription,
    plannedStartDate,
    plannedEndDate,
    workingHours,
    workOrderId,
    workOrderNumber,
    responsibleSupervisorId,
    responsibleSupervisorName,
    assignedOperativeIds,
    isIndependentRams,
    buildingType,
    occupancyState,
  } = body;

  if (!title || !siteName || !workCategory || !workScopeDescription) {
    return NextResponse.json({ error: 'Missing mandatory RAMS fields' }, { status: 400 });
  }

  const contractorOrgId = body.contractorOrgId || session.orgId;

  const result = await createRamsRecord(
    {
      contractorOrgId,
      workOrderId,
      workOrderNumber,
      clientName: clientName || 'Client Organisation',
      siteName,
      siteAddress,
      title,
      workCategory,
      workScopeDescription,
      plannedStartDate: plannedStartDate || new Date().toISOString().split('T')[0],
      plannedEndDate,
      workingHours,
      responsibleSupervisorId,
      responsibleSupervisorName,
      assignedOperativeIds,
      isIndependentRams,
      buildingType,
      occupancyState,
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to create RAMS' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
