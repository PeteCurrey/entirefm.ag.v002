import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { bulkImportContractorWorkforce } from '@/server/contractor/workforce-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { rows, contractorOrgId } = body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'Rows array required' }, { status: 400 });
  }

  const orgId = contractorOrgId || session.orgId;

  try {
    const result = await bulkImportContractorWorkforce(orgId, rows, session);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 400 });
  }
}
