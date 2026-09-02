/**
 * ENTIREFM ACADEMY CERTIFICATION & BADGES — TYPE DEFINITIONS
 * ==========================================================
 * Canonical types for structured FM learning paths, server-gated
 * assessments, member credentials, and public verification seals.
 */

export interface LearningPathModule {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  keyTopics: string[];
  readingContent: string;
}

export type LearningPathStatus = 'draft' | 'published' | 'archived';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  targetRole: string; // e.g. "Compliance Lead", "PPM Specialist", "Mobilisation Lead"
  modules: LearningPathModule[];
  passMarkPercent: number; // e.g. 80, 85
  status: LearningPathStatus;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentQuestionOption {
  id: string; // e.g. "opt-a", "opt-b"
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: AssessmentQuestionOption[];
  correctOptionId: string; // SERVER-ONLY — NEVER SERVED TO NON-ADMIN CLIENT
  explanation?: string;
}

/**
 * Sanitized question projection safe for client delivery.
 * Guarantees correctOptionId and explanation are completely stripped.
 */
export interface ClientAssessmentQuestion {
  id: string;
  prompt: string;
  options: AssessmentQuestionOption[];
}

export interface Assessment {
  id: string;
  pathId: string;
  questions: AssessmentQuestion[];
  version?: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAssessment {
  id: string;
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  passMarkPercent: number;
  totalQuestions: number;
  questions: ClientAssessmentQuestion[];
}

export type CertificationStatus = 'in_progress' | 'passed' | 'failed';

export interface MemberCertification {
  id: string;
  memberUid: string; // Supabase auth.uid
  pathId: string;
  startedAt: string;
  completedAt: string | null;
  attemptCount: number;
  score: number | null; // e.g. 85.0
  status: CertificationStatus;
  badgeIssuedAt: string | null;
  publicCertId: string | null; // e.g. "EFM-CERT-XXXX-XXXX"
  lastAttemptAt: string | null;
  viewedModules: string[];
  attemptHistory?: Array<{
    attempt: number;
    timestamp: string;
    score: number;
    passed: boolean;
    ipFingerprint?: string;
    userAgent?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Publicly verifiable credential payload (unauthenticated verification page).
 * Strictly omits memberUid, raw scores, attempt counts, and internal IDs.
 */
export interface PublicVerifiedCertification {
  publicCertId: string;
  recipientName: string;
  recipientCompany?: string;
  pathTitle: string;
  pathSlug: string;
  targetRole: string;
  badgeIssuedAt: string;
  verifiedAt: string;
  isValid: boolean;
}

export interface GradeSubmissionInput {
  pathSlug: string;
  answers: Record<string, string>; // { [questionId: string]: selectedOptionId }
}

export interface GradeSubmissionResult {
  status: 'passed' | 'failed';
  score: number;
  passMarkPercent: number;
  attemptCount: number;
  badgeIssued: boolean;
  badgeIssuedAt?: string;
  publicCertId?: string;
  nextAllowedAttemptAt?: string; // ISO string if failed, adhering to retake cooldown
  feedback: {
    totalQuestions: number;
    correctQuestions: number;
    passed: boolean;
    topicsToReview?: string[];
  };
}
