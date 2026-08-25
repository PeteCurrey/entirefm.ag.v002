import { NextRequest, NextResponse } from 'next/server';
import {
  listVisitsForProvider,
  listFieldOperatives,
  assignOperativeToVisit,
  evaluateOperativeCompetencyForJob,
} from '@/server/field/operations-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const providerOrgId = searchParams.get('providerOrgId') || 'sup-test-01';

    const [visits, operatives] = await Promise.all([
      listVisitsForProvider(providerOrgId),
      listFieldOperatives(providerOrgId),
    ]);

    const operativesWithCompetencies = operatives.map((op) => ({
      ...op,
      competencies_summary: op.competencies.map((c) => c.title).join(', '),
    }));

    return NextResponse.json({
      providerOrgId,
      visits,
      operatives: operativesWithCompetencies,
      unassignedCount: visits.filter((v) => !v.assigned_engineer_id || v.status === 'AWARDED').length,
      activeCount: visits.filter((v) => ['ASSIGNED', 'TRAVELLING', 'ARRIVED', 'IN_PROGRESS'].includes(v.status)).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitId, operativeId, providerOrgId = 'sup-test-01', dispatcherName = 'Operations Dispatch' } = body;

    if (!visitId || !operativeId) {
      return NextResponse.json({ error: 'visitId and operativeId are required' }, { status: 400 });
    }

    const result = await assignOperativeToVisit(visitId, operativeId, providerOrgId, dispatcherName);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      visit: result.visit,
      message: `Operative ${result.visit?.assigned_engineer_name} assigned successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
