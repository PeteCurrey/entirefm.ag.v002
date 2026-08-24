/**
 * ENTIREFM STATUTORY ASBESTOS GOVERNANCE & JOB-SCOPE CONTROL
 * ==========================================================
 * Control of Asbestos Regulations 2012 (CAR 2012 / Regulation 4 Duty to Manage).
 *
 * CRITICAL SAFETY RULES:
 * 1. Post-2000 construction date is an input factor, NOT a universal safety clearance.
 * 2. Asbestos safety is strictly JOB-SCOPE SPECIFIC.
 * 3. AI / code may detect missing info or flag risk conflicts, but MUST NEVER provide safety clearance.
 * 4. Only competent, authorized human dutyholders or QHSE specialists may clear work controls.
 */

export type AsbestosScopeStatus =
  | 'DUTY_NOT_APPLICABLE' // Non-domestic duty not triggered or confirmed out of scope by dutyholder
  | 'ASBESTOS_INFORMATION_AVAILABLE' // Site register / management survey provided
  | 'NO_ACM_IDENTIFIED_FOR_SCOPE' // Survey covers specific job area and records no ACMs
  | 'PRESUMED_ACM' // Presumed ACM present in or adjacent to work area; precautions required
  | 'SURVEY_REQUIRED' // Refurbishment / demolition survey required before intrusive work
  | 'INFORMATION_REQUIRED' // Dutyholder information not yet furnished by client
  | 'SPECIALIST_REVIEW_REQUIRED' // Complex risk / suspected ACM requiring EntireFM QHSE clearance
  | 'WORK_BLOCKED'; // Intrusive work strictly prohibited until competent survey is completed

export interface AsbestosDocumentAudit {
  documentId: string;
  documentTitle: string;
  documentType: 'MANAGEMENT_SURVEY' | 'REFURBISHMENT_DEMOLITION_SURVEY' | 'ASBESTOS_REGISTER' | 'RE_INSPECTION_REPORT' | 'DUTYHOLDER_CONFIRMATION';
  revisionDate: string;
  surveyorOrganisation?: string;
  relevantAreasCovered: string[];
  inaccessibleAreasRecorded: string[];
  dateMadeAvailableToContractor: string;
  providedByEntity: string;
  contractorRecipientEntity: string;
  contractorSignatoryName?: string;
  acknowledgedAt?: string;
  acknowledgementVersion?: string;
  outstandingLimitations?: string;
  permitReference?: string;
}

export interface AsbestosJobAssessment {
  workOrderId: string;
  siteId: string;
  siteAddress: string;
  buildingConstructionYear?: number;
  lastMajorRefurbishmentYear?: number;
  dutyholderName?: string;
  dutyholderOrganisation?: string;
  jobWorkArea: string; // e.g. "Plant Room B - Ceiling Void & Riser 3"
  workType: 'SURFACE_VISUAL' | 'SERVICING_NO_FABRIC_DISTURBANCE' | 'INTRUSIVE_DRILLING' | 'DESTRUCTIVE_REFURBISHMENT';
  willDisturbBuildingFabric: boolean;
  scopeStatus: AsbestosScopeStatus;
  acmLocationsIdentified: string[];
  presumedAcms: string[];
  documents: AsbestosDocumentAudit[];
  aiRiskFlags?: string[]; // Recommendations/conflicts identified by AI
  humanQhseClearedBy?: string;
  humanQhseClearedAt?: string;
  clearanceNotes?: string;
}

/**
 * Assess Asbestos Risk Profile for a Work Order (Advisory Evaluation)
 * AI / System detects missing data and recommends escalation, but DOES NOT grant safety clearance.
 */
export function evaluateAsbestosWorkOrderRisk(assessment: AsbestosJobAssessment): {
  recommendedStatus: AsbestosScopeStatus;
  isBlockedForIntrusiveWork: boolean;
  riskFlags: string[];
} {
  const riskFlags: string[] = [];

  // Rule 1: Intrusive work without R&D survey in pre-2000 building or uninspected voids
  if (assessment.willDisturbBuildingFabric) {
    const hasRdSurvey = assessment.documents.some(
      (d) => d.documentType === 'REFURBISHMENT_DEMOLITION_SURVEY'
    );
    if (!hasRdSurvey && (!assessment.buildingConstructionYear || assessment.buildingConstructionYear < 2000)) {
      riskFlags.push('Intrusive work in pre-2000 fabric without dedicated Refurbishment/Demolition survey.');
    }
  }

  // Rule 2: No documentation available
  if (assessment.documents.length === 0) {
    riskFlags.push('Zero dutyholder asbestos documentation supplied by client.');
  }

  // Rule 3: Presumed ACM in scope area
  if (assessment.presumedAcms.length > 0) {
    riskFlags.push(`Presumed ACMs recorded in scope: ${assessment.presumedAcms.join(', ')}`);
  }

  // Block intrusive work if information is missing or specialist review needed
  const isBlockedForIntrusiveWork =
    assessment.willDisturbBuildingFabric &&
    (assessment.scopeStatus === 'INFORMATION_REQUIRED' ||
      assessment.scopeStatus === 'SURVEY_REQUIRED' ||
      assessment.scopeStatus === 'SPECIALIST_REVIEW_REQUIRED' ||
      assessment.scopeStatus === 'WORK_BLOCKED');

  return {
    recommendedStatus: assessment.scopeStatus,
    isBlockedForIntrusiveWork,
    riskFlags,
  };
}
