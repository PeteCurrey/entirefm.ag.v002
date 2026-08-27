import { NextResponse } from 'next/server';
import { getComplianceRecords } from '@/server/compliance/compliance-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const discipline = searchParams.get('discipline') || undefined;
  const status = searchParams.get('status') || undefined;

  const records = getComplianceRecords({ discipline, status });
  return NextResponse.json({ records });
}
