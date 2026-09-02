import { NextRequest, NextResponse } from 'next/server';
import { getJobListings, createJobListing } from '@/server/jobs/jobs-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import type { JobLocationType, JobSeniority } from '@/server/jobs/types';

export async function GET(request: NextRequest) {
  try {
    const session = getMemberSessionFromRequest(request);
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || undefined;
    const discipline = searchParams.get('discipline') || undefined;
    const locationType = (searchParams.get('locationType') as JobLocationType) || undefined;
    const seniority = (searchParams.get('seniority') as JobSeniority) || undefined;
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { jobs, total } = await getJobListings(
      {
        query,
        discipline,
        locationType,
        seniority,
        verifiedOnly,
        limit,
        offset,
      },
      session?.memberId
    );

    return NextResponse.json({
      success: true,
      jobs,
      total,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getMemberSessionFromRequest(request);
    const body = await request.json();

    const {
      title,
      employerName,
      location,
      locationType,
      salaryMin,
      salaryMax,
      salaryPeriod,
      seniority,
      disciplineTags,
      sectorTags,
      description,
      requirements,
      benefits,
      applicationMethod,
      externalApplyUrl,
      contactEmail,
    } = body;

    if (!title || title.trim().length < 4) {
      return NextResponse.json({ error: 'Job title is required (min 4 characters)' }, { status: 400 });
    }
    if (!employerName || employerName.trim().length < 2) {
      return NextResponse.json({ error: 'Employer name is required' }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }
    if (!description || description.trim().length < 20) {
      return NextResponse.json({ error: 'Job description is required (min 20 characters)' }, { status: 400 });
    }

    const job = await createJobListing({
      title,
      employerName,
      location,
      locationType: locationType || 'on_site',
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryPeriod: salaryPeriod || 'per_annum',
      seniority: seniority || 'practitioner',
      disciplineTags: Array.isArray(disciplineTags) ? disciplineTags : [],
      sectorTags: Array.isArray(sectorTags) ? sectorTags : [],
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      applicationMethod: applicationMethod || 'in_platform',
      externalApplyUrl,
      contactEmail,
      postedByMemberId: session?.memberId,
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
