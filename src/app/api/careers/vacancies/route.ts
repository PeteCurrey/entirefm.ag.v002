/**
 * ADMIN VACANCIES API — /api/careers/vacancies
 * ============================================
 * Handles CRUD operations on vacancies for authenticated EntireFM Admins.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import {
  getVacancies,
  getVacancyById,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  duplicateVacancy,
  matchCandidatesForVacancy,
} from '@/server/careers/store';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action');

  if (id && action === 'matches') {
    const matches = await matchCandidatesForVacancy(id);
    return NextResponse.json({ matches });
  }

  if (id) {
    const vacancy = await getVacancyById(id);
    if (!vacancy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ vacancy });
  }

  const status = (searchParams.get('status') || 'ALL') as any;
  const department = searchParams.get('department') || 'ALL';
  const vacancies = await getVacancies({ status, department });

  return NextResponse.json({ vacancies });
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
    const { action, id, data } = body;

    if (action === 'duplicate' && id) {
      const duplicated = await duplicateVacancy(id);
      if (!duplicated) return NextResponse.json({ error: 'Source vacancy not found' }, { status: 404 });
      return NextResponse.json({ success: true, vacancy: duplicated }, { status: 201 });
    }

    if (action === 'delete' && id) {
      await deleteVacancy(id);
      return NextResponse.json({ success: true });
    }

    if (id && data) {
      const updated = await updateVacancy(id, data);
      if (!updated) return NextResponse.json({ error: 'Vacancy not found' }, { status: 404 });
      return NextResponse.json({ success: true, vacancy: updated });
    }

    // Create
    const created = await createVacancy(data || body);
    return NextResponse.json({ success: true, vacancy: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error in admin vacancies API:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
