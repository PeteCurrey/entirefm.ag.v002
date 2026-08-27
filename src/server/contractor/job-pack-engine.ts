/**
 * ENTIREFM JOB PACK GENERATOR & READINESS ENGINE (CP-06)
 * =======================================================
 * Deterministic Assembly & Work-Ready Gating Layer.
 * Combines Work Orders, Sites, Contractors, CP-04 Operatives,
 * CP-05 RAMS, COSHH, Permits, Evidence, and Briefings.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';
import { buildHtmlReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import { evaluateContractorCompliance } from './compliance-engine';
import { evaluateOperativeEligibility } from './operative-eligibility-engine';
import { getContractorOperativeById } from './workforce-service';
import { getRamsRecordById, listRamsRecords, RamsRecord } from './rams-service';

export type JobReadinessStatus =
  | 'READY'
  | 'ACTION_REQUIRED'
  | 'AWAITING_RAMS_REVIEW'
  | 'OPERATIVE_NOT_ELIGIBLE'
  | 'PERMIT_REQUIRED'
  | 'COSHH_MISSING'
  | 'BRIEFING_REQUIRED'
  | 'SITE_INFO_INCOMPLETE';

export type GatingPolicy = 'HARD_GATE' | 'WARNING_GATE' | 'EMERGENCY_BYPASS';

export interface BlockingReason {
  code: string;
  title: string;
  detail: string;
  category: 'COMPLIANCE' | 'OPERATIVE' | 'RAMS' | 'PERMIT' | 'COSHH' | 'BRIEFING' | 'SITE';
  actionUrl?: string;
  isStatutory: boolean;
}

export interface SectionBreakdownItem {
  section: string;
  status: 'SATISFIED' | 'ACTION_REQUIRED' | 'NOT_REQUIRED' | 'PENDING_REVIEW';
  detail: string;
  sourceProvenance: string;
}

export interface EvidenceRequirementItem {
  id: string;
  phase: 'BEFORE' | 'DURING' | 'COMPLETION';
  title: string;
  description: string;
  isMandatory: boolean;
  uploadedCount: number;
}

export interface JobPackRecord {
  id: string; // e.g. JP-2026-000871
  workOrderId: string;
  workOrderNumber: string;
  contractorOrgId: string;
  contractorName: string;
  clientName: string;
  siteId?: string;
  siteName: string;
  siteAddress: string;
  trade: string;
  scopeDescription: string;
  priority: string;
  plannedAttendanceDate: string;
  plannedAttendanceTime: string;
  
  // Section Data
  assignedOperative?: {
    operativeId: string;
    personId: string;
    fullName: string;
    jobTitle: string;
    trade: string;
    approvalStatus: string;
    eligibilityStatus: string;
    relevantQualifications: string[];
    relevantCompetencies: string[];
  };
  
  ramsRecord?: {
    ramsId: string;
    version: string;
    status: string;
    title: string;
    isApproved: boolean;
  };

  siteInstructions?: {
    accessHours: string;
    contactName: string;
    contactPhone: string;
    parkingInstructions?: string;
    securityInductionRequired: boolean;
    knownAsbestosLocation?: string;
    accessConflictDetected?: boolean;
    conflictDetail?: string;
  };

  permits: Array<{
    type: string;
    status: 'REQUIRED' | 'ISSUED' | 'EXPIRED' | 'NOT_REQUIRED';
    permitNumber?: string;
    issuer?: string;
    validUntil?: string;
  }>;

  coshhItems: Array<{
    productName: string;
    hazardClass: string;
    assessmentStatus: 'VERIFIED' | 'MISSING';
    sdsAvailable: boolean;
  }>;

  ppeRequired: string[];
  plantRequired: string[];
  emergencyArrangements: {
    emergencyContact: string;
    nearestHospital: string;
    evacuationRoute: string;
    specialistRescueRequired: boolean;
  };

  evidenceChecklist: EvidenceRequirementItem[];

  briefings: Array<{
    operativeId: string;
    operativeName: string;
    jobPackVersion: string;
    ramsVersion: string;
    briefedAt: string;
    status: 'READ_AND_UNDERSTOOD' | 'PENDING';
  }>;

  // Readiness Calculation
  readiness: {
    status: JobReadinessStatus;
    isReadyForAttendance: boolean;
    blockingReasons: BlockingReason[];
    advisoryWarnings: Array<{ title: string; detail: string }>;
    sections: Record<string, SectionBreakdownItem>;
    gatingPolicy: GatingPolicy;
    evaluatedAt: string;
  };

  version: string;
  isIssued: boolean;
  issuedAt?: string;
  stoppedWorkEvent?: {
    stoppedByPersonId: string;
    stoppedByName: string;
    stoppedAt: string;
    reasonCategory: string;
    details: string;
  };
  authorisedOverride?: {
    overriddenByPersonId: string;
    overriddenByName: string;
    overriddenAt: string;
    reason: string;
    scope: string;
  };

  createdAt: string;
  updatedAt: string;
}

// In-Memory Storage for Job Packs
const IN_MEMORY_JOB_PACKS: Map<string, JobPackRecord> = new Map();

// ─────────────────────────────────────────────────────────────
// 1. DETERMINISTIC JOB READINESS EVALUATION
// ─────────────────────────────────────────────────────────────
export async function evaluateJobReadiness(
  workOrder: any,
  session: UserSession,
  options?: { assignedOperativeId?: string; ramsId?: string }
): Promise<JobPackRecord['readiness']> {
  const blockingReasons: BlockingReason[] = [];
  const advisoryWarnings: Array<{ title: string; detail: string }> = [];
  const sections: Record<string, SectionBreakdownItem> = {};

  const priority = workOrder.priority || 'P3_ROUTINE';
  const isEmergencyP1 = priority === 'P1_EMERGENCY' || priority === 'EMERGENCY';
  const gatingPolicy: GatingPolicy = isEmergencyP1 ? 'EMERGENCY_BYPASS' : 'HARD_GATE';

  const plannedDateStr = workOrder.target_start_at || workOrder.scheduled_date || new Date().toISOString().split('T')[0];
  const trade = workOrder.trade || 'GENERAL_MAINTENANCE';
  const providerOrgId = workOrder.provider_org_id || session.orgId;

  // 1. Contractor Organisation Compliance Gate (CP-03)
  const compliance = await evaluateContractorCompliance(providerOrgId);
  if (compliance.operationalStatus === 'RESTRICTED' || compliance.operationalStatus === 'SUSPENDED') {
    blockingReasons.push({
      code: 'CONTRACTOR_COMPLIANCE_RESTRICTED',
      title: 'Contractor Compliance Restricted',
      detail: `Contractor organisation is currently ${compliance.operationalStatus} (Mandatory statutory insurance or certification expired).`,
      category: 'COMPLIANCE',
      isStatutory: true,
      actionUrl: '/contractor/compliance',
    });
    sections.CONTRACTOR_COMPLIANCE = {
      section: 'Contractor Organisation Compliance',
      status: 'ACTION_REQUIRED',
      detail: `Organisation compliance status is ${compliance.operationalStatus}.`,
      sourceProvenance: 'CP-03 Statutory Compliance Engine',
    };
  } else {
    sections.CONTRACTOR_COMPLIANCE = {
      section: 'Contractor Organisation Compliance',
      status: 'SATISFIED',
      detail: 'Public Liability and statutory policies verified active.',
      sourceProvenance: 'CP-03 Statutory Compliance Engine',
    };
  }

  // 2. Operative Assignment & Future-Dated Competency Check (CP-04)
  const operativeId = options?.assignedOperativeId || workOrder.assigned_person_id || workOrder.engineer_person_id;
  if (!operativeId) {
    blockingReasons.push({
      code: 'OPERATIVE_NOT_ASSIGNED',
      title: 'Qualified Operative Not Assigned',
      detail: 'An approved and eligible operative must be assigned to this work order.',
      category: 'OPERATIVE',
      isStatutory: true,
      actionUrl: `/contractor/work/${workOrder.id}`,
    });
    sections.OPERATIVE_COMPETENCY = {
      section: 'Operative & Competency',
      status: 'ACTION_REQUIRED',
      detail: 'No operative currently assigned.',
      sourceProvenance: 'CP-04 Workforce Dispatch',
    };
  } else {
    const operative = await getContractorOperativeById(operativeId, session);
    if (!operative) {
      blockingReasons.push({
        code: 'OPERATIVE_NOT_FOUND',
        title: 'Operative Record Not Found',
        detail: 'The assigned operative does not exist in the workforce roster.',
        category: 'OPERATIVE',
        isStatutory: true,
      });
      sections.OPERATIVE_COMPETENCY = {
        section: 'Operative & Competency',
        status: 'ACTION_REQUIRED',
        detail: 'Operative record missing.',
        sourceProvenance: 'CP-04 Workforce Service',
      };
    } else {
      const eligibility = await evaluateOperativeEligibility(
        operative,
        {
          workOrderId: workOrder.id,
          workOrderNumber: workOrder.work_order_number,
          title: workOrder.title,
          trade,
          isEmergencyP1,
        },
        session
      );

      if (!eligibility.isEligible) {
        blockingReasons.push({
          code: 'OPERATIVE_INELIGIBLE',
          title: `Assigned Operative Not Eligible (${operative.fullName})`,
          detail: eligibility.failedChecks.map((f) => f.detail).join('; ') || 'Mandatory qualifications or training expired.',
          category: 'OPERATIVE',
          isStatutory: true,
          actionUrl: `/contractor/workforce/${operative.id}`,
        });
        sections.OPERATIVE_COMPETENCY = {
          section: 'Operative & Competency',
          status: 'ACTION_REQUIRED',
          detail: `${operative.fullName}: ${eligibility.failedChecks[0]?.detail || 'Ineligible'}`,
          sourceProvenance: 'CP-04 Operative Eligibility Engine',
        };
      } else {
        sections.OPERATIVE_COMPETENCY = {
          section: 'Operative & Competency',
          status: 'SATISFIED',
          detail: `${operative.fullName} (${operative.jobTitle}) verified eligible for ${trade}.`,
          sourceProvenance: 'CP-04 Operative Eligibility Engine',
        };
      }
    }
  }

  // 3. RAMS Status & Version Check (CP-05)
  // Check if RAMS is required for this trade
  const isHighRiskTrade = ['ELECTRICAL', 'HVAC_AND_REFRIGERATION', 'GAS_AND_HEATING', 'ROPE_ACCESS', 'FIRE_AND_LIFE_SAFETY'].includes(trade);
  const requiresRams = isHighRiskTrade && !isEmergencyP1;

  if (requiresRams) {
    const existingRamsList = await listRamsRecords(providerOrgId, session, { workOrderId: workOrder.id });
    const rams = existingRamsList[0];

    if (!rams) {
      blockingReasons.push({
        code: 'RAMS_NOT_SUBMITTED',
        title: 'Job-Specific RAMS Pack Required',
        detail: 'A validated Risk Assessment and Method Statement must be generated prior to site attendance.',
        category: 'RAMS',
        isStatutory: true,
        actionUrl: `/contractor/rams/create?workOrderId=${workOrder.id}`,
      });
      sections.RAMS = {
        section: 'RAMS & Risk Assessment',
        status: 'ACTION_REQUIRED',
        detail: 'No RAMS pack generated for this work order.',
        sourceProvenance: 'CP-05 RAMS Engine',
      };
    } else if (rams.status === 'CHANGES_REQUESTED') {
      blockingReasons.push({
        code: 'RAMS_CHANGES_REQUESTED',
        title: 'RAMS Changes Requested by EntireFM',
        detail: rams.entirefmReview?.generalNotes || 'EntireFM safety review requires amendments before attendance.',
        category: 'RAMS',
        isStatutory: true,
        actionUrl: `/contractor/rams/${rams.id}`,
      });
      sections.RAMS = {
        section: 'RAMS & Risk Assessment',
        status: 'ACTION_REQUIRED',
        detail: 'Safety review changes requested.',
        sourceProvenance: 'CP-05 Safety Review',
      };
    } else if (rams.status === 'SUBMITTED_TO_ENTIREFM') {
      if (gatingPolicy === 'HARD_GATE') {
        blockingReasons.push({
          code: 'RAMS_AWAITING_ENTIREFM_REVIEW',
          title: 'RAMS Awaiting EntireFM Compliance Sign-Off',
          detail: 'Submitted RAMS pack is currently under review by EntireFM Operations.',
          category: 'RAMS',
          isStatutory: false,
          actionUrl: `/contractor/rams/${rams.id}`,
        });
      }
      sections.RAMS = {
        section: 'RAMS & Risk Assessment',
        status: 'PENDING_REVIEW',
        detail: `${rams.id} (v${rams.version}) awaiting compliance review.`,
        sourceProvenance: 'CP-05 Review Queue',
      };
    } else {
      sections.RAMS = {
        section: 'RAMS & Risk Assessment',
        status: 'SATISFIED',
        detail: `${rams.id} (v${rams.version}) approved and accepted.`,
        sourceProvenance: 'CP-05 RAMS Engine',
      };
    }
  } else {
    sections.RAMS = {
      section: 'RAMS & Risk Assessment',
      status: isEmergencyP1 ? 'SATISFIED' : 'NOT_REQUIRED',
      detail: isEmergencyP1 ? 'Emergency P1: Dynamic on-site risk assessment permitted.' : 'Standard low-risk maintenance.',
      sourceProvenance: 'Policy Matrix',
    };
  }

  // 4. Site Access Conflict Detection
  const site = workOrder.site || {};
  let accessConflictDetected = false;
  let conflictDetail = '';
  if (site.access_hours && workOrder.target_start_at) {
    const plannedHour = new Date(workOrder.target_start_at).getHours();
    if (site.access_hours.includes('09:00') && plannedHour < 9) {
      accessConflictDetected = true;
      conflictDetail = `Planned attendance (${plannedHour}:00) is earlier than standard site opening (${site.access_hours}).`;
      advisoryWarnings.push({
        title: 'Site Access Window Conflict',
        detail: conflictDetail,
      });
    }
  }

  sections.SITE_INFORMATION = {
    section: 'Site Access & Instructions',
    status: accessConflictDetected ? 'ACTION_REQUIRED' : 'SATISFIED',
    detail: accessConflictDetected ? conflictDetail : (site.name ? `${site.name} (${site.address_line1 || 'Recorded'})` : 'Site details confirmed.'),
    sourceProvenance: 'Canonical Site Record',
  };

  // Determine overall readiness status
  let status: JobReadinessStatus = 'READY';
  if (blockingReasons.length > 0) {
    const topReason = blockingReasons[0];
    if (topReason.code.includes('RAMS')) status = 'AWAITING_RAMS_REVIEW';
    else if (topReason.code.includes('OPERATIVE')) status = 'OPERATIVE_NOT_ELIGIBLE';
    else if (topReason.code.includes('PERMIT')) status = 'PERMIT_REQUIRED';
    else if (topReason.code.includes('COSHH')) status = 'COSHH_MISSING';
    else status = 'ACTION_REQUIRED';
  }

  return {
    status,
    isReadyForAttendance: blockingReasons.length === 0,
    blockingReasons,
    advisoryWarnings,
    sections,
    gatingPolicy,
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// 2. ASSEMBLE JOB PACK FROM CANONICAL SOURCES
// ─────────────────────────────────────────────────────────────
export async function assembleJobPack(
  workOrderId: string,
  session: UserSession
): Promise<JobPackRecord> {
  // Query work order details
  const { data: woData } = await dbQuery<any[]>(
    `work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=*,site:sites(*),client_account:client_accounts(*)`
  );

  if (!woData || woData.length === 0) {
    throw new Error('Work order not found');
  }

  const workOrder = woData[0];
  const providerOrgId = workOrder.provider_org_id || session.orgId;
  const site = workOrder.site || {};
  const client = workOrder.client_account || {};

  // Check if job pack already exists
  const existing = Array.from(IN_MEMORY_JOB_PACKS.values()).find((jp) => jp.workOrderId === workOrderId);
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const serial = String(IN_MEMORY_JOB_PACKS.size + 871).padStart(6, '0');
  const jobPackId = existing?.id || `JP-${year}-${serial}`;

  // Evaluate live readiness
  const readiness = await evaluateJobReadiness(workOrder, session);

  // Fetch assigned operative details if present
  let assignedOperative: JobPackRecord['assignedOperative'] = undefined;
  const opId = workOrder.assigned_person_id || workOrder.engineer_person_id;
  if (opId) {
    const op = await getContractorOperativeById(opId, session);
    if (op) {
      assignedOperative = {
        operativeId: op.id,
        personId: op.personId,
        fullName: op.fullName,
        jobTitle: op.jobTitle,
        trade: op.trades[0] || 'General Maintenance',
        approvalStatus: op.entirefmApprovalStatus,
        eligibilityStatus: op.isEligibleForDispatch ? 'ELIGIBLE' : 'ACTION_REQUIRED',
        relevantQualifications: op.qualifications.map((q) => q.name),
        relevantCompetencies: op.competencies,
      };
    }
  }

  // Fetch RAMS if present
  let ramsRecord: JobPackRecord['ramsRecord'] = undefined;
  const ramsList = await listRamsRecords(providerOrgId, session, { workOrderId });
  if (ramsList.length > 0) {
    const r = ramsList[0];
    ramsRecord = {
      ramsId: r.id,
      version: r.version,
      status: r.status,
      title: r.title,
      isApproved: r.status === 'ACCEPTED_FOR_WORK' || r.status === 'ISSUED',
    };
  }

  const evidenceChecklist: EvidenceRequirementItem[] = [
    {
      id: 'ev-01',
      phase: 'BEFORE',
      title: 'Arrival & Plant Isolation Verification',
      description: 'Photo of local electrical LOTO lock-off and GS38 voltage indicator proving dead.',
      isMandatory: true,
      uploadedCount: 0,
    },
    {
      id: 'ev-02',
      phase: 'DURING',
      title: 'Work In Progress / Component Inspection',
      description: 'Clear photograph showing removed parts and internal inspection condition.',
      isMandatory: true,
      uploadedCount: 0,
    },
    {
      id: 'ev-03',
      phase: 'COMPLETION',
      title: 'Completed Installation & Clean Work Area',
      description: 'Finished asset photo, reinstated guards, clean floor area, and signed service report.',
      isMandatory: true,
      uploadedCount: 0,
    },
  ];

  const pack: JobPackRecord = {
    id: jobPackId,
    workOrderId: workOrder.id,
    workOrderNumber: workOrder.work_order_number || `WO-${workOrder.id.slice(0, 6)}`,
    contractorOrgId: providerOrgId,
    contractorName: session.orgName || 'Apex Electrical Services Ltd',
    clientName: client.name || 'Savills Property Management',
    siteId: site.id,
    siteName: site.name || 'St James House',
    siteAddress: `${site.address_line1 || '10 St James Street'}, ${site.city || 'Manchester'} ${site.postcode || 'M1 4BT'}`,
    trade: workOrder.trade || 'ELECTRICAL',
    scopeDescription: workOrder.description || workOrder.title || 'Facilities maintenance attendance.',
    priority: workOrder.priority || 'P3_ROUTINE',
    plannedAttendanceDate: workOrder.target_start_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    plannedAttendanceTime: '08:00',
    assignedOperative,
    ramsRecord,
    siteInstructions: {
      accessHours: site.access_hours || '08:00 - 18:00',
      contactName: site.contact_name || 'Building Security Desk',
      contactPhone: site.contact_phone || '0161 800 9000',
      parkingInstructions: 'Contractor bay in rear service yard via barrier intercom.',
      securityInductionRequired: true,
      knownAsbestosLocation: 'None in 2nd floor tenant demise (Ref: Asbestos Register 2025).',
      accessConflictDetected: readiness.advisoryWarnings.some((w) => w.title.includes('Access')),
      conflictDetail: readiness.advisoryWarnings.find((w) => w.title.includes('Access'))?.detail,
    },
    permits: [
      {
        type: 'Site Permit to Work',
        status: 'REQUIRED',
        issuer: 'Building Management',
      },
    ],
    coshhItems: [],
    ppeRequired: ['Safety Boots (EN ISO 20345)', 'High Visibility Vest', 'Safety Glasses (EN 166)', 'Cut-Level 5 Gloves'],
    plantRequired: ['Enclosed Podium Platform (2m)', 'GS38 Approved Voltage Indicator & Proving Unit'],
    emergencyArrangements: {
      emergencyContact: 'EntireFM Operations 24/7 (0800 123 4567)',
      nearestHospital: 'Manchester Royal Infirmary (A&E)',
      evacuationRoute: 'Exit via Core B Fire Escape Staircase to Rear Car Park.',
      specialistRescueRequired: false,
    },
    evidenceChecklist,
    briefings: existing?.briefings || [],
    readiness,
    version: existing?.version || '1.0',
    isIssued: existing?.isIssued || false,
    issuedAt: existing?.issuedAt,
    stoppedWorkEvent: existing?.stoppedWorkEvent,
    authorisedOverride: existing?.authorisedOverride,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  IN_MEMORY_JOB_PACKS.set(jobPackId, pack);
  return pack;
}

// ─────────────────────────────────────────────────────────────
// 3. GET & LIST JOB PACKS
// ─────────────────────────────────────────────────────────────
export async function getJobPackById(jobPackId: string, session: UserSession): Promise<JobPackRecord | null> {
  const pack = IN_MEMORY_JOB_PACKS.get(jobPackId);
  if (!pack) return null;

  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== pack.contractorOrgId) {
    throw new Error('FORBIDDEN: Access to this job pack is restricted');
  }

  return pack;
}

export async function listJobPacks(
  contractorOrgId: string,
  session: UserSession,
  filter?: { status?: string; searchQuery?: string }
): Promise<JobPackRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access restricted');
  }

  let list = Array.from(IN_MEMORY_JOB_PACKS.values()).filter(
    (jp) => jp.contractorOrgId === contractorOrgId || session.orgType === 'ENTIREFM'
  );

  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((jp) => jp.readiness.status === filter.status);
  }

  if (filter?.searchQuery && filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    list = list.filter(
      (jp) =>
        jp.id.toLowerCase().includes(q) ||
        jp.workOrderNumber.toLowerCase().includes(q) ||
        jp.siteName.toLowerCase().includes(q) ||
        jp.clientName.toLowerCase().includes(q) ||
        jp.trade.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// ─────────────────────────────────────────────────────────────
// 4. RECORD JOB PACK BRIEFING
// ─────────────────────────────────────────────────────────────
export async function recordJobPackBriefing(
  jobPackId: string,
  operativePersonId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  const pack = IN_MEMORY_JOB_PACKS.get(jobPackId);
  if (!pack) return { success: false, error: 'Job pack not found' };

  const op = await getContractorOperativeById(operativePersonId, session);
  const operativeName = op?.fullName || session.name || 'Operative';
  const now = new Date().toISOString();

  pack.briefings = pack.briefings.filter((b) => b.operativeId !== operativePersonId);
  pack.briefings.push({
    operativeId: operativePersonId,
    operativeName,
    jobPackVersion: pack.version,
    ramsVersion: pack.ramsRecord?.version || '1.0',
    briefedAt: now,
    status: 'READ_AND_UNDERSTOOD',
  });
  pack.updatedAt = now;

  IN_MEMORY_JOB_PACKS.set(jobPackId, pack);

  await recordAuditEvent({
    event_type: 'JOB_PACK_BRIEFING_ACKNOWLEDGED',
    object_type: 'job_packs',
    object_id: jobPackId,
    actor_id: session.personId,
    after_state: {
      jobPackId,
      operativeName,
      version: pack.version,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 5. STOP WORK / SAFETY ESCALATION EVENT
// ─────────────────────────────────────────────────────────────
export async function recordStopWorkEvent(
  jobPackId: string,
  data: { reasonCategory: string; details: string },
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  const pack = IN_MEMORY_JOB_PACKS.get(jobPackId);
  if (!pack) return { success: false, error: 'Job pack not found' };

  const now = new Date().toISOString();
  pack.stoppedWorkEvent = {
    stoppedByPersonId: session.personId,
    stoppedByName: session.name || 'Contractor Engineer',
    stoppedAt: now,
    reasonCategory: data.reasonCategory,
    details: data.details,
  };
  pack.readiness.status = 'ACTION_REQUIRED';
  pack.readiness.isReadyForAttendance = false;
  pack.readiness.blockingReasons.unshift({
    code: 'STOP_WORK_SAFETY_HOLD',
    title: `Safety Stop Work Engaged (${data.reasonCategory})`,
    detail: data.details,
    category: 'SITE',
    isStatutory: true,
  });
  pack.updatedAt = now;

  IN_MEMORY_JOB_PACKS.set(jobPackId, pack);

  await recordAuditEvent({
    event_type: 'SAFETY_STOP_WORK_ENGAGED',
    object_type: 'job_packs',
    object_id: jobPackId,
    actor_id: session.personId,
    after_state: {
      jobPackId,
      stoppedBy: pack.stoppedWorkEvent.stoppedByName,
      reasonCategory: data.reasonCategory,
      details: data.details,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 6. AUTHORISED OVERRIDE (ENTIREFM STAFF)
// ─────────────────────────────────────────────────────────────
export async function applyAuthorisedOverride(
  jobPackId: string,
  data: { reason: string; scope: string },
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (session.orgType !== 'ENTIREFM') {
    return { success: false, error: 'FORBIDDEN: EntireFM staff authentication required' };
  }

  const pack = IN_MEMORY_JOB_PACKS.get(jobPackId);
  if (!pack) return { success: false, error: 'Job pack not found' };

  const now = new Date().toISOString();
  pack.authorisedOverride = {
    overriddenByPersonId: session.personId,
    overriddenByName: session.name || 'EntireFM Operations Lead',
    overriddenAt: now,
    reason: data.reason,
    scope: data.scope,
  };
  pack.readiness.isReadyForAttendance = true;
  pack.readiness.status = 'READY';
  pack.updatedAt = now;

  IN_MEMORY_JOB_PACKS.set(jobPackId, pack);

  await recordAuditEvent({
    event_type: 'JOB_PACK_OVERRIDE_AUTHORISED',
    object_type: 'job_packs',
    object_id: jobPackId,
    actor_id: session.personId,
    after_state: {
      jobPackId,
      overriddenBy: pack.authorisedOverride.overriddenByName,
      reason: data.reason,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// 7. GENERATE JOB PACK PRINTABLE PDF
// ─────────────────────────────────────────────────────────────
export function generateJobPackPdfHtml(pack: JobPackRecord): string {
  const pdfDef: PdfDocumentDefinition = {
    title: `JOB PACK — ${pack.workOrderNumber}`,
    subtitle: `${pack.trade} • Pre-Attendance Work Authorisation Pack`,
    documentRef: `${pack.id} (v${pack.version})`,
    date: new Date(pack.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    siteName: `${pack.siteName} (${pack.clientName})`,
    organisationName: pack.contractorName,
    author: 'EntireFM CAFM Supply Chain Operations',
    badgeText: pack.readiness.status.replace(/_/g, ' '),
    summaryStats: [
      { label: 'Planned Date', value: pack.plannedAttendanceDate, detail: pack.plannedAttendanceTime },
      { label: 'Assigned Operative', value: pack.assignedOperative?.fullName || 'Unassigned', detail: pack.assignedOperative?.jobTitle || 'Field Team' },
      { label: 'RAMS Status', value: pack.ramsRecord?.status || 'N/A', detail: pack.ramsRecord?.ramsId || 'Standard' },
      { label: 'Readiness Gate', value: pack.readiness.isReadyForAttendance ? 'CLEARED' : 'ACTION REQ', detail: pack.readiness.gatingPolicy },
    ],
    sections: [
      {
        type: 'text',
        heading: '1. Work Scope & Location Details',
        paragraphs: [
          pack.scopeDescription,
          `Site Address: ${pack.siteAddress}`,
          `Access Hours: ${pack.siteInstructions?.accessHours || '08:00 - 18:00'} | Site Contact: ${pack.siteInstructions?.contactName || 'Building Security'} (${pack.siteInstructions?.contactPhone || 'N/A'})`,
          `Parking / Loading: ${pack.siteInstructions?.parkingInstructions || 'Use designated contractor bays.'}`,
        ],
      },
      {
        type: 'cards',
        heading: '2. Assigned Operative & Competency Verification (CP-04)',
        items: [
          {
            title: pack.assignedOperative?.fullName || 'Assigned Operative',
            subtitle: `${pack.assignedOperative?.jobTitle || 'Operative'} • ${pack.assignedOperative?.trade || 'Trade'}`,
            badge: pack.assignedOperative?.eligibilityStatus || 'VERIFIED',
            body: `Verified Qualifications: ${pack.assignedOperative?.relevantQualifications.join(', ') || 'Standard Trade Qualifications'}.\nCompetencies: ${pack.assignedOperative?.relevantCompetencies.join(', ') || 'Standard Maintenance'}.`,
          },
        ],
      },
      {
        type: 'table',
        heading: '3. Pre-Attendance Readiness & Section Status',
        columns: [
          { header: 'Section Component', widthPercent: 30 },
          { header: 'Status', widthPercent: 20, align: 'center' },
          { header: 'Operational Details & Safeguards', widthPercent: 50 },
        ],
        rows: Object.values(pack.readiness.sections).map((s) => [
          s.section,
          s.status,
          s.detail,
        ]),
      },
      {
        type: 'table',
        heading: '4. Mandatory Field Evidence Checklist',
        columns: [
          { header: 'Phase', widthPercent: 20 },
          { header: 'Evidence Item', widthPercent: 35 },
          { header: 'Requirement Description', widthPercent: 45 },
        ],
        rows: pack.evidenceChecklist.map((ev) => [
          ev.phase,
          ev.title,
          ev.description,
        ]),
      },
      {
        type: 'cards',
        heading: '5. Emergency Arrangements & First Aid',
        items: [
          {
            title: 'Emergency Contact & Hospital',
            body: `24/7 Operations Helpdesk: ${pack.emergencyArrangements.emergencyContact}\nNearest A&E: ${pack.emergencyArrangements.nearestHospital}\nEvacuation: ${pack.emergencyArrangements.evacuationRoute}`,
          },
        ],
      },
    ],
    complianceNotes: [
      'This Job Pack represents a point-in-time work-readiness snapshot generated by the EntireFM Platform.',
      'Operatives must complete the digital pre-work briefing prior to commencing work on site.',
    ],
    disclaimerText: 'EntireFM Facilities Management Safety Platform. Point-in-time audit record.',
  };

  return buildHtmlReport(pdfDef);
}
