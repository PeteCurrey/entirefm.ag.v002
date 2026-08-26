/**
 * ENTIREFM CAREERS & RECRUITMENT DOMAIN TYPES
 * ============================================
 * Strongly typed data structures for Vacancies, Job Applications,
 * Candidate Profiles, ATS Workflow Stages, and Talent Pool Registrations.
 */

export type VacancyStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type DepartmentCode =
  | 'Engineering'
  | 'Operations'
  | 'Projects'
  | 'Technology'
  | 'Commercial'
  | 'Finance'
  | 'Specialist Services'
  | 'Corporate';

export type WorkingArrangement =
  | 'Field Mobile'
  | 'On-Site'
  | 'Hybrid'
  | 'Remote'
  | 'Operations Centre';

export type ContractType =
  | 'Full-time / Permanent'
  | 'Full-time / Shift-based'
  | 'Part-time'
  | 'Fixed-Term Contract'
  | 'Subcontract / Specialist';

export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  reference: string;
  department: DepartmentCode;
  location: string;
  workingArrangement: WorkingArrangement;
  contractType: ContractType;
  salaryGuide?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryVisible: boolean;
  hiringManager?: string;
  postedDate: string; // ISO YYYY-MM-DD
  closingDate: string; // ISO YYYY-MM-DD
  status: VacancyStatus;
  featured: boolean;
  summary: string;
  overview?: string;
  responsibilities: string[];
  requirements: string[];
  qualificationsRequired: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStage =
  | 'NEW'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SECOND_INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface CandidateNote {
  id: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  content: string;
  stageAtCreation?: ApplicationStage;
}

export interface JobApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  vacancySlug: string;
  vacancyDepartment: DepartmentCode;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl?: string;
  currentEmployer?: string;
  currentRole?: string;
  supportingStatement?: string;
  cvFileName?: string;
  cvStoragePath?: string;
  cvFileSize?: number;
  cvMimeType?: string;
  additionalDocFileName?: string;
  additionalDocStoragePath?: string;
  stage: ApplicationStage;
  assignedOwner?: string;
  notes: CandidateNote[];
  gdprConsent: boolean;
  consentTimestamp: string;
  retentionBasis: string;
  createdAt: string;
  updatedAt: string;
}

export type TalentInterestArea =
  | 'Engineering'
  | 'Facilities Management'
  | 'Operations'
  | 'Helpdesk'
  | 'Contract Management'
  | 'Projects'
  | 'Commercial'
  | 'Business Development'
  | 'Finance'
  | 'Procurement'
  | 'Technology / Digital'
  | 'Marketing'
  | 'Other';

export interface TalentPoolCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredLocation: string;
  linkedInUrl?: string;
  currentRole?: string;
  currentEmployer?: string;
  interestAreas: TalentInterestArea[];
  preferredJobTypes: string[];
  salaryExpectation?: string;
  availability?: string; // Notice period e.g. "Immediate", "1 Month", "3 Months"
  introduction?: string;
  cvFileName?: string;
  cvStoragePath?: string;
  cvFileSize?: number;
  cvMimeType?: string;
  skillsTags: string[];
  notes: CandidateNote[];
  status: 'ACTIVE' | 'CONTACTED' | 'PLACED' | 'ARCHIVED';
  associatedVacancyId?: string;
  gdprConsent: boolean;
  consentTimestamp: string;
  retentionExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecruitmentMetrics {
  activeVacancies: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  talentPoolCandidates: number;
  applicationsAwaitingReview: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiresMade: number;
  expiringVacanciesCount: number;
}

export interface CandidateMatchResult {
  candidate: TalentPoolCandidate;
  score: number; // 0 to 100 match score
  matchReasons: string[];
}
