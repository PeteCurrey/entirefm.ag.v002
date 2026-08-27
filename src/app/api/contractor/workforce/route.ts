import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listContractorOperatives, saveContractorOperative } from '@/server/contractor/workforce-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get('orgId') || session.orgId;
  try {
    const operatives = await listContractorOperatives(orgId, session);
    return NextResponse.json({ operatives });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list operatives' }, { status: 403 });
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

  const { firstName, lastName, email, phone, jobTitle, employmentStatus, isSupervisor, trades, competencies, homePostcode, qualifications, training } = body;
  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: 'First name, last name, and email are mandatory' }, { status: 400 });
  }

  const contractorOrgId = body.contractorOrgId || session.orgId;

  const result = await saveContractorOperative(
    {
      contractorOrgId,
      firstName,
      lastName,
      email,
      phone,
      jobTitle: jobTitle || 'Field Engineer',
      employmentStatus: employmentStatus || 'EMPLOYED',
      isSupervisor: isSupervisor === true,
      trades: Array.isArray(trades) ? trades : [trades || 'General Maintenance'],
      competencies: Array.isArray(competencies) ? competencies : [],
      homePostcode,
      qualifications,
      training,
    },
    session
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to save operative' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
