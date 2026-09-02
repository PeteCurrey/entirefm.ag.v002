/**
 * ENTIREFM LOBBY JOBS BOARD — TYPES
 * ===================================
 */

export type JobLocationType = 'on_site' | 'hybrid' | 'remote' | 'mobile_field';
export type JobSalaryPeriod = 'per_annum' | 'per_day' | 'per_hour';
export type JobSeniority =
  | 'apprentice'
  | 'technician'
  | 'practitioner'
  | 'lead'
  | 'manager'
  | 'head_of'
  | 'director';

export type JobStatus = 'draft' | 'pending_moderation' | 'published' | 'closed' | 'expired';
export type JobModerationState = 'pending' | 'approved' | 'rejected';
export type JobApplicationMethod = 'in_platform' | 'external_url' | 'email';
export type JobApplicationStatus = 'submitted' | 'viewed' | 'shortlisted' | 'declined';

export interface JobListing {
  id: string;
  slug: string;
  title: string;
  employerName: string;
  employerOrgId?: string;
  isEntireFMVerifiedEmployer: boolean;
  location: string;
  locationType: JobLocationType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: JobSalaryPeriod;
  seniority: JobSeniority;
  disciplineTags: string[];
  sectorTags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  applicationMethod: JobApplicationMethod;
  externalApplyUrl?: string;
  contactEmail?: string;
  postedByMemberId?: string;
  status: JobStatus;
  moderationState: JobModerationState;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isSaved?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantMemberId: string;
  applicantName: string;
  applicantEmail: string;
  applicantHeadline?: string;
  applicantCompany?: string;
  coverNote: string;
  cvUrl?: string;
  linkedinUrl?: string;
  status: JobApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobQueryFilters {
  query?: string;
  discipline?: string;
  locationType?: JobLocationType | 'all';
  seniority?: JobSeniority | 'all';
  verifiedOnly?: boolean;
  limit?: number;
  offset?: number;
}
