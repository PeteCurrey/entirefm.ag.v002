/**
 * CONTENT RECORD: /tools/drone-inspection-planner
 * ===============================================
 * Provenance: NEW_GROWTH
 * Protected: Yes
 * PageType: tool
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const droneInspectionPlannerRecord: ContentRecord = {
  path: '/tools/drone-inspection-planner',
  title: 'Drone Inspection Planner | Build an Aerial Survey Brief | Entire FM',
  metaDescription: 'Configure your commercial drone survey requirement. Answer a few brief questions about your building, roof, or estate to receive a structured inspection recommendation.',
  h1: 'Commercial Drone Inspection Planner',
  eyebrow: 'INTERACTIVE SURVEY CONFIGURATOR',
  heroIntro: 'Tell us about the building, asset or site you need inspected. EntireFM will use your answers to recommend an appropriate inspection approach and create a structured survey brief for our team.',
  heroDescription: 'From single-building roof leaks to estate-wide planned maintenance and multi-storey façade audits, get a transparent scope and deliverable recommendations in minutes.',
  heroImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
  historicIntent: 'Interactive planning tool for commercial drone inspections, surveys, and asset thermography',
  primaryIntent: 'commercial drone inspection planner',
  secondaryIntents: [
    'drone survey configurator',
    'drone roof inspection brief',
    'plan commercial drone survey',
    'drone building inspection tool',
  ],
  pageType: 'service',
  service: 'Drone Services',
  sector: null,
  location: null,
  historicTopics: [
    'Drone inspection planning',
    'Roof defect investigation',
    'Building envelope surveys',
    'Thermal imaging scopes',
    'Drone PPM integration',
  ],
  requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta'],
  sections: [
    {
      heading: 'Evidence-Led Aerial Inspection Planning',
      body: 'Our interactive planner guides property managers, asset owners, and facilities directors through site scale, asset condition, and required technical deliverables to structure an optimal drone survey brief.',
    },
  ],
  capabilities: [
    {
      name: 'Deterministic Service Matching',
      description: 'Matches your building archetype and defect profile against 11 specialised Drone Services and 7 outcome-led inspection packs.',
      tag: 'Smart Matching',
    },
    {
      name: 'Structured Deliverable Breakdown',
      description: 'Identifies exact technical outputs required, from 48MP optical defect matrices to FLIR radiometric thermal datasets and 2D orthomosaics.',
      tag: 'Deliverables',
    },
    {
      name: 'EntireFM Remediation Integration',
      description: 'Bridges aerial survey findings with direct physical repairs via our in-house roofing, rope access, and M&E engineering divisions.',
      tag: 'Remediation Bridge',
    },
    {
      name: 'Printable Executive Brief',
      description: 'Generates a clean, reference-numbered inspection brief ready for board review, procurement tenders, or insurance adjusters.',
      tag: 'Executive Brief',
    },
  ],
  assetTypes: [],
  faqs: [
    {
      question: 'Is this planner an instant quotation calculator?',
      answer: 'No. Commercial drone inspections require site-specific risk assessment, airspace authorisation, and operational planning. The planner provides a structured technical recommendation and qualitative scope, which our aviation operations team then reviews to provide a formal proposal.',
    },
    {
      question: 'How does EntireFM use the answers I submit?',
      answer: 'Your answers generate a structured drone survey brief for our regional aviation and surveying teams. We use the building height, asset area, and urgency to evaluate flight permissions and prepare an actionable inspection plan.',
    },
    {
      question: 'Can EntireFM carry out physical repairs if the drone finds defects?',
      answer: 'Yes. Unlike standalone drone photography pilots, EntireFM is a multi-disciplinary facilities management and building engineering firm. We self-deliver rope access, BMU maintenance, commercial roofing repairs, M&E servicing, and drainage clearance.',
    },
    {
      question: 'Are drone inspections safe for occupied commercial buildings?',
      answer: 'Yes. All flights are conducted under UK CAA operational safety frameworks. We establish ground exclusion cordons, monitor weather thresholds, and schedule out-of-hours flights where necessary to ensure zero risk to building occupants.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/resources' },
    { name: 'Drone Inspection Planner', url: '/tools/drone-inspection-planner' },
  ],
  relatedRoutes: [
    '/services/drone-services',
    '/services/drone-services/roof-inspections',
    '/services/drone-services/building-envelope-inspections',
    '/services/drone-services/thermal-imaging',
    '/working-at-height-rope-access-bmu',
    '/ppm',
    '/contact-us',
  ],
  conversionGoal: 'Qualify and generate structured commercial drone inspection briefs.',
  verificationRequirements: [
    'Claims must match BUSINESS-CLAIMS-VERIFICATION.md',
    'No placeholder contact strings in rendered content',
    'No unverified statistics',
  ],
  contentStatus: 'CONTENT_COMPLETE',
};
