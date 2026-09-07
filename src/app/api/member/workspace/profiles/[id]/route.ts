import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { updateSiteProfile, deleteSiteProfile, getSiteProfile } from '@/server/workspace/workspace-store';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  building_type: z.string().min(1).optional(),
  floor_area: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  operating_profile: z.string().min(1).optional(),
  site_criticality: z.string().min(1).optional(),
  portfolio_sites: z.number().int().min(1).max(500).optional(),
  metadata: z.record(z.any()).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  const profile = await getSiteProfile(session.memberId, id);
  if (!profile) {
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: profile }, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_FAILED', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateSiteProfile(session.memberId, id, parsed.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    console.error('[WORKSPACE_PROFILE_PATCH_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'UPDATE_FAILED' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getMemberSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteSiteProfile(session.memberId, id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'DELETE_FAILED' }, { status: 400 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('[WORKSPACE_PROFILE_DELETE_ERROR]:', err);
    return NextResponse.json({ success: false, error: 'DELETE_FAILED' }, { status: 500 });
  }
}
