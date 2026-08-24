/**
 * ENTIREFM COMPLIANCE KPI REGISTRY (Phase 0J)
 * ============================================
 * Canonical definitions and authoritative calculation specifications for all
 * platform compliance intelligence metrics.
 */

export interface ComplianceKPIDefinition {
  code: string;
  name: string;
  category: 'OBLIGATIONS' | 'EVIDENCE' | 'EXCEPTIONS' | 'CERTIFICATES' | 'GOVERNANCE';
  calculationFormula: string;
  numeratorDesc?: string;
  denominatorDesc?: string;
  authority: string;
  description: string;
}

export const CANONICAL_COMPLIANCE_KPIS: Record<string, ComplianceKPIDefinition> = {
  APPLICABLE_OBLIGATIONS: {
    code: 'APPLICABLE_OBLIGATIONS',
    name: 'Applicable Obligations Count',
    category: 'OBLIGATIONS',
    calculationFormula: 'COUNT(compliance_obligations WHERE is_applicable = YES)',
    numeratorDesc: 'All active applicable statutory and contractual duties established for the estate scope',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Total number of active statutory, standard, or contractual obligations established by applicability assessment.',
  },
  COMPLIANT_OBLIGATIONS: {
    code: 'COMPLIANT_OBLIGATIONS',
    name: 'Compliant Obligations Count',
    category: 'OBLIGATIONS',
    calculationFormula: 'COUNT(compliance_obligations WHERE status = COMPLIANT)',
    numeratorDesc: 'Obligations with valid, unexpired evidence and no open critical exception',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Number of active obligations currently meeting full statutory or contractual compliance requirements.',
  },
  OVERDUE_OBLIGATIONS: {
    code: 'OVERDUE_OBLIGATIONS',
    name: 'Overdue Obligations Count',
    category: 'OBLIGATIONS',
    calculationFormula: 'COUNT(compliance_obligations WHERE status = OVERDUE)',
    numeratorDesc: 'Obligations past target due date with no valid current evidence',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Obligations that have passed their statutory or contractual completion window without satisfactory evidence.',
  },
  EVIDENCE_PENDING: {
    code: 'EVIDENCE_PENDING',
    name: 'Evidence Pending Count',
    category: 'EVIDENCE',
    calculationFormula: 'COUNT(compliance_obligations WHERE status = EVIDENCE_PENDING)',
    numeratorDesc: 'Obligations where physical/inspection work is performed but certificate or report is pending attachment',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Obligations awaiting physical document upload, contractor signoff, or initial extraction.',
  },
  VALIDATION_PENDING: {
    code: 'VALIDATION_PENDING',
    name: 'Validation Pending Count',
    category: 'EVIDENCE',
    calculationFormula: 'COUNT(compliance_evidence_validations WHERE validation_result = REVIEW_REQUIRED)',
    numeratorDesc: 'Evidence documents flagged for human or supervisor validation review',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Certificates or evidence items with low extraction confidence or potential site/asset mismatches requiring review.',
  },
  OPEN_COMPLIANCE_EXCEPTIONS: {
    code: 'OPEN_COMPLIANCE_EXCEPTIONS',
    name: 'Open Compliance Exceptions Count',
    category: 'EXCEPTIONS',
    calculationFormula: 'COUNT(compliance_exceptions WHERE state IN (OPEN, ACKNOWLEDGED, REMEDIATION_PLANNED, IN_PROGRESS, AWAITING_EVIDENCE))',
    numeratorDesc: 'All non-resolved, non-mitigated compliance exception records',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Active compliance exceptions including failed inspections, inaccessible assets, missing evidence, or competency issues.',
  },
  CRITICAL_COMPLIANCE_EXCEPTIONS: {
    code: 'CRITICAL_COMPLIANCE_EXCEPTIONS',
    name: 'Critical Compliance Exceptions Count',
    category: 'EXCEPTIONS',
    calculationFormula: 'COUNT(compliance_exceptions WHERE severity = CRITICAL AND state != CLOSED)',
    numeratorDesc: 'Critical severity open compliance exception records',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'High-risk statutory non-compliance issues or safety hazards requiring immediate leadership escalation.',
  },
  CERTIFICATES_EXPIRING_30D: {
    code: 'CERTIFICATES_EXPIRING_30D',
    name: 'Certificates Expiring (30 Days)',
    category: 'CERTIFICATES',
    calculationFormula: 'COUNT(certificates WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30)',
    numeratorDesc: 'Certificates with expiry date within the next 30 days',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Certificates approaching expiry threshold requiring renewal inspection scheduling.',
  },
  CERTIFICATES_EXPIRED: {
    code: 'CERTIFICATES_EXPIRED',
    name: 'Certificates Expired Count',
    category: 'CERTIFICATES',
    calculationFormula: 'COUNT(certificates WHERE expiry_date < CURRENT_DATE AND status != SUPERSEDED)',
    numeratorDesc: 'Certificates past expiration date without active replacement',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Expired certificates in current use.',
  },
  RULES_UNDER_REVIEW: {
    code: 'RULES_UNDER_REVIEW',
    name: 'Rules Under Review Count',
    category: 'GOVERNANCE',
    calculationFormula: 'COUNT(compliance_rules WHERE status = UNDER_REVIEW)',
    numeratorDesc: 'Compliance rules undergoing legal/technical review or pending version approval',
    denominatorDesc: 'N/A (Integer Count)',
    authority: 'EntireFM Compliance Intelligence Framework v1.0',
    description: 'Rules undergoing review where potential estate impact has been flagged.',
  },
};
