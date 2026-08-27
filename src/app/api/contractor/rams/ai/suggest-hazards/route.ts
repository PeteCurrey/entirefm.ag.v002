import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { suggestAdditionalHazards } from '@/server/contractor/rams-ai-assistant';

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

  const {
    workCategory,
    workScopeDescription,
    buildingType,
    occupancyState,
    selectedPlant,
    currentHazardIds,
  } = body;

  const suggestions = await suggestAdditionalHazards({
    workCategory: workCategory || 'GENERAL_MAINTENANCE',
    workScopeDescription: workScopeDescription || '',
    buildingType: buildingType || 'Commercial',
    occupancyState: occupancyState || 'Occupied',
    selectedPlant: Array.isArray(selectedPlant) ? selectedPlant : [],
    currentHazardIds: Array.isArray(currentHazardIds) ? currentHazardIds : [],
  });

  return NextResponse.json({ success: true, suggestions });
}
