/**
 * API ROUTE: /api/contractor/jobs
 * ===============================
 * Contractor independent job management API with GET, POST, and PATCH support.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  listContractorIndependentJobs,
  createContractorIndependentJob,
  updateContractorIndependentJobStatus,
} from '@/server/contractor/independent-job-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = req.nextUrl.searchParams.get('org_id') || session.orgId;
    const jobs = await listContractorIndependentJobs(orgId, session);

    return NextResponse.json({ success: true, jobs });
  } catch (err: any) {
    console.error('[API_JOBS_GET_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await createContractorIndependentJob(
      {
        ...body,
        contractor_org_id: body.contractor_org_id || session.orgId,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create job' }, { status: 400 });
    }

    return NextResponse.json({ success: true, job: result.job });
  } catch (err: any) {
    console.error('[API_JOBS_POST_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, contractor_org_id, status, sign_off_name, completed_at } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields: id, status' }, { status: 400 });
    }

    const orgId = contractor_org_id || session.orgId;
    const result = await updateContractorIndependentJobStatus(
      id,
      orgId,
      status,
      session,
      { sign_off_name, completed_at }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update job' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Job status updated successfully' });
  } catch (err: any) {
    console.error('[API_JOBS_PATCH_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
