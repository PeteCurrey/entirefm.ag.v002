import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireEngineerSession } from '@/server/identity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    requireEngineerSession(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const visitId = searchParams.get('visitId');

  // Return visit-scoped compliance requirements
  return NextResponse.json({
    success: true,
    visitId,
    mandatoryEvidence: ['GAS_SAFETY_RECORD', 'COMPLETION_PHOTO_AFTER'],
    requiredReadings: ['STATIC_PRESSURE_MBAR', 'WORKING_PRESSURE_MBAR', 'COMBUSTION_EFFICIENCY_PCT'],
    permitRequired: false,
    statutoryStandard: 'Gas Safety (Installation and Use) Regulations 1998 — Reg 36',
  });
}
