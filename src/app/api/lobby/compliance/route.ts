import { NextResponse } from 'next/server';
import {
  getComplianceRecords,
  OPEN_CONSULTATIONS,
  HORIZON_TIMELINE,
  REGULATOR_ACTIVITY,
} from '@/server/compliance/compliance-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discipline = searchParams.get('discipline') || undefined;
  const status = searchParams.get('status') || undefined;
  const jurisdiction = searchParams.get('jurisdiction') || undefined;

  const records = getComplianceRecords({ discipline, status, jurisdiction });

  return NextResponse.json({
    records,
    consultations: OPEN_CONSULTATIONS,
    horizon: HORIZON_TIMELINE,
    regulators: REGULATOR_ACTIVITY,
    stats: {
      total: records.length,
      statutoryLaw: records.filter((r) => r.classification === 'Statutory Law').length,
      upcomingDeadlines: records.filter((r) => r.status === 'upcoming').length,
    },
  });
}
