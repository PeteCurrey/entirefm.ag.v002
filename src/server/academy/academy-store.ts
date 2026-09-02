/**
 * ENTIREFM ACADEMY DATA ACCESS & PERSISTENCE ENGINE
 * ===================================================
 * Manages Learning Paths, sanitized assessment projections,
 * server-side grading, member certification records, and
 * public unauthenticated credential verification.
 */

import crypto from 'crypto';
import { dbQuery, isDbConfigured } from '../db/client';
import {
  LearningPath,
  Assessment,
  AssessmentQuestion,
  ClientAssessment,
  MemberCertification,
  PublicVerifiedCertification,
  GradeSubmissionResult,
} from './types';
import { SEED_LEARNING_PATHS, SEED_ASSESSMENTS } from './seed-data';
import { createNotification } from '../notifications';

// Retake cooldown in milliseconds (15 minutes)
export const RETAKE_COOLDOWN_MS = 15 * 60 * 1000;

// Test & fallback in-memory cache
const MEMORY_PATHS = new Map<string, LearningPath>();
const MEMORY_ASSESSMENTS = new Map<string, Assessment>();
const MEMORY_CERTIFICATIONS = new Map<string, MemberCertification>(); // key: `${memberUid}:${pathId}`

// Initialize seed data into memory cache
for (const p of SEED_LEARNING_PATHS) {
  MEMORY_PATHS.set(p.id, p);
}
for (const a of SEED_ASSESSMENTS) {
  MEMORY_ASSESSMENTS.set(a.pathId, a);
}

/**
 * Generates an unguessable, cryptographically secure public certificate ID.
 * Format: EFM-CERT-XXXX-XXXX (16 hex chars)
 */
export function generatePublicCertId(): string {
  const bytes = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `EFM-CERT-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}-${bytes.slice(12, 16)}`;
}

/**
 * 1. List all published Learning Paths.
 * Drafts are never returned to members or public.
 */
export async function listPublishedPaths(): Promise<LearningPath[]> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('academy_learning_paths?status=eq.published&select=*&order=created_at.asc');
    if (data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description,
        targetRole: d.target_role,
        modules: d.modules || [],
        passMarkPercent: d.pass_mark_percent,
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  }

  return Array.from(MEMORY_PATHS.values()).filter((p) => p.status === 'published');
}

/**
 * 2. Get a Learning Path by slug.
 */
export async function getPathBySlug(slug: string): Promise<LearningPath | null> {
  const cleanSlug = slug.trim().toLowerCase();

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_learning_paths?slug=eq.${encodeURIComponent(cleanSlug)}&status=eq.published&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      return {
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description,
        targetRole: d.target_role,
        modules: d.modules || [],
        passMarkPercent: d.pass_mark_percent,
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      };
    }
  }

  const found = Array.from(MEMORY_PATHS.values()).find(
    (p) => p.slug === cleanSlug && p.status === 'published'
  );
  return found || null;
}

/**
 * 3. Get a Learning Path by ID.
 */
export async function getPathById(pathId: string): Promise<LearningPath | null> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_learning_paths?id=eq.${encodeURIComponent(pathId)}&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      return {
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description,
        targetRole: d.target_role,
        modules: d.modules || [],
        passMarkPercent: d.pass_mark_percent,
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      };
    }
  }

  return MEMORY_PATHS.get(pathId) || null;
}

/**
 * Fisher-Yates array shuffle for anti-abuse attempt order randomisation.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 4. Get sanitized Assessment for client delivery.
 * CRITICAL INTEGRITY REQUIREMENT:
 * Strips correctOptionId and explanation from every question.
 */
export async function getSanitizedAssessment(pathId: string): Promise<ClientAssessment | null> {
  const path = await getPathById(pathId);
  if (!path || path.status !== 'published') return null;

  let assessment: Assessment | null = null;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_assessments?path_id=eq.${encodeURIComponent(pathId)}&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      assessment = {
        id: d.id,
        pathId: d.path_id,
        questions: d.questions || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      };
    }
  }

  if (!assessment) {
    assessment = MEMORY_ASSESSMENTS.get(pathId) || null;
  }

  if (!assessment) return null;

  // SANITIZE & RANDOMIZE (Prompt 3 Anti-Abuse Hardening):
  // Shuffle question order and option order per attempt so answers cannot be memorized position-by-position.
  // Strips correctOptionId and explanation before transmission.
  const shuffledQuestions = shuffleArray(
    assessment.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: shuffleArray(
        q.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
        }))
      ),
    }))
  );

  return {
    id: assessment.id,
    pathId: path.id,
    pathSlug: path.slug,
    pathTitle: path.title,
    passMarkPercent: path.passMarkPercent,
    totalQuestions: shuffledQuestions.length,
    questions: shuffledQuestions,
  };
}

/**
 * 5. Internal Server-Only: Get raw assessment with correctOptionId for grading.
 * NEVER return this to any client API endpoint.
 */
export async function getRawAssessmentForGrading(pathId: string): Promise<Assessment | null> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_assessments?path_id=eq.${encodeURIComponent(pathId)}&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      return {
        id: d.id,
        pathId: d.path_id,
        questions: d.questions || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      };
    }
  }

  return MEMORY_ASSESSMENTS.get(pathId) || null;
}

/**
 * 6. Get a member's certification record for a path.
 */
export async function getMemberCertification(
  memberUid: string,
  pathId: string
): Promise<MemberCertification | null> {
  const key = `${memberUid}:${pathId}`;

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_member_certifications?member_uid=eq.${encodeURIComponent(memberUid)}&path_id=eq.${encodeURIComponent(pathId)}&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      const cert: MemberCertification = {
        id: d.id,
        memberUid: d.member_uid,
        pathId: d.path_id,
        startedAt: d.started_at,
        completedAt: d.completed_at,
        attemptCount: d.attempt_count,
        score: d.score !== null ? Number(d.score) : null,
        status: d.status,
        badgeIssuedAt: d.badge_issued_at,
        publicCertId: d.public_cert_id,
        lastAttemptAt: d.last_attempt_at,
        viewedModules: d.viewed_modules || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      };
      MEMORY_CERTIFICATIONS.set(key, cert);
      return cert;
    }
  }

  return MEMORY_CERTIFICATIONS.get(key) || null;
}

/**
 * 7. List all certifications for a member (for profile page display).
 */
export async function listMemberCertifications(
  memberUid: string
): Promise<MemberCertification[]> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `academy_member_certifications?member_uid=eq.${encodeURIComponent(memberUid)}&select=*&order=created_at.desc`
    );
    if (data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        memberUid: d.member_uid,
        pathId: d.path_id,
        startedAt: d.started_at,
        completedAt: d.completed_at,
        attemptCount: d.attempt_count,
        score: d.score !== null ? Number(d.score) : null,
        status: d.status,
        badgeIssuedAt: d.badge_issued_at,
        publicCertId: d.public_cert_id,
        lastAttemptAt: d.last_attempt_at,
        viewedModules: d.viewed_modules || [],
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  }

  return Array.from(MEMORY_CERTIFICATIONS.values()).filter(
    (c) => c.memberUid === memberUid
  );
}

/**
 * 8. Record module completion/viewing server-side.
 */
export async function recordModuleViewed(
  memberUid: string,
  pathId: string,
  moduleId: string
): Promise<MemberCertification> {
  const existing = await getMemberCertification(memberUid, pathId);
  const now = new Date().toISOString();

  let viewed = existing?.viewedModules || [];
  if (!viewed.includes(moduleId)) {
    viewed = [...viewed, moduleId];
  }

  if (existing) {
    existing.viewedModules = viewed;
    existing.updatedAt = now;

    if (isDbConfigured()) {
      await dbQuery(`academy_member_certifications?id=eq.${existing.id}`, {
        method: 'PATCH',
        body: {
          viewed_modules: viewed,
          updated_at: now,
        },
      });
    }

    MEMORY_CERTIFICATIONS.set(`${memberUid}:${pathId}`, existing);
    return existing;
  }

  // Create new in_progress certification record
  const newCert: MemberCertification = {
    id: `cert-${crypto.randomUUID()}`,
    memberUid,
    pathId,
    startedAt: now,
    completedAt: null,
    attemptCount: 0,
    score: null,
    status: 'in_progress',
    badgeIssuedAt: null,
    publicCertId: null,
    lastAttemptAt: null,
    viewedModules: viewed,
    createdAt: now,
    updatedAt: now,
  };

  if (isDbConfigured()) {
    await dbQuery('academy_member_certifications', {
      method: 'POST',
      body: {
        id: newCert.id,
        member_uid: newCert.memberUid,
        path_id: newCert.pathId,
        started_at: newCert.startedAt,
        completed_at: null,
        attempt_count: 0,
        score: null,
        status: 'in_progress',
        badge_issued_at: null,
        public_cert_id: null,
        last_attempt_at: null,
        viewed_modules: viewed,
        created_at: now,
        updated_at: now,
      },
    });
  }

  MEMORY_CERTIFICATIONS.set(`${memberUid}:${pathId}`, newCert);
  return newCert;
}

/**
 * 9. Grade an assessment submission server-side and issue certification.
 *
 * NON-NEGOTIABLE INTEGRITY RULES:
 * - Real percentage score computed from actual correct answers.
 * - Minimum pass mark required.
 * - Cooldown enforced on retakes after failure.
 * - Only sets passed if score >= passMarkPercent.
 * - badgeIssuedAt set only once on first pass.
 */
export interface SubmissionMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export async function gradeAssessmentSubmission(
  memberUid: string,
  pathSlug: string,
  answers: Record<string, string>,
  metadata?: SubmissionMetadata
): Promise<GradeSubmissionResult> {
  const path = await getPathBySlug(pathSlug);
  if (!path) {
    throw new Error(`Learning Path '${pathSlug}' not found.`);
  }

  const rawAssessment = await getRawAssessmentForGrading(path.id);
  if (!rawAssessment || rawAssessment.questions.length === 0) {
    throw new Error('Assessment not configured for this path.');
  }

  // 1. Enforce prerequisite: member must have marked all modules as viewed
  let existingCert = await getMemberCertification(memberUid, path.id);
  const totalModuleCount = path.modules.length;
  const viewedCount = existingCert?.viewedModules.length || 0;

  if (viewedCount < totalModuleCount) {
    throw new Error(
      `Prerequisite incomplete: You must review all ${totalModuleCount} modules before taking the assessment. (${viewedCount}/${totalModuleCount} completed)`
    );
  }

  const now = new Date();
  const nowIso = now.toISOString();

  // 2. Enforce retake cooldown (15 minutes after a failed attempt)
  // Justification: Requires genuine review of curriculum modules to deter guessing
  if (existingCert?.lastAttemptAt && existingCert.status === 'failed') {
    const lastAttemptTime = new Date(existingCert.lastAttemptAt).getTime();
    const elapsed = now.getTime() - lastAttemptTime;
    if (elapsed < RETAKE_COOLDOWN_MS) {
      const remainingMinutes = Math.ceil((RETAKE_COOLDOWN_MS - elapsed) / 60000);
      throw new Error(
        `Retake cooldown active: Please review the curriculum and try again in ${remainingMinutes} minute(s).`
      );
    }
  }

  // 3. Grade submission against server-side correctOptionId
  const totalQuestions = rawAssessment.questions.length;
  let correctCount = 0;
  const topicsToReview: string[] = [];

  for (const question of rawAssessment.questions) {
    const submittedOptionId = answers[question.id];
    if (submittedOptionId && submittedOptionId === question.correctOptionId) {
      correctCount++;
    } else {
      // Find module or prompt topic to guide learner
      topicsToReview.push(question.prompt.slice(0, 80) + '...');
    }
  }

  // Calculate real percentage score rounded to 1 decimal place
  const calculatedScore = Number(((correctCount / totalQuestions) * 100).toFixed(1));
  const isPass = calculatedScore >= path.passMarkPercent;
  const newAttemptCount = (existingCert?.attemptCount || 0) + 1;

  // Log immutable attempt metadata for anti-abuse auditing
  const ipFingerprint = metadata?.ipAddress
    ? crypto.createHash('sha256').update(metadata.ipAddress).digest('hex').slice(0, 16)
    : undefined;

  const attemptRecord = {
    attempt: newAttemptCount,
    timestamp: nowIso,
    score: calculatedScore,
    passed: isPass,
    ipFingerprint,
    userAgent: metadata?.userAgent ? metadata.userAgent.slice(0, 120) : undefined,
  };

  const updatedAttemptHistory = [...(existingCert?.attemptHistory || []), attemptRecord];

  if (!existingCert) {
    existingCert = {
      id: `cert-${crypto.randomUUID()}`,
      memberUid,
      pathId: path.id,
      startedAt: nowIso,
      completedAt: null,
      attemptCount: 0,
      score: null,
      status: 'in_progress',
      badgeIssuedAt: null,
      publicCertId: null,
      lastAttemptAt: null,
      viewedModules: path.modules.map((m) => m.id),
      attemptHistory: updatedAttemptHistory,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  } else {
    existingCert.attemptHistory = updatedAttemptHistory;
  }

  let badgeIssued = false;
  let issuedDate = existingCert.badgeIssuedAt;
  let publicCertId = existingCert.publicCertId;

  if (isPass) {
    existingCert.status = 'passed';
    existingCert.completedAt = existingCert.completedAt || nowIso;
    existingCert.score = calculatedScore;
    existingCert.attemptCount = newAttemptCount;
    existingCert.lastAttemptAt = nowIso;
    existingCert.updatedAt = nowIso;

    // Issue badge and generate publicCertId only once on first pass
    if (!existingCert.badgeIssuedAt) {
      existingCert.badgeIssuedAt = nowIso;
      issuedDate = nowIso;
      existingCert.publicCertId = generatePublicCertId();
      publicCertId = existingCert.publicCertId;
      badgeIssued = true;
    }

    // Persist to DB or Memory
    if (isDbConfigured()) {
      await dbQuery('academy_member_certifications', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: {
          id: existingCert.id,
          member_uid: memberUid,
          path_id: path.id,
          started_at: existingCert.startedAt,
          completed_at: existingCert.completedAt,
          attempt_count: existingCert.attemptCount,
          score: existingCert.score,
          status: 'passed',
          badge_issued_at: existingCert.badgeIssuedAt,
          public_cert_id: existingCert.publicCertId,
          last_attempt_at: nowIso,
          viewed_modules: existingCert.viewedModules,
          attempt_history: existingCert.attemptHistory,
          created_at: existingCert.createdAt,
          updated_at: nowIso,
        },
      });

      // Grant badge to member profile if lobby_members exists
      try {
        const { data: memberRows } = await dbQuery<any[]>(
          `lobby_members?auth_user_id=eq.${encodeURIComponent(memberUid)}&select=id,badges`
        );
        if (memberRows && memberRows.length > 0) {
          const currentBadges: string[] = memberRows[0].badges || [];
          const badgeTitle = `${path.targetRole} Certified`;
          if (!currentBadges.includes(badgeTitle)) {
            await dbQuery(`lobby_members?id=eq.${memberRows[0].id}`, {
              method: 'PATCH',
              body: { badges: [...currentBadges, badgeTitle] },
            });
          }
        }
      } catch (err) {
        console.warn('[ACADEMY] Could not update member badges array:', err);
      }
    }

    MEMORY_CERTIFICATIONS.set(`${memberUid}:${path.id}`, existingCert);

    // Trigger notification (Prompt 2 requirement: reuse existing notification system)
    try {
      await createNotification({
        audience: 'MEMBER',
        type: 'SYSTEM_ALERT',
        category: 'COMPLIANCE',
        severity: 'INFO',
        title: `Academy Credential Earned: ${path.targetRole}`,
        message: `Congratulations! You scored ${calculatedScore}% and earned your verified ${path.targetRole} credential.`,
        entity_type: 'system',
        entity_id: existingCert.id,
        action_url: `/academy/verify/${existingCert.publicCertId}`,
        metadata: {
          publicCertId: existingCert.publicCertId,
          pathSlug: path.slug,
          score: calculatedScore,
        },
      });
    } catch (notifErr) {
      console.warn('[ACADEMY] Notification dispatch error:', notifErr);
    }

    return {
      status: 'passed',
      score: calculatedScore,
      passMarkPercent: path.passMarkPercent,
      attemptCount: newAttemptCount,
      badgeIssued,
      badgeIssuedAt: issuedDate || undefined,
      publicCertId: publicCertId || undefined,
      feedback: {
        totalQuestions,
        correctQuestions: correctCount,
        passed: true,
      },
    };
  }

  // FAILED ATTEMPT:
  existingCert.status = 'failed';
  existingCert.score = calculatedScore;
  existingCert.attemptCount = newAttemptCount;
  existingCert.lastAttemptAt = nowIso;
  existingCert.updatedAt = nowIso;

  if (isDbConfigured()) {
    await dbQuery('academy_member_certifications', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: {
        id: existingCert.id,
        member_uid: memberUid,
        path_id: path.id,
        started_at: existingCert.startedAt,
        completed_at: null,
        attempt_count: newAttemptCount,
        score: calculatedScore,
        status: 'failed',
        badge_issued_at: null,
        public_cert_id: null,
        last_attempt_at: nowIso,
        viewed_modules: existingCert.viewedModules,
        attempt_history: existingCert.attemptHistory,
        created_at: existingCert.createdAt,
        updated_at: nowIso,
      },
    });
  }

  MEMORY_CERTIFICATIONS.set(`${memberUid}:${path.id}`, existingCert);

  const nextAllowedAttemptAt = new Date(now.getTime() + RETAKE_COOLDOWN_MS).toISOString();

  return {
    status: 'failed',
    score: calculatedScore,
    passMarkPercent: path.passMarkPercent,
    attemptCount: newAttemptCount,
    badgeIssued: false,
    nextAllowedAttemptAt,
    feedback: {
      totalQuestions,
      correctQuestions: correctCount,
      passed: false,
      topicsToReview,
    },
  };
}

/**
 * 10. Public Credential Verification (Unauthenticated).
 * Exposes ONLY public verification fields: recipientName, title, role, issue date.
 * Strictly hides memberUid, score, attempt counts, and private emails.
 */
export async function getPublicCertification(
  publicCertId: string
): Promise<PublicVerifiedCertification | null> {
  const cleanCertId = publicCertId.trim();
  if (!cleanCertId.startsWith('EFM-CERT-')) {
    return null;
  }

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      `public_verified_credentials?public_cert_id=eq.${encodeURIComponent(cleanCertId)}&select=*`
    );
    if (data && data.length > 0) {
      const d = data[0];
      return {
        publicCertId: d.public_cert_id,
        recipientName: d.recipient_name,
        recipientCompany: d.recipient_company || undefined,
        pathTitle: d.path_title,
        pathSlug: d.path_slug,
        targetRole: d.target_role,
        badgeIssuedAt: d.badge_issued_at,
        verifiedAt: new Date().toISOString(),
        isValid: true,
      };
    }
  }

  // Memory fallback lookup
  const cert = Array.from(MEMORY_CERTIFICATIONS.values()).find(
    (c) => c.publicCertId === cleanCertId && c.status === 'passed'
  );

  if (!cert || !cert.badgeIssuedAt || !cert.publicCertId) return null;

  const path = await getPathById(cert.pathId);
  if (!path) return null;

  return {
    publicCertId: cert.publicCertId!,
    recipientName: 'Verified FM Professional',
    recipientCompany: 'Commercial Property Operations',
    pathTitle: path.title,
    pathSlug: path.slug,
    targetRole: path.targetRole,
    badgeIssuedAt: cert.badgeIssuedAt,
    verifiedAt: new Date().toISOString(),
    isValid: true,
  };
}

// =============================================================================
// ADMIN AUTHORING DASHBOARD APIS (Prompt 2 Implementation)
// =============================================================================

/**
 * Admin: List all learning paths across all statuses (draft, published, archived).
 */
export async function listAllPathsForAdmin(): Promise<LearningPath[]> {
  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>(
      'academy_learning_paths?select=*&order=created_at.desc'
    );
    if (data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description,
        targetRole: d.target_role,
        modules: d.modules || [],
        passMarkPercent: d.pass_mark_percent,
        status: d.status,
        updatedBy: d.updated_by,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  }

  return Array.from(MEMORY_PATHS.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Admin: Create a new Learning Path. Defaults to 'draft' status.
 */
export async function createLearningPath(
  input: Partial<LearningPath>,
  adminUser: string
): Promise<LearningPath> {
  const now = new Date().toISOString();
  const id = input.id || `path-${crypto.randomUUID()}`;
  const slug = (
    input.slug ||
    input.title
      ?.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-') ||
    'learning-path'
  ).trim();

  const newPath: LearningPath = {
    id,
    slug,
    title: input.title || 'Untitled Learning Path',
    description: input.description || '',
    targetRole: input.targetRole || 'Specialist',
    modules: input.modules || [],
    passMarkPercent: input.passMarkPercent || 80,
    status: input.status || 'draft',
    updatedBy: adminUser,
    createdAt: now,
    updatedAt: now,
  };

  if (isDbConfigured()) {
    await dbQuery('academy_learning_paths', {
      method: 'POST',
      body: {
        id: newPath.id,
        slug: newPath.slug,
        title: newPath.title,
        description: newPath.description,
        target_role: newPath.targetRole,
        modules: newPath.modules,
        pass_mark_percent: newPath.passMarkPercent,
        status: newPath.status,
        updated_by: newPath.updatedBy,
        created_at: newPath.createdAt,
        updated_at: newPath.updatedAt,
      },
    });
  }

  MEMORY_PATHS.set(newPath.id, newPath);
  return newPath;
}

/**
 * Admin: Update an existing Learning Path.
 */
export async function updateLearningPath(
  pathId: string,
  updates: Partial<LearningPath>,
  adminUser: string
): Promise<LearningPath> {
  const existing = await getPathById(pathId);
  if (!existing) throw new Error(`Learning path '${pathId}' not found.`);

  const now = new Date().toISOString();
  const merged: LearningPath = {
    ...existing,
    ...updates,
    updatedBy: adminUser,
    updatedAt: now,
  };

  if (isDbConfigured()) {
    await dbQuery(`academy_learning_paths?id=eq.${encodeURIComponent(pathId)}`, {
      method: 'PATCH',
      body: {
        title: merged.title,
        slug: merged.slug,
        description: merged.description,
        target_role: merged.targetRole,
        modules: merged.modules,
        pass_mark_percent: merged.passMarkPercent,
        status: merged.status,
        updated_by: merged.updatedBy,
        updated_at: merged.updatedAt,
      },
    });
  }

  MEMORY_PATHS.set(pathId, merged);
  return merged;
}

/**
 * Admin: Archive a Learning Path.
 */
export async function archiveLearningPath(pathId: string, adminUser: string): Promise<LearningPath> {
  return updateLearningPath(pathId, { status: 'archived' }, adminUser);
}

/**
 * Admin: Get raw Assessment including correctOptionId and explanation.
 * GATED: Only for admin authoring requests.
 */
export async function getAdminAssessment(pathId: string): Promise<Assessment | null> {
  return getRawAssessmentForGrading(pathId);
}

/**
 * Admin: Upsert assessment questions, options, and correctOptionId.
 */
export async function upsertAdminAssessment(
  pathId: string,
  questions: AssessmentQuestion[],
  adminUser: string
): Promise<Assessment> {
  const now = new Date().toISOString();
  const existing = await getRawAssessmentForGrading(pathId);
  const nextVersion = (existing?.version || 0) + 1;
  const assessmentId = existing?.id || `assess-${crypto.randomUUID()}`;

  const updatedAssessment: Assessment = {
    id: assessmentId,
    pathId,
    questions,
    version: nextVersion,
    updatedBy: adminUser,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (isDbConfigured()) {
    if (existing) {
      await dbQuery(`academy_assessments?path_id=eq.${encodeURIComponent(pathId)}`, {
        method: 'PATCH',
        body: {
          questions: updatedAssessment.questions,
          version: updatedAssessment.version,
          updated_by: updatedAssessment.updatedBy,
          updated_at: updatedAssessment.updatedAt,
        },
      });
    } else {
      await dbQuery('academy_assessments', {
        method: 'POST',
        body: {
          id: updatedAssessment.id,
          path_id: pathId,
          questions: updatedAssessment.questions,
          version: updatedAssessment.version,
          updated_by: updatedAssessment.updatedBy,
          created_at: updatedAssessment.createdAt,
          updated_at: updatedAssessment.updatedAt,
        },
      });
    }
  }

  MEMORY_ASSESSMENTS.set(pathId, updatedAssessment);
  return updatedAssessment;
}

