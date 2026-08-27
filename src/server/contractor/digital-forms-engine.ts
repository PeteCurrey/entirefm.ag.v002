/**
 * ENTIREFM DIGITAL FORMS & FIELD EXECUTION ENGINE (CP-07)
 * ========================================================
 * Reusable data-driven form engine supporting:
 * - Service Reports
 * - Variations & Cost Commitments
 * - Defect Logging & Follow-On Workflows
 * - Near Miss & Incident / Accident Reporting (RIDDOR trigger)
 * - Hazard Observations
 * - Equipment & Plant Pre-Use Inspections (Ladder, Harness, Vehicle)
 * - Dynamic Site Risk Assessments
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';

export type FormCategory =
  | 'SERVICE_REPORT'
  | 'VARIATION_REQUEST'
  | 'DEFECT_REPORT'
  | 'NO_ACCESS'
  | 'NEAR_MISS'
  | 'INCIDENT_ACCIDENT'
  | 'HAZARD_OBSERVATION'
  | 'PLANT_INSPECTION'
  | 'TOOLBOX_TALK'
  | 'SITE_SIGN_OFF';

export type FormStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'RETURNED_FOR_CORRECTION'
  | 'ACCEPTED'
  | 'SUPERSEDED';

export interface FormFieldDefinition {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'photo' | 'signature' | 'reading';
  required: boolean;
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  helpText?: string;
}

export interface FormTemplateDefinition {
  id: string;
  code: string;
  title: string;
  category: FormCategory;
  version: string;
  description: string;
  fields: FormFieldDefinition[];
  requiresEvidence: boolean;
  requiresSignature: boolean;
  applicableTrades?: string[];
}

export interface SubmittedFormRecord {
  id: string;
  templateId: string;
  templateCode: string;
  templateTitle: string;
  category: FormCategory;
  version: string;
  workOrderId?: string;
  workOrderNumber?: string;
  visitId?: string;
  contractorOrgId: string;
  operativePersonId: string;
  operativeName: string;
  status: FormStatus;
  formData: Record<string, any>;
  evidenceUrls: string[];
  signatureData?: {
    signerName: string;
    signerRole: string;
    signaturePath?: string;
    signedAt: string;
  };
  riddorReviewRequired?: boolean;
  correctionNotes?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// 1. CANONICAL FORM TEMPLATES CATALOGUE
// ─────────────────────────────────────────────────────────────
export const CANONICAL_FORM_TEMPLATES: FormTemplateDefinition[] = [
  // 1. Service Report
  {
    id: 'FORM_SERVICE_REPORT',
    code: 'SR-01',
    title: 'Commercial Service & Maintenance Report',
    category: 'SERVICE_REPORT',
    version: '1.0',
    description: 'Statutory field service narrative, fault diagnostics, parts consumed, readings, and client sign-off.',
    requiresEvidence: true,
    requiresSignature: true,
    fields: [
      { id: 'work_description', name: 'work_description', label: 'Detailed Work Narrative', type: 'textarea', required: true },
      { id: 'findings_condition', name: 'findings_condition', label: 'Asset Findings & Observed Condition', type: 'textarea', required: true },
      { id: 'fault_cause', name: 'fault_cause', label: 'Primary Cause of Fault (if Reactive)', type: 'text', required: false },
      { id: 'parts_used_summary', name: 'parts_used_summary', label: 'Materials / Consumables Used', type: 'textarea', required: false },
      { id: 'further_works_required', name: 'further_works_required', label: 'Further Works / Remedials Recommended', type: 'textarea', required: false },
      { id: 'site_left_safe', name: 'site_left_safe', label: 'Site Cleaned and Reinstated Safely', type: 'checkbox', required: true },
    ],
  },

  // 2. Variation Request
  {
    id: 'FORM_VARIATION_REQUEST',
    code: 'VAR-01',
    title: 'Scope Variation & Cost Authorisation Request',
    category: 'VARIATION_REQUEST',
    version: '1.0',
    description: 'Request approval for additional unforeseen scope, materials, or labour prior to proceeding.',
    requiresEvidence: true,
    requiresSignature: false,
    fields: [
      { id: 'reason_category', name: 'reason_category', label: 'Variation Reason', type: 'select', required: true, options: ['Additional Fault Discovered', 'Inaccessible Defect', 'Client Site Request', 'Unforeseen Structural Condition', 'Specification Mismatch'] },
      { id: 'scope_description', name: 'scope_description', label: 'Description of Additional Scope', type: 'textarea', required: true },
      { id: 'estimated_labour_hours', name: 'estimated_labour_hours', label: 'Additional Labour Hours Required', type: 'number', required: true },
      { id: 'materials_cost_gbp', name: 'materials_cost_gbp', label: 'Estimated Materials Cost (£)', type: 'number', required: false },
      { id: 'can_continue_core_work', name: 'can_continue_core_work', label: 'Core Work Can Continue while Variation Pending', type: 'checkbox', required: true },
    ],
  },

  // 3. Defect Report
  {
    id: 'FORM_DEFECT_REPORT',
    code: 'DEF-01',
    title: 'Asset Defect & Remedial Work Notification',
    category: 'DEFECT_REPORT',
    version: '1.0',
    description: 'Report an asset or facility defect observed on site for follow-on quotation or remediation.',
    requiresEvidence: true,
    requiresSignature: false,
    fields: [
      { id: 'asset_tag', name: 'asset_tag', label: 'Asset Reference / Location', type: 'text', required: true },
      { id: 'defect_severity', name: 'defect_severity', label: 'Defect Severity', type: 'select', required: true, options: ['CRITICAL - Immediate Hazard', 'SIGNIFICANT - Performance Impact', 'MINOR - Non-urgent Remedial', 'ADVISORY - Observation'] },
      { id: 'defect_description', name: 'defect_description', label: 'Defect Details & Symptoms', type: 'textarea', required: true },
      { id: 'temporary_make_safe_action', name: 'temporary_make_safe_action', label: 'Immediate Make-Safe Action Taken', type: 'textarea', required: false },
      { id: 'recommended_remedy', name: 'recommended_remedy', label: 'Recommended Permanent Remedial', type: 'textarea', required: true },
    ],
  },

  // 4. Near Miss & Incident / Accident (with RIDDOR check)
  {
    id: 'FORM_INCIDENT_ACCIDENT',
    code: 'INC-01',
    title: 'Safety Incident, Accident & Near Miss Report',
    category: 'INCIDENT_ACCIDENT',
    version: '1.0',
    description: 'Report health, safety, environmental, or damage incidents with immediate supervisor escalation.',
    requiresEvidence: true,
    requiresSignature: true,
    fields: [
      { id: 'incident_type', name: 'incident_type', label: 'Incident Classification', type: 'select', required: true, options: ['NEAR_MISS', 'MINOR_INJURY_FIRST_AID', 'LOST_TIME_INJURY', 'PROPERTY_DAMAGE', 'ENVIRONMENTAL_SPILL', 'DANGEROUS_OCCURRENCE'] },
      { id: 'exact_location', name: 'exact_location', label: 'Exact Site Location / Area', type: 'text', required: true },
      { id: 'event_narrative', name: 'event_narrative', label: 'Detailed Description of Occurrence', type: 'textarea', required: true },
      { id: 'immediate_action_taken', name: 'immediate_action_taken', label: 'Immediate Actions Taken', type: 'textarea', required: true },
      { id: 'injury_sustained', name: 'injury_sustained', label: 'Was an Injury Sustained?', type: 'checkbox', required: true },
      { id: 'witness_details', name: 'witness_details', label: 'Witness Names & Contacts', type: 'text', required: false },
    ],
  },

  // 5. Pre-Use Ladder & Podium Inspection
  {
    id: 'FORM_LADDER_INSPECTION',
    code: 'INSP-LAD-01',
    title: 'Pre-Use Access Equipment & Ladder Inspection',
    category: 'PLANT_INSPECTION',
    version: '1.0',
    description: 'Statutory visual pre-use check for step ladders, podiums, and mobile access equipment.',
    requiresEvidence: false,
    requiresSignature: false,
    fields: [
      { id: 'equipment_id', name: 'equipment_id', label: 'Equipment Asset / Serial Tag', type: 'text', required: true },
      { id: 'stiles_clean_undamaged', name: 'stiles_clean_undamaged', label: 'Stiles and Frame Free from Cracks/Bends', type: 'checkbox', required: true },
      { id: 'rungs_steps_secure', name: 'rungs_steps_secure', label: 'All Rungs / Steps Tight and Slip-Resistant', type: 'checkbox', required: true },
      { id: 'locking_mechanisms_functional', name: 'locking_mechanisms_functional', label: 'Locking Hinges / Brackets Operating Smoothly', type: 'checkbox', required: true },
      { id: 'anti_slip_feet_intact', name: 'anti_slip_feet_intact', label: 'All Anti-Slip Rubber Feet Intact and Clean', type: 'checkbox', required: true },
      { id: 'inspection_result', name: 'inspection_result', label: 'Overall Inspection Outcome', type: 'select', required: true, options: ['PASS - Safe for Use', 'FAIL - Tag Out of Service'] },
    ],
  },

  // 6. Safety Harness & Lanyard Pre-Use Check
  {
    id: 'FORM_HARNESS_INSPECTION',
    code: 'INSP-HARN-01',
    title: 'Pre-Use Safety Harness & Lanyard Inspection',
    category: 'PLANT_INSPECTION',
    version: '1.0',
    description: 'Detailed inspection of fall-arrest harnesses, shock-absorbing lanyards, and karabiners.',
    requiresEvidence: false,
    requiresSignature: false,
    fields: [
      { id: 'harness_serial_number', name: 'harness_serial_number', label: 'Harness Serial Number', type: 'text', required: true },
      { id: 'webbing_free_from_cuts_burns', name: 'webbing_free_from_cuts_burns', label: 'Webbing Free from Cuts, Fraying, Acid/Chemical Burns', type: 'checkbox', required: true },
      { id: 'stitching_intact', name: 'stitching_intact', label: 'All Load-Bearing Stitching Intact and Undamaged', type: 'checkbox', required: true },
      { id: 'd_rings_buckles_undistorted', name: 'd_rings_buckles_undistorted', label: 'D-Rings and Metal Buckles Free from Cracks/Deformation', type: 'checkbox', required: true },
      { id: 'inspection_result', name: 'inspection_result', label: 'Inspection Result', type: 'select', required: true, options: ['PASS - Certified Safe', 'FAIL - Quarantine for Destruction'] },
    ],
  },

  // 7. Toolbox Talk Attendance
  {
    id: 'FORM_TOOLBOX_TALK',
    code: 'TBT-01',
    title: 'Site Safety Briefing / Toolbox Talk Register',
    category: 'TOOLBOX_TALK',
    version: '1.0',
    description: 'Record on-site point of work safety briefings and operative attendance.',
    requiresEvidence: false,
    requiresSignature: true,
    fields: [
      { id: 'tbt_topic', name: 'tbt_topic', label: 'Toolbox Talk Safety Topic', type: 'text', required: true },
      { id: 'key_points_discussed', name: 'key_points_discussed', label: 'Key Safety Points & Controls Discussed', type: 'textarea', required: true },
      { id: 'attendees_summary', name: 'attendees_summary', label: 'List of Operative Attendees', type: 'textarea', required: true },
    ],
  },
];

// In-Memory Storage for Submitted Forms
const IN_MEMORY_FORMS: Map<string, SubmittedFormRecord> = new Map();

// ─────────────────────────────────────────────────────────────
// 2. SUBMIT DIGITAL FORM
// ─────────────────────────────────────────────────────────────
export async function submitDigitalForm(
  params: {
    templateId: string;
    workOrderId?: string;
    workOrderNumber?: string;
    visitId?: string;
    contractorOrgId: string;
    formData: Record<string, any>;
    evidenceUrls?: string[];
    signatureData?: {
      signerName: string;
      signerRole: string;
      signaturePath?: string;
    };
  },
  session: UserSession
): Promise<{ success: boolean; id: string; error?: string }> {
  const template = CANONICAL_FORM_TEMPLATES.find((t) => t.id === params.templateId || t.code === params.templateId);
  if (!template) return { success: false, id: '', error: 'Invalid form template' };

  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const serial = String(IN_MEMORY_FORMS.size + 1001).padStart(6, '0');
  const formId = `FRM-${year}-${serial}`;

  // Check for RIDDOR trigger if incident form
  const isRiddorTrigger =
    template.category === 'INCIDENT_ACCIDENT' &&
    (params.formData.incident_type === 'LOST_TIME_INJURY' || params.formData.incident_type === 'DANGEROUS_OCCURRENCE');

  const newForm: SubmittedFormRecord = {
    id: formId,
    templateId: template.id,
    templateCode: template.code,
    templateTitle: template.title,
    category: template.category,
    version: template.version,
    workOrderId: params.workOrderId,
    workOrderNumber: params.workOrderNumber,
    visitId: params.visitId,
    contractorOrgId: params.contractorOrgId,
    operativePersonId: session.personId,
    operativeName: session.name || 'Field Operative',
    status: 'SUBMITTED',
    formData: params.formData,
    evidenceUrls: params.evidenceUrls || [],
    signatureData: params.signatureData
      ? {
          ...params.signatureData,
          signedAt: now,
        }
      : undefined,
    riddorReviewRequired: isRiddorTrigger,
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  IN_MEMORY_FORMS.set(formId, newForm);

  await recordAuditEvent({
    event_type: 'DIGITAL_FORM_SUBMITTED',
    object_type: 'submitted_forms',
    object_id: formId,
    actor_id: session.personId,
    after_state: {
      formId,
      templateCode: template.code,
      workOrderId: params.workOrderId,
      riddorFlag: isRiddorTrigger,
    },
  });

  return { success: true, id: formId };
}

// ─────────────────────────────────────────────────────────────
// 3. GET & LIST FORMS
// ─────────────────────────────────────────────────────────────
export async function getSubmittedFormById(
  formId: string,
  session: UserSession
): Promise<SubmittedFormRecord | null> {
  const form = IN_MEMORY_FORMS.get(formId);
  if (!form) return null;

  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== form.contractorOrgId) {
    throw new Error('FORBIDDEN: Access to this form is restricted');
  }

  return form;
}

export async function listSubmittedForms(
  contractorOrgId: string,
  session: UserSession,
  filter?: { category?: string; workOrderId?: string; searchQuery?: string }
): Promise<SubmittedFormRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access restricted');
  }

  let list = Array.from(IN_MEMORY_FORMS.values()).filter(
    (f) => f.contractorOrgId === contractorOrgId || session.orgType === 'ENTIREFM'
  );

  if (filter?.category && filter.category !== 'ALL') {
    list = list.filter((f) => f.category === filter.category);
  }

  if (filter?.workOrderId) {
    list = list.filter((f) => f.workOrderId === filter.workOrderId);
  }

  if (filter?.searchQuery && filter.searchQuery.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    list = list.filter(
      (f) =>
        f.id.toLowerCase().includes(q) ||
        f.templateTitle.toLowerCase().includes(q) ||
        (f.workOrderNumber && f.workOrderNumber.toLowerCase().includes(q)) ||
        f.operativeName.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─────────────────────────────────────────────────────────────
// 4. AI SERVICE REPORT NARRATIVE ASSISTANT
// ─────────────────────────────────────────────────────────────
export function draftServiceReportNarrative(rawNotes: string): {
  draftWorkDescription: string;
  draftFindings: string;
  draftRecommendations: string;
} {
  const lines = rawNotes.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const cleanNotes = lines.join('; ');

  return {
    draftWorkDescription: `Attended site per scheduled maintenance remit. Executed comprehensive inspection and servicing: ${cleanNotes}. Verified all safety isolations and operational parameters upon completion.`,
    draftFindings: `All examined components tested in accordance with standard operating criteria. No catastrophic anomalies detected during active run cycles.`,
    draftRecommendations: `Recommend continued periodic maintenance per statutory schedule. Routine consumable replacements noted for next service interval.`,
  };
}
