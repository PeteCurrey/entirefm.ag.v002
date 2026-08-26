/**
 * ADMIN APPLICATIONS & ATS API — /api/careers/applications
 * ========================================================
 * Handles ATS workflow stage transitions, candidate notes, and application queries.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getApplications,
  getApplicationById,
  updateApplicationStage,
  addApplicationNote,
  generateSignedCvToken,
} from '@/server/careers/store';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action');

  if (id && action === 'cv-token') {
    const app = await getApplicationById(id);
    if (!app || !app.cvStoragePath) {
      return NextResponse.json({ error: 'No CV found for application' }, { status: 404 });
    }
    const token = generateSignedCvToken(app.id, app.cvStoragePath);
    return NextResponse.json({ token, downloadUrl: `/api/careers/cv-download?token=${token}` });
  }

  if (id) {
    const application = await getApplicationById(id);
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ application });
  }

  const vacancyId = searchParams.get('vacancyId') || undefined;
  const stage = (searchParams.get('stage') || 'ALL') as any;
  const department = searchParams.get('department') || 'ALL';
  const search = searchParams.get('search') || undefined;

  const applications = await getApplications({ vacancyId, stage, department, search });
  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    requireAdminSession(session);
  } catch {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, id, stage, note, authorName } = body;

    if (action === 'update-stage' && id && stage) {
      const updated = await updateApplicationStage(
        id,
        stage,
        note,
        authorName || session.email || 'Admin User'
      );
      if (!updated) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      return NextResponse.json({ success: true, application: updated });
    }

    if (action === 'add-note' && id && note) {
      const updated = await addApplicationNote(id, {
        authorName: authorName || session.email || 'Admin User',
        authorEmail: session.email || 'admin@entirefm.com',
        content: note,
      });
      if (!updated) return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      return NextResponse.json({ success: true, application: updated });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in admin applications API:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
