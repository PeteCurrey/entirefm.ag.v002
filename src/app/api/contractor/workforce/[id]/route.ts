import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getContractorOperativeById, saveContractorOperative } from '@/server/contractor/workforce-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  try {
    const operative = await getContractorOperativeById(id, session);
    if (!operative) return NextResponse.json({ error: 'Operative not found' }, { status: 404 });
    return NextResponse.json({ operative });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Access denied' }, { status: 403 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const { id } = await params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const existing = await getContractorOperativeById(id, session);
  if (!existing) return NextResponse.json({ error: 'Operative not found' }, { status: 404 });

  const result = await saveContractorOperative(
    {
      contractorOrgId: existing.contractorOrgId,
      operativeId: id,
      personId: existing.personId,
      firstName: body.firstName ?? existing.firstName,
      lastName: body.lastName ?? existing.lastName,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      jobTitle: body.jobTitle ?? existing.jobTitle,
      employmentStatus: body.employmentStatus ?? existing.employmentStatus,
      isSupervisor: body.isSupervisor ?? existing.isSupervisor,
      trades: body.trades ?? existing.trades,
      competencies: body.competencies ?? existing.competencies,
      homePostcode: body.homePostcode ?? existing.homePostcode,
      qualifications: body.qualifications ?? existing.qualifications,
      training: body.training ?? existing.trainingRecords,
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to update operative' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id });
}
