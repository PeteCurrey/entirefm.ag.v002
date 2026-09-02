/**
 * ENTIREFM LOBBY JOBS STORE — DATABASE-BACKED
 * ==============================================
 * Connects directly to PostgreSQL tables created in Migration 0048.
 * Authentically checks employer verified contractor status against organisations table.
 */

import { JobListing, JobApplication, JobQueryFilters } from './types';
import { dbQuery } from '@/server/db/client';
import { getMemberById } from '@/server/member/member-store';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapJobRow(row: any): JobListing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    employerName: row.employer_name,
    employerOrgId: row.employer_org_id,
    isEntireFMVerifiedEmployer: Boolean(row.is_entirefm_verified_employer),
    location: row.location,
    locationType: row.location_type || 'on_site',
    salaryMin: row.salary_min != null ? Number(row.salary_min) : undefined,
    salaryMax: row.salary_max != null ? Number(row.salary_max) : undefined,
    salaryCurrency: row.salary_currency || 'GBP',
    salaryPeriod: row.salary_period || 'per_annum',
    seniority: row.seniority || 'practitioner',
    disciplineTags: row.discipline_tags || [],
    sectorTags: row.sector_tags || [],
    description: row.description,
    requirements: row.requirements || [],
    benefits: row.benefits || [],
    applicationMethod: row.application_method || 'in_platform',
    externalApplyUrl: row.external_apply_url,
    contactEmail: row.contact_email,
    postedByMemberId: row.posted_by_member_id,
    status: row.status || 'published',
    moderationState: row.moderation_state || 'approved',
    viewCount: Number(row.view_count || 0),
    applicationCount: Number(row.application_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

/**
 * Check if an employer name or org ID belongs to an approved EntireFM contractor organization.
 */
export async function checkEmployerVerification(employerName: string, orgId?: string): Promise<{ isVerified: boolean; orgId?: string }> {
  if (orgId) {
    const { data } = await dbQuery<any[]>(`organisations?id=eq.${encodeURIComponent(orgId)}&status=eq.APPROVED&limit=1`);
    if (data && data.length > 0) {
      return { isVerified: true, orgId: data[0].id };
    }
  }

  if (employerName) {
    const cleanName = employerName.trim();
    const { data } = await dbQuery<any[]>(`organisations?name=ilike.*${encodeURIComponent(cleanName)}*&status=eq.APPROVED&limit=1`);
    if (data && data.length > 0) {
      return { isVerified: true, orgId: data[0].id };
    }
  }

  return { isVerified: false };
}

/**
 * Retrieve active job listings with optional filtering.
 */
export async function getJobListings(
  filters?: JobQueryFilters,
  currentMemberId?: string
): Promise<{ jobs: JobListing[]; total: number }> {
  let endpoint = `lobby_job_listings?status=eq.published&moderation_state=eq.approved&order=created_at.desc`;

  if (filters?.locationType && filters.locationType !== 'all') {
    endpoint += `&location_type=eq.${encodeURIComponent(filters.locationType)}`;
  }
  if (filters?.seniority && filters.seniority !== 'all') {
    endpoint += `&seniority=eq.${encodeURIComponent(filters.seniority)}`;
  }
  if (filters?.verifiedOnly) {
    endpoint += `&is_entirefm_verified_employer=eq.true`;
  }

  const limit = filters?.limit || 20;
  const offset = filters?.offset || 0;
  endpoint += `&limit=${limit}&offset=${offset}`;

  const { data } = await dbQuery<any[]>(endpoint, {
    headers: { Prefer: 'count=exact' },
  });

  if (!data) return { jobs: [], total: 0 };

  let jobs = data.map(mapJobRow);

  // Client-side filtering for search query and discipline
  if (filters?.query) {
    const q = filters.query.toLowerCase().trim();
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.employerName.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.disciplineTags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters?.discipline) {
    const disc = filters.discipline.toLowerCase();
    jobs = jobs.filter((j) =>
      j.disciplineTags.some((t) => t.toLowerCase() === disc)
    );
  }

  // Attach isSaved indicator if authenticated member ID provided
  if (currentMemberId) {
    const savedIds = await getMemberSavedJobIds(currentMemberId);
    jobs = jobs.map((j) => ({
      ...j,
      isSaved: savedIds.includes(j.id),
    }));
  }

  return { jobs, total: jobs.length };
}

/**
 * Get single job listing by ID or Slug.
 */
export async function getJobListingBySlugOrId(identifier: string, currentMemberId?: string): Promise<JobListing | null> {
  const isId = /^[a-z0-9-]+$/i.test(identifier);
  const filter = identifier.startsWith('job-') || isId
    ? `id=eq.${encodeURIComponent(identifier)}`
    : `slug=eq.${encodeURIComponent(identifier)}`;

  const { data } = await dbQuery<any[]>(`lobby_job_listings?${filter}&limit=1`);
  if (!data || data.length === 0) return null;

  const job = mapJobRow(data[0]);

  // Increment view count asynchronously
  dbQuery(`lobby_job_listings?id=eq.${encodeURIComponent(job.id)}`, {
    method: 'PATCH',
    body: { view_count: (job.viewCount || 0) + 1 },
  }).catch(() => {});

  if (currentMemberId) {
    const savedIds = await getMemberSavedJobIds(currentMemberId);
    job.isSaved = savedIds.includes(job.id);
  }

  return job;
}

/**
 * Create a new job listing (submitted by employer or member).
 */
export async function createJobListing(data: {
  title: string;
  employerName: string;
  employerOrgId?: string;
  location: string;
  locationType: JobListing['locationType'];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: JobListing['salaryPeriod'];
  seniority?: JobListing['seniority'];
  disciplineTags: string[];
  sectorTags?: string[];
  description: string;
  requirements: string[];
  benefits?: string[];
  applicationMethod: JobListing['applicationMethod'];
  externalApplyUrl?: string;
  contactEmail?: string;
  postedByMemberId?: string;
}): Promise<JobListing> {
  const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = `${slugify(data.title)}-${slugify(data.employerName)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Verify against approved EntireFM contractor organisations
  const { isVerified, orgId } = await checkEmployerVerification(data.employerName, data.employerOrgId);

  const row = {
    id,
    slug,
    title: data.title.trim(),
    employer_name: data.employerName.trim(),
    employer_org_id: orgId || data.employerOrgId || null,
    is_entirefm_verified_employer: isVerified,
    location: data.location.trim(),
    location_type: data.locationType || 'on_site',
    salary_min: data.salaryMin || null,
    salary_max: data.salaryMax || null,
    salary_currency: data.salaryCurrency || 'GBP',
    salary_period: data.salaryPeriod || 'per_annum',
    seniority: data.seniority || 'practitioner',
    discipline_tags: data.disciplineTags || [],
    sector_tags: data.sectorTags || [],
    description: data.description.trim(),
    requirements: data.requirements || [],
    benefits: data.benefits || [],
    application_method: data.applicationMethod || 'in_platform',
    external_apply_url: data.externalApplyUrl || null,
    contact_email: data.contactEmail || null,
    posted_by_member_id: data.postedByMemberId || null,
    status: 'published',
    moderation_state: 'approved',
    view_count: 0,
    application_count: 0,
    created_at: now,
    updated_at: now,
  };

  const { data: inserted } = await dbQuery<any[]>('lobby_job_listings', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation' },
  });

  return inserted ? mapJobRow(inserted[0]) : mapJobRow(row);
}

/**
 * Submit an in-platform job application pulling profile data automatically from lobby_members.
 */
export async function submitJobApplication(
  jobId: string,
  memberId: string,
  coverNote: string,
  cvUrl?: string
): Promise<JobApplication> {
  const job = await getJobListingBySlugOrId(jobId);
  if (!job) throw new Error('Job listing not found');
  if (job.status !== 'published') throw new Error('Job listing is no longer active');

  const member = await getMemberById(memberId);
  if (!member) throw new Error('Member profile not found');

  const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const row = {
    id,
    job_id: job.id,
    applicant_member_id: member.id,
    applicant_name: member.display_name,
    applicant_email: member.email,
    applicant_headline: member.headline || member.job_title || 'Facilities Professional',
    applicant_company: member.company || null,
    cover_note: coverNote.trim(),
    cv_url: cvUrl || null,
    linkedin_url: member.linkedin_url || null,
    status: 'submitted',
    created_at: now,
    updated_at: now,
  };

  const { data: inserted, error } = await dbQuery<any[]>('lobby_job_applications', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation' },
  });

  if (error) {
    if (error.includes('duplicate') || error.includes('unique')) {
      throw new Error('You have already applied for this role');
    }
    throw new Error(`Failed to submit application: ${error}`);
  }

  // Increment application count on job
  await dbQuery(`lobby_job_listings?id=eq.${encodeURIComponent(job.id)}`, {
    method: 'PATCH',
    body: { application_count: (job.applicationCount || 0) + 1, updated_at: now },
  });

  return inserted ? {
    id: inserted[0].id,
    jobId: inserted[0].job_id,
    applicantMemberId: inserted[0].applicant_member_id,
    applicantName: inserted[0].applicant_name,
    applicantEmail: inserted[0].applicant_email,
    applicantHeadline: inserted[0].applicant_headline,
    applicantCompany: inserted[0].applicant_company,
    coverNote: inserted[0].cover_note,
    cvUrl: inserted[0].cv_url,
    linkedinUrl: inserted[0].linkedin_url,
    status: inserted[0].status,
    createdAt: inserted[0].created_at,
    updatedAt: inserted[0].updated_at,
  } : {
    id,
    jobId: job.id,
    applicantMemberId: member.id,
    applicantName: member.display_name,
    applicantEmail: member.email,
    applicantHeadline: member.headline,
    applicantCompany: member.company,
    coverNote: row.cover_note,
    cvUrl,
    linkedinUrl: member.linkedin_url,
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Toggle saving a job bookmark.
 */
export async function toggleSaveJob(jobId: string, memberId: string): Promise<{ saved: boolean }> {
  const { data: existing } = await dbQuery<any[]>(
    `lobby_saved_jobs?job_id=eq.${encodeURIComponent(jobId)}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );

  if (existing && existing.length > 0) {
    await dbQuery(
      `lobby_saved_jobs?job_id=eq.${encodeURIComponent(jobId)}&member_id=eq.${encodeURIComponent(memberId)}`,
      { method: 'DELETE' }
    );
    return { saved: false };
  } else {
    const id = `save-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await dbQuery('lobby_saved_jobs', {
      method: 'POST',
      body: { id, job_id: jobId, member_id: memberId, created_at: new Date().toISOString() },
      headers: { Prefer: 'resolution=ignore-duplicates' },
    });
    return { saved: true };
  }
}

/**
 * Get all saved job IDs for a member.
 */
export async function getMemberSavedJobIds(memberId: string): Promise<string[]> {
  const { data } = await dbQuery<any[]>(`lobby_saved_jobs?member_id=eq.${encodeURIComponent(memberId)}`);
  if (!data) return [];
  return data.map((r) => r.job_id);
}

/**
 * Get all applications submitted by a member.
 */
export async function getMemberApplications(memberId: string): Promise<JobApplication[]> {
  const { data } = await dbQuery<any[]>(
    `lobby_job_applications?applicant_member_id=eq.${encodeURIComponent(memberId)}&order=created_at.desc`
  );
  if (!data) return [];
  return data.map((r) => ({
    id: r.id,
    jobId: r.job_id,
    applicantMemberId: r.applicant_member_id,
    applicantName: r.applicant_name,
    applicantEmail: r.applicant_email,
    applicantHeadline: r.applicant_headline,
    applicantCompany: r.applicant_company,
    coverNote: r.cover_note,
    cvUrl: r.cv_url,
    linkedinUrl: r.linkedin_url,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}
