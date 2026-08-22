/**
 * CONTENT RECORD: /fm-london
 * ===========================
 * Route Provenance: LEGACY_VERIFIED (G1 + G2)
 * Priority: P0 — London is the highest-value geographic market
 *
 * IMPORTANT: Three London FM pages must exist independently:
 *   /fm-london — this page (emergency/rapid response focus)
 *   /facilities-management-london — general London FM
 *   /london-facilities-management — corporate/brand focus
 *
 * Each has distinct search intent. None may redirect to another.
 */

import type { ContentRecord } from '@/content/index';

const record: ContentRecord = {
  path: '/fm-london',
  title: 'FM London | 24/7 Facilities Management London | Entire FM',
  metaDescription:
    'Entire FM provides 24/7 facilities management across London — hard FM, soft FM, M&E, cleaning, PPM, and emergency response for commercial properties across all London zones.',
  h1: 'FM London — 24/7 Facilities Management Services',
  historicIntent:
    'London businesses searching for a rapid-response FM provider covering the full London area, with emphasis on availability and response time.',
  primaryIntent: 'FM London facilities management company',
  secondaryIntents: [
    '24/7 FM London',
    'London facilities management company',
    'facilities management Central London',
    'London FM contractor',
    'emergency FM response London',
  ],
  pageType: 'location',
  service: null,
  sector: null,
  location: 'London',
  historicTopics: [
    'London-wide FM coverage',
    'Zone 1–6 operational capability [PENDING VERIFICATION]',
    'M25 corridor coverage [PENDING VERIFICATION]',
    '24/7 emergency response [PENDING VERIFICATION]',
    'Commercial property FM London',
    'ULEZ compliant operations [PENDING VERIFICATION]',
  ],
  requiredSections: [
    'London FM overview',
    'Services available in London',
    'Geographic coverage (zones/areas) [PENDING VERIFICATION]',
    'Response times [PENDING VERIFICATION]',
    'Sectors served in London',
    'London contact details [PENDING VERIFICATION]',
    'CTA',
  ],
  relatedRoutes: [
    '/facilities-management-london',
    '/london-facilities-management',
    '/london-facilities-management-areas',
    '/commercial-cleaning-london',
    '/industrial-cleaning-london',
    '/contract-cleaning-london',
    '/office-cleaning-london',
    '/mechanical-electrical',
    '/hard-services',
  ],
  conversionGoal:
    'Drive London-specific FM contract enquiries. Primary conversion: telephone call or contact form submission from London-based facilities managers.',
  verificationRequirements: [
    'London office / operational base address must be verified — see BUSINESS-CLAIMS-VERIFICATION.md',
    'Zone 1–6 coverage claim must be confirmed',
    'Response time SLA (reportedly 2-hour Central London) must be confirmed',
    'ULEZ fleet compliance must be confirmed',
    'London telephone number must be confirmed',
  ],
  contentStatus: 'CONTENT_PENDING',
};

export default record;
