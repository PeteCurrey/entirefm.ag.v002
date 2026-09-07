import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { listSiteProfiles, createSiteProfile } from '@/server/workspace/workspace-store';

const CreateProfileSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(100),
  building_type: z.string().min(1, 'Building type is required'),
  floor_area: z.string().min(1, 'Floor area is required'),
  region: z.string().min(1, 'Region is required'),
  operating_profile: z.string().min(1, 'Operating profile is required'),
  site_criticality: z.string().min(1, 'Site criticality is required'),
  portfolio_sites: z.number().int().min(1).max(500).optional(),
  metadata: z.record(z.any()).optional(),
});

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const profiles = await listSiteProfiles(session.memberId);
    return NextResponse.json({ success: true, data: profiles }, { status: 200 });
  } catch (err: any) {
    console.error('[WORKSPACE_PROFILES_GET_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'FETCH_FAILED' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CreateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const created = await createSiteProfile(session.memberId, parsed.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    console.error('[WORKSPACE_PROFILES_POST_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'CREATE_FAILED' }, { status: 500 });
  }
}
