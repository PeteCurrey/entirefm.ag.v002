/**
 * CONTENT RECORD: /hvac-contractor
 * ==================================
 * Route Provenance: LEGACY_VERIFIED (G1 + G2)
 * Priority: P0
 *
 * IMPORTANT: This is NOT the same page as /mechanical-electrical.
 * /hvac-contractor targets a distinct search intent — businesses
 * specifically searching for a HVAC contractor (heating, ventilation,
 * air conditioning specialist) rather than a general M&E contractor.
 *
 * These two pages must NOT be merged or redirected to each other.
 */

import type { ContentRecord } from '@/content/index';

const record: ContentRecord = {
  path: '/hvac-contractor',
  title: 'HVAC Contractor | Heating, Ventilation & Air Conditioning | Entire FM',
  metaDescription:
    'Entire FM is a specialist HVAC contractor providing heating, ventilation and air conditioning installation, servicing, and compliance across the UK.',
  h1: 'HVAC Contractor — Heating, Ventilation & Air Conditioning',
  historicIntent:
    'Facilities managers and building owners specifically searching for an HVAC specialist contractor rather than a general M&E company.',
  primaryIntent: 'HVAC contractor UK',
  secondaryIntents: [
    'heating ventilation air conditioning contractor',
    'HVAC maintenance contract',
    'commercial air conditioning servicing',
    'ventilation installation contractor',
    'HVAC compliance UK',
  ],
  pageType: 'service',
  service: 'HVAC',
  sector: null,
  location: null,
  historicTopics: [
    'HVAC system installation',
    'Air conditioning servicing and maintenance',
    'Heating system maintenance',
    'Ventilation design and installation',
    'F-Gas compliance [PENDING VERIFICATION]',
    'TM44 air conditioning inspection [PENDING VERIFICATION]',
    'REFCOM registration [PENDING VERIFICATION]',
  ],
  requiredSections: [
    'HVAC services overview',
    'Heating services',
    'Ventilation services',
    'Air conditioning services',
    'Compliance and certification [PENDING VERIFICATION]',
    'Emergency HVAC response',
    'Contact/enquiry CTA',
  ],
  relatedRoutes: [
    '/mechanical-electrical',
    '/ppm',
    '/hard-services',
    '/fire-emergency-systems',
    '/plumbing-gas',
  ],
  conversionGoal:
    'Drive HVAC-specific contract enquiries from facilities managers and building owners across the UK.',
  verificationRequirements: [
    'F-Gas certification must be confirmed before stating',
    'REFCOM registration must be confirmed before stating',
    'TM44 inspection capability must be confirmed',
    'Response time SLAs must be verified — see BUSINESS-CLAIMS-VERIFICATION.md',
  ],
  contentStatus: 'CONTENT_PENDING',
};

export default record;
