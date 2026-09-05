/**
 * ENTIREFM RAMS & SAFETY JOB PACK SERVICE (CP-05)
 * ===============================================
 * Source of truth for job-specific RAMS, risk matrix computations,
 * operative eligibility cross-checks, version control, and approvals.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';
import { buildHtmlReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import {
  calculateRiskScore,
  CANONICAL_FM_ACTIVITIES,
  CANONICAL_HAZARDS,
  FmActivityTemplate,
  RiskLikelihood,
  RiskSeverity,
} from './rams-framework';
import { listContractorOperatives, getContractorOperativeById } from './workforce-service';
import { evaluateOperativeEligibility } from './operative-eligibility-engine';
import { TradeScope } from './competency-framework';

export type RamsLifecycleStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'CONTRACTOR_APPROVED'
  | 'SUBMITTED_TO_ENTIREFM'
  | 'CHANGES_REQUESTED'
  | 'ACCEPTED_FOR_WORK'
  | 'ISSUED'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export interface RamsHazardRecord {
  id: string;
  hazard: string;
  category: string;
  personsAtRisk: string[];
  initialLikelihood: RiskLikelihood;
  initialSeverity: RiskSeverity;
  initialRiskScore: number;
  controls: string[];
  residualLikelihood: RiskLikelihood;
  residualSeverity: RiskSeverity;
  residualRiskScore: number;
  entirefmMandatoryControl?: string;
  userEdited?: boolean;
}

export interface RamsMethodStepRecord {
  sequence: number;
  title: string;
  description: string;
  responsibleRole: string;
  safetyWarnings?: string[];
  permitRequired?: string;
}

export interface RamsRecord {
  id: string;
  contractorOrgId: string;
  contractorName: string;
  workOrderId?: string;
  workOrderNumber?: string;
  clientName: string;
  siteName: string;
  siteAddress?: string;
  title: string;
  workCategory: TradeScope;
  workScopeDescription: string;
  activityId?: string;
  version: string;
  status: RamsLifecycleStatus;
  isIndependentRams: boolean;
  
  // Environment
  buildingType: string;
  occupancyState: string;
  plannedStartDate: string;
  plannedEndDate?: string;
  workingHours: string;
  responsibleSupervisorId?: string;
  responsibleSupervisorName?: string;
  
  // People
  assignedOperatives: Array<{
    operativeId: string;
    fullName: string;
    role: string;
    trade: string;
    eligibilityStatus: string;
    ineligibilityReason?: string;
  }>;

  // Safety Data
  hazards: RamsHazardRecord[];
  methodSteps: RamsMethodStepRecord[];
  selectedPpe: string[];
  selectedPlant: string[];
  coshhProducts: Array<{
    name: string;
    manufacturer?: string;
    hazardClassification: string;
    sdsUrl?: string;
    storageRequirements?: string;
  }>;
  requiredPermits: string[];
  
  // Emergency & Environment
  emergencyArrangements: {
    emergencyContactName: string;
    emergencyContactPhone: string;
    nearestHospital?: string;
    firstAiderOnSite?: string;
    fireAssemblyPoint?: string;
    evacuationProcedure?: string;
    spillKitLocation?: string;
    specialistRescuePlan?: string;
  };
  environmentalControls: {
    wasteDisposalPlan: string;
    hazardousWasteHandling?: string;
    refrigerantRecoveryRef?: string;
    noiseDustVibrationControls?: string;
  };

  // Approvals & Workflow
  contractorApproval?: {
    approvedByPersonId: string;
    approvedByName: string;
    approvedAt: string;
    declarationText: string;
  };
  entirefmReview?: {
    reviewedByPersonId: string;
    reviewedByName: string;
    reviewedAt: string;
    decision: 'ACCEPTED_FOR_WORK' | 'CHANGES_REQUESTED' | 'REJECTED';
    generalNotes?: string;
    sectionComments?: Record<string, string>;
  };
  operativeBriefings: Array<{
    operativeId: string;
    operativeName: string;
    version: string;
    briefedAt: string;
    status: 'READ_AND_UNDERSTOOD' | 'PENDING';
  }>;

  sourceRamsId?: string;
  pdfStoragePath?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory persistence store for RAMS packs (populated dynamically during runtime)
const IN_MEMORY_RAMS_STORE: Map<string, RamsRecord> = new Map();

// ─────────────────────────────────────────────────────────────
// 1. LIST RAMS RECORDS
// ─────────────────────────────────────────────────────────────
export async function listRamsRecords(
  contractorOrgId: string,
  session: UserSession,
  filter?: {
    status?: string;
    workOrderId?: string;
    isIndependent?: boolean;
    searchQuery?: string;
  }
): Promise<RamsRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: You may only view RAMS for your own organisation');
  }

  // Retrieve records from in-memory store
  let list = Array.from(IN_MEMORY_RAMS_STORE.values()).filter(
    (r) => r.contractorOrgId === contractorOrgId || session.orgType === 'ENTIREFM'
  );

  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((r) => r.status === filter.status);
  }

  if (filter?.workOrderId) {
    list = list.filter((r) => r.workOrderId === filter.workOrderId);
  }

  if (filter?.isIndependent !== undefined) {
    list = list.filter((r) => r.isIndependentRams === filter.isIndependent);
  }

  if (filter?.searchQuery && filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.siteName.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        (r.workOrderNumber && r.workOrderNumber.toLowerCase().includes(q))
    );
  }

  // Sort descending by updated date
  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// ─────────────────────────────────────────────────────────────
// 2. GET RAMS BY ID
// ─────────────────────────────────────────────────────────────
export async function getRamsRecordById(
  ramsId: string,
  session: UserSession
): Promise<RamsRecord | null> {
  const rams = IN_MEMORY_RAMS_STORE.get(ramsId);
  if (!rams) return null;

  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== rams.contractorOrgId) {
    throw new Error('FORBIDDEN: Access to this RAMS pack is restricted');
  }

  return rams;
}

// ─────────────────────────────────────────────────────────────
// 3. VALIDATE RAMS READINESS
// ─────────────────────────────────────────────────────────────
export function validateRamsReadiness(rams: RamsRecord): {
  isReady: boolean;
  readinessStatus: 'READY_FOR_APPROVAL' | 'ACTION_REQUIRED' | 'CRITICAL_MISSING';
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  if (!rams.title || rams.title.trim().length < 5) missingFields.push('RAMS Title');
  if (!rams.siteName || rams.siteName.trim().length < 3) missingFields.push('Site Location');
  if (!rams.workScopeDescription || rams.workScopeDescription.trim().length < 10) missingFields.push('Work Scope Description');
  if (!rams.plannedStartDate) missingFields.push('Planned Start Date');
  if (rams.hazards.length === 0) missingFields.push('At least one Hazard Assessment');
  if (rams.methodSteps.length === 0) missingFields.push('Work Method Sequence Steps');
  if (rams.selectedPpe.length === 0) missingFields.push('Mandatory PPE Selection');
  if (!rams.emergencyArrangements?.emergencyContactPhone) missingFields.push('Emergency Contact Telephone');

  // Check for critical hazards without controls
  const unaddressedHazards = rams.hazards.filter((h) => h.controls.length === 0);
  if (unaddressedHazards.length > 0) {
    missingFields.push(`Control measures missing for ${unaddressedHazards.length} identified hazards`);
  }

  // Check operative eligibility
  const ineligibleOps = rams.assignedOperatives.filter((op) => op.eligibilityStatus !== 'ELIGIBLE' && op.eligibilityStatus !== 'ELIGIBLE_WITH_WARNING');
  if (ineligibleOps.length > 0) {
    warnings.push(`${ineligibleOps.length} assigned operative(s) have compliance action warnings: ${ineligibleOps.map((o) => o.fullName).join(', ')}`);
  }

  let readinessStatus: 'READY_FOR_APPROVAL' | 'ACTION_REQUIRED' | 'CRITICAL_MISSING' = 'READY_FOR_APPROVAL';
  if (missingFields.length > 0) {
    readinessStatus = missingFields.length > 2 ? 'CRITICAL_MISSING' : 'ACTION_REQUIRED';
  }

  return {
    isReady: missingFields.length === 0,
    readinessStatus,
    missingFields,
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────
// 4. CREATE RAMS RECORD
// ─────────────────────────────────────────────────────────────
export async function createRamsRecord(
  params: {
    contractorOrgId: string;
    workOrderId?: string;
    workOrderNumber?: string;
    clientName: string;
    siteName: string;
    siteAddress?: string;
    title: string;
    workCategory: TradeScope;
    workScopeDescription: string;
    activityId?: string;
    buildingType?: string;
    occupancyState?: string;
    plannedStartDate: string;
    plannedEndDate?: string;
    workingHours?: string;
    responsibleSupervisorId?: string;
    responsibleSupervisorName?: string;
    assignedOperativeIds?: string[];
    isIndependentRams?: boolean;
    templateId?: string;
  },
  session: UserSession
): Promise<{ success: boolean; id: string; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== params.contractorOrgId) {
    return { success: false, id: '', error: 'Forbidden' };
  }

  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const serial = String(IN_MEMORY_RAMS_STORE.size + 101).padStart(5, '0');
  const ramsId = `RAMS-${year}-${serial}`;

  // Find template defaults
  const template = CANONICAL_FM_ACTIVITIES.find((a) => a.id === params.activityId || a.trade === params.workCategory) || CANONICAL_FM_ACTIVITIES[0];

  // Resolve operatives and evaluate CP-04 eligibility
  const assignedOperatives: RamsRecord['assignedOperatives'] = [];
  if (params.assignedOperativeIds && params.assignedOperativeIds.length > 0) {
    for (const opId of params.assignedOperativeIds) {
      const opProfile = await getContractorOperativeById(opId, session);
      if (opProfile) {
        const evalResult = await evaluateOperativeEligibility(opProfile, {
          workOrderId: params.workOrderId || ramsId,
          title: params.title,
          trade: params.workCategory,
        }, session);

        assignedOperatives.push({
          operativeId: opProfile.id,
          fullName: opProfile.fullName,
          role: opProfile.jobTitle,
          trade: opProfile.trades[0] || 'General Maintenance',
          eligibilityStatus: evalResult.status,
          ineligibilityReason: evalResult.failedChecks[0]?.detail,
        });
      }
    }
  }

  const newRams: RamsRecord = {
    id: ramsId,
    contractorOrgId: params.contractorOrgId,
    contractorName: session.orgName || 'Contractor Organisation',
    workOrderId: params.workOrderId,
    workOrderNumber: params.workOrderNumber,
    clientName: params.clientName,
    siteName: params.siteName,
    siteAddress: params.siteAddress,
    title: params.title,
    workCategory: params.workCategory,
    workScopeDescription: params.workScopeDescription,
    activityId: params.activityId || template.id,
    version: '1.0',
    status: 'DRAFT',
    isIndependentRams: params.isIndependentRams ?? !params.workOrderId,
    buildingType: params.buildingType || 'Commercial Building',
    occupancyState: params.occupancyState || 'Occupied',
    plannedStartDate: params.plannedStartDate,
    plannedEndDate: params.plannedEndDate,
    workingHours: params.workingHours || '08:00 - 17:00',
    responsibleSupervisorId: params.responsibleSupervisorId,
    responsibleSupervisorName: params.responsibleSupervisorName,
    assignedOperatives,
    hazards: template.defaultHazards.map((h) => {
      const initCalc = calculateRiskScore(h.initialLikelihood, h.initialSeverity);
      const resCalc = calculateRiskScore(h.residualLikelihood, h.residualSeverity);
      return {
        id: h.id,
        hazard: h.hazard,
        category: h.category,
        personsAtRisk: h.personsAtRisk,
        initialLikelihood: h.initialLikelihood,
        initialSeverity: h.initialSeverity,
        initialRiskScore: initCalc.score,
        controls: h.standardControls,
        residualLikelihood: h.residualLikelihood,
        residualSeverity: h.residualSeverity,
        residualRiskScore: resCalc.score,
        entirefmMandatoryControl: h.entirefmMandatoryControl,
      };
    }),
    methodSteps: template.defaultMethodSteps,
    selectedPpe: template.recommendedPpe.map((p) => p.replace(/_/g, ' ')),
    selectedPlant: template.recommendedPlant.map((p) => p.replace(/_/g, ' ')),
    coshhProducts: [],
    requiredPermits: template.potentialPermits.map((p) => p.replace(/_/g, ' ')),
    emergencyArrangements: {
      emergencyContactName: `${session.name || 'Contractor Supervisor'} (${session.orgName || 'Contractor'})`,
      emergencyContactPhone: '+44 800 123 4567',
      nearestHospital: 'Local NHS Emergency Department',
      firstAiderOnSite: 'Qualified First Aider on Team',
      fireAssemblyPoint: 'Designated Site Fire Assembly Point',
      evacuationProcedure: 'Immediately isolate active plant, turn off tools, and follow emergency exit signs to the designated assembly area.',
    },
    environmentalControls: {
      wasteDisposalPlan: 'All scrap metal, old components, and cardboard packaging segregated and recycled.',
    },
    operativeBriefings: [],
    createdAt: now,
    updatedAt: now,
  };

  IN_MEMORY_RAMS_STORE.set(ramsId, newRams);

  await recordAuditEvent({
    event_type: 'RAMS_CREATED',
    object_type: 'rams_packs',
    object_id: ramsId,
    actor_id: session.personId,
    after_state: {
      ramsId,
      title: newRams.title,
      isIndependent: newRams.isIndependentRams,
      workOrderId: newRams.workOrderId,
    },
  });

  return { success: true, id: ramsId };
}

// ─────────────────────────────────────────────────────────────
// 5. UPDATE RAMS RECORD
// ─────────────────────────────────────────────────────────────
export async function updateRamsRecord(
  ramsId: string,
  updates: Partial<RamsRecord>,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  const existing = await getRamsRecordById(ramsId, session);
  if (!existing) return { success: false, error: 'RAMS not found' };

  // If already issued, disallow direct overwrite without new version
  if (existing.status === 'ISSUED' || existing.status === 'ACCEPTED_FOR_WORK') {
    return { success: false, error: 'Issued RAMS are immutable. Please create a new revision version.' };
  }

  const updated: RamsRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  IN_MEMORY_RAMS_STORE.set(ramsId, updated);

  await recordAuditEvent({
    event_type: 'RAMS_UPDATED',
    object_type: 'rams_packs',
    object_id: ramsId,
    actor_id: session.personId,
    after_state: {
      ramsId,
      title: updated.title,
      status: updated.status,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 6. CONTRACTOR APPROVAL
// ─────────────────────────────────────────────────────────────
export async function approveRamsByContractor(
  ramsId: string,
  approval: { declarationText: string },
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  const rams = await getRamsRecordById(ramsId, session);
  if (!rams) return { success: false, error: 'RAMS not found' };

  const validation = validateRamsReadiness(rams);
  if (!validation.isReady) {
    return {
      success: false,
      error: `RAMS cannot be approved. Missing mandatory safety controls: ${validation.missingFields.join(', ')}`,
    };
  }

  const now = new Date().toISOString();
  const nextStatus: RamsLifecycleStatus = rams.isIndependentRams ? 'ISSUED' : 'SUBMITTED_TO_ENTIREFM';

  rams.status = nextStatus;
  rams.contractorApproval = {
    approvedByPersonId: session.personId,
    approvedByName: session.name || 'Contractor Approver',
    approvedAt: now,
    declarationText: approval.declarationText,
  };
  rams.updatedAt = now;

  IN_MEMORY_RAMS_STORE.set(ramsId, rams);

  await recordAuditEvent({
    event_type: 'RAMS_CONTRACTOR_APPROVED',
    object_type: 'rams_packs',
    object_id: ramsId,
    actor_id: session.personId,
    after_state: {
      ramsId,
      status: nextStatus,
      approvedBy: rams.contractorApproval.approvedByName,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 7. ENTIREFM COMPLIANCE REVIEW
// ─────────────────────────────────────────────────────────────
export async function reviewRamsByEntirefm(
  ramsId: string,
  review: {
    decision: 'ACCEPTED_FOR_WORK' | 'CHANGES_REQUESTED' | 'REJECTED';
    generalNotes?: string;
    sectionComments?: Record<string, string>;
  },
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (session.orgType !== 'ENTIREFM') {
    return { success: false, error: 'FORBIDDEN: EntireFM staff authorisation required' };
  }

  const rams = IN_MEMORY_RAMS_STORE.get(ramsId);
  if (!rams) return { success: false, error: 'RAMS not found' };

  const now = new Date().toISOString();
  const nextStatus: RamsLifecycleStatus =
    review.decision === 'ACCEPTED_FOR_WORK'
      ? 'ACCEPTED_FOR_WORK'
      : review.decision === 'CHANGES_REQUESTED'
      ? 'CHANGES_REQUESTED'
      : 'ARCHIVED';

  rams.status = nextStatus;
  rams.entirefmReview = {
    reviewedByPersonId: session.personId,
    reviewedByName: session.name || 'EntireFM Safety Reviewer',
    reviewedAt: now,
    decision: review.decision,
    generalNotes: review.generalNotes,
    sectionComments: review.sectionComments,
  };
  rams.updatedAt = now;

  IN_MEMORY_RAMS_STORE.set(ramsId, rams);

  await recordAuditEvent({
    event_type: 'RAMS_ENTIREFM_REVIEWED',
    object_type: 'rams_packs',
    object_id: ramsId,
    actor_id: session.personId,
    after_state: {
      ramsId,
      decision: review.decision,
      reviewedBy: rams.entirefmReview.reviewedByName,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 8. RECORD OPERATIVE BRIEFING
// ─────────────────────────────────────────────────────────────
export async function recordOperativeBriefing(
  ramsId: string,
  operativeId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  const rams = await getRamsRecordById(ramsId, session);
  if (!rams) return { success: false, error: 'RAMS not found' };

  const op = await getContractorOperativeById(operativeId, session);
  const operativeName = op?.fullName || session.name || 'Operative';
  const now = new Date().toISOString();

  // Remove prior briefing for same operative and append current version
  rams.operativeBriefings = rams.operativeBriefings.filter((b) => b.operativeId !== operativeId);
  rams.operativeBriefings.push({
    operativeId,
    operativeName,
    version: rams.version,
    briefedAt: now,
    status: 'READ_AND_UNDERSTOOD',
  });
  rams.updatedAt = now;

  IN_MEMORY_RAMS_STORE.set(ramsId, rams);

  await recordAuditEvent({
    event_type: 'RAMS_OPERATIVE_BRIEFED',
    object_type: 'rams_packs',
    object_id: ramsId,
    actor_id: session.personId,
    after_state: {
      ramsId,
      operativeName,
      version: rams.version,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 9. DUPLICATE RAMS
// ─────────────────────────────────────────────────────────────
export async function duplicateRamsRecord(
  sourceRamsId: string,
  session: UserSession
): Promise<{ success: boolean; newRamsId: string; error?: string }> {
  const source = await getRamsRecordById(sourceRamsId, session);
  if (!source) return { success: false, newRamsId: '', error: 'Source RAMS not found' };

  const result = await createRamsRecord(
    {
      contractorOrgId: source.contractorOrgId,
      title: `${source.title} (Copy)`,
      clientName: source.clientName,
      siteName: source.siteName,
      siteAddress: source.siteAddress,
      workCategory: source.workCategory,
      workScopeDescription: source.workScopeDescription,
      activityId: source.activityId,
      buildingType: source.buildingType,
      occupancyState: source.occupancyState,
      plannedStartDate: new Date().toISOString().split('T')[0],
      workingHours: source.workingHours,
      responsibleSupervisorId: source.responsibleSupervisorId,
      responsibleSupervisorName: source.responsibleSupervisorName,
      assignedOperativeIds: source.assignedOperatives.map((o) => o.operativeId),
      isIndependentRams: true,
    },
    session
  );

  return { success: result.success, newRamsId: result.id, error: result.error };
}

// ─────────────────────────────────────────────────────────────
// 10. GENERATE RAMS PRINTABLE HTML REPORT (PDF PIPELINE)
// ─────────────────────────────────────────────────────────────
export function generateRamsPdfHtml(rams: RamsRecord): string {
  const pdfDef: PdfDocumentDefinition = {
    title: rams.title,
    subtitle: `${rams.workCategory} • Risk Assessment & Method Statement (RAMS)`,
    documentRef: `${rams.id} (v${rams.version})`,
    date: new Date(rams.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    siteName: `${rams.siteName} (${rams.clientName})`,
    organisationName: rams.contractorName,
    author: rams.contractorApproval?.approvedByName || 'Authorized Health & Safety Representative',
    badgeText: rams.status.replace(/_/g, ' '),
    summaryStats: [
      { label: 'Work Scope', value: rams.workCategory, detail: rams.buildingType },
      { label: 'Planned Start', value: rams.plannedStartDate, detail: rams.workingHours },
      { label: 'Identified Hazards', value: String(rams.hazards.length), detail: 'Specific Controls' },
      { label: 'Lead Supervisor', value: rams.responsibleSupervisorName || 'On Site Lead', detail: 'EFAW Certified' },
    ],
    sections: [
      {
        type: 'text',
        heading: '1. Work Scope & Task Description',
        paragraphs: [rams.workScopeDescription],
      },
      {
        type: 'table',
        heading: '2. Hazard Identification & Risk Assessment Matrix (5x5)',
        columns: [
          { header: 'Hazard Description', widthPercent: 30 },
          { header: 'Persons at Risk', widthPercent: 15 },
          { header: 'Initial', widthPercent: 8, align: 'center' },
          { header: 'Control Measures & Safeguards', widthPercent: 37 },
          { header: 'Residual', widthPercent: 10, align: 'center' },
        ],
        rows: rams.hazards.map((h) => [
          h.hazard,
          h.personsAtRisk.join(', '),
          `L${h.initialLikelihood}×S${h.initialSeverity} (${h.initialRiskScore})`,
          h.controls.join('; ') + (h.entirefmMandatoryControl ? ` [MANDATORY: ${h.entirefmMandatoryControl}]` : ''),
          `L${h.residualLikelihood}×S${h.residualSeverity} (${h.residualRiskScore})`,
        ]),
      },
      {
        type: 'table',
        heading: '3. Step-by-Step Method Statement Sequence',
        columns: [
          { header: 'Step', widthPercent: 8, align: 'center' },
          { header: 'Action Title', widthPercent: 22 },
          { header: 'Detailed Procedure & Safety Controls', widthPercent: 55 },
          { header: 'Role', widthPercent: 15 },
        ],
        rows: rams.methodSteps.map((s) => [
          String(s.sequence),
          s.title,
          s.description + (s.safetyWarnings?.length ? ` ⚠️ ${s.safetyWarnings.join(' ')}` : ''),
          s.responsibleRole,
        ]),
      },
      {
        type: 'cards',
        heading: '4. PPE, Plant & Emergency Arrangements',
        items: [
          {
            title: 'Required PPE & Plant Equipment',
            body: `Mandatory PPE: ${rams.selectedPpe.join(', ') || 'Standard Site PPE'}.\nPlant & Access: ${rams.selectedPlant.join(', ') || 'Hand tools only'}.`,
          },
          {
            title: 'Emergency Contacts & Site Procedures',
            body: `Emergency Contact: ${rams.emergencyArrangements.emergencyContactName} (${rams.emergencyArrangements.emergencyContactPhone}).\nNearest Hospital: ${rams.emergencyArrangements.nearestHospital || 'Local A&E'}.\nEvacuation: ${rams.emergencyArrangements.evacuationProcedure}`,
          },
          {
            title: 'Environmental & Waste Controls',
            body: rams.environmentalControls.wasteDisposalPlan,
          },
        ],
      },
    ],
    complianceNotes: [
      'This Risk Assessment and Method Statement has been prepared in accordance with the Health and Safety at Work etc. Act 1974 and the Management of Health and Safety at Work Regulations 1999.',
      'All operatives must sign the briefing register below prior to undertaking works on site.',
    ],
    disclaimerText: 'EntireFM CAFM Supply Chain Safety Platform. Generated digitally with full audit trail.',
  };

  return buildHtmlReport(pdfDef);
}
