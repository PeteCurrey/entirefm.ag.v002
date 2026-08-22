/**
 * CONTENT RECORD: /mechanical-electrical
 * ========================================
 * Route Provenance: LEGACY_VERIFIED (G1 + G2)
 * Priority: P0 — Core commercial driver
 *
 * Historic intent: Businesses searching for a single contractor to
 * handle all mechanical and electrical maintenance requirements.
 *
 * NOTE: This is NOT the same page as /hvac-contractor.
 * Both exist independently with distinct intent.
 */

import type { ContentRecord } from '@/content/index';

const record: ContentRecord = {
  path: '/mechanical-electrical',
  title: 'Mechanical & Electrical Services | Entire FM',
  metaDescription:
    'Entire FM delivers integrated mechanical and electrical services across the UK — PPM, emergency response, access control, emergency lighting, HVAC, and compliance management.',
  h1: 'Mechanical & Electrical Services',
  historicIntent:
    'Businesses and facilities managers searching for a single contractor to handle all mechanical and electrical FM requirements across their estate.',
  primaryIntent: 'M&E facilities management contractor UK',
  secondaryIntents: [
    'mechanical and electrical maintenance contract',
    'M&E FM services',
    'building mechanical electrical services',
    'planned preventative M&E maintenance',
  ],
  pageType: 'service',
  service: 'Mechanical & Electrical',
  sector: null,
  location: null,
  historicTopics: [
    'Mechanical systems maintenance',
    'Electrical compliance and testing',
    'HVAC integration',
    'Access control systems',
    'Emergency lighting testing',
    'Planned maintenance scheduling',
  ],
  requiredSections: [
    'Service overview',
    'M&E services scope (full list)',
    'Compliance and certification [PENDING VERIFICATION]',
    'PPM and reactive maintenance approach',
    'Geographic coverage',
    'Contact/enquiry CTA',
  ],
  relatedRoutes: [
    '/hvac-contractor',
    '/ppm',
    '/hard-services',
    '/mechanical-electrical/emergency-light-testing',
    '/mechanical-electrical/access-control',
    '/plumbing-gas',
    '/fire-emergency-systems',
  ],
  conversionGoal:
    'Drive telephone and form enquiries from facilities managers requiring M&E maintenance contracts.',
  verificationRequirements: [
    'Certification claims (NICEIC, Gas Safe) must be verified before going live — see BUSINESS-CLAIMS-VERIFICATION.md',
    'SLA response times must be confirmed before stating in copy',
    'All compliance claims must reference verified standards only',
  ],
  contentStatus: 'CONTENT_PENDING',
};

export default record;
