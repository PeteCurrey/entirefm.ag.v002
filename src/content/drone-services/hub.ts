/**
 * CONTENT RECORD: /services/drone-services
 * ========================================
 * Flagship Hub for EntireFM Drone Services Division.
 * Aerial Inspection, Surveying & Asset Intelligence.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const droneHubRecord: ContentRecord = {
  path: '/services/drone-services',
  title: 'Commercial Drone Services | Aerial Inspection & Surveying | EntireFM',
  metaDescription: 'Commercial drone inspection, thermal surveying, 3D mapping and aerial asset intelligence across the UK — fully integrated with EntireFM maintenance, PPM and repair.',
  h1: 'Drone Inspection, Surveying & Aerial Asset Intelligence',
  eyebrow: 'AERIAL ASSET INTELLIGENCE',
  heroIntro: 'Commercial drone services for buildings, estates, infrastructure and construction — integrated directly with EntireFM maintenance, compliance and project delivery.',
  heroDescription: 'EntireFM does not simply fly drones and hand over photographs. We inspect assets safely, identify defects, convert findings into actionable maintenance requirements, complete remedial works where required, and maintain an auditable digital record of property condition.',
  heroImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
  historicIntent: 'Commercial aerial drone inspections, thermal roof surveys and building envelope asset intelligence',
  primaryIntent: 'commercial drone services',
  secondaryIntents: [
    'drone building inspection',
    'drone roof survey UK',
    'commercial drone asset management',
    'thermal drone survey facilities management',
  ],
  pageType: 'service',
  service: 'Drone Services',
  sector: null,
  location: null,
  historicTopics: [
    'Drone inspection overview',
    'Actionable maintenance workflow',
    'Inspection packs',
    'Drone PPM schedules',
    'EntireCAFM integration',
    'UK CAA operational compliance',
  ],
  requiredSections: [
    'hero',
    'process-flow',
    'services-grid',
    'packages',
    'ppm-integration',
    'cafm-workflow',
    'sample-outputs',
    'compliance',
    'sectors',
    'faq',
    'conversion',
  ],
  capabilities: [
    {
      name: 'High-Level Asset Inspection',
      description: 'Ultra-high-resolution visual audits of roofs, facades, chimneys, plant decks and inaccessible structures without scaffolding or MEWP costs.',
      tag: 'VISUAL DEFECT AUDIT',
    },
    {
      name: 'Radiometric Thermal Imaging',
      description: 'Calibrated FLIR thermal surveys detecting trapped moisture in flat roof insulation, building heat loss and photovoltaic electrical hotspots.',
      tag: 'THERMAL DIAGNOSTICS',
    },
    {
      name: 'Surveying & Orthomosaics',
      description: 'Millimetre-scale 2D orthomosaic maps, digital elevation models, and CAD/GIS export workflows calibrated with GCP and RTK positioning.',
      tag: 'GEOSPATIAL MAPPING',
    },
    {
      name: 'Digital Twin & 3D Reality Capture',
      description: 'Persistent photogrammetric 3D point clouds and reality mesh models providing remote stakeholder site access and historic asset baselines.',
      tag: 'REALITY CAPTURE',
    },
    {
      name: 'Construction Progress Tracking',
      description: 'Scheduled repeat flight capture providing consistent milestone photography, earthworks cut/fill analysis, and stakeholder progress records.',
      tag: 'PROJECT MONITORING',
    },
    {
      name: 'End-to-End Remedial Delivery',
      description: 'Direct bridge from aerial defect identification to physical rope access, BMU maintenance, roofing repairs, and CAFM work order signoff.',
      tag: 'TOTAL FM REMEDIATION',
    },
  ],
  faqs: [
    {
      question: 'How is EntireFM Drone Services different from independent drone survey operators?',
      answer: 'Standard drone operators deliver raw uncurated photographs or point-cloud files, leaving the building manager to interpret defects and procure separate repair contractors. EntireFM combines advanced aerial data capture with self-delivering hard FM, rope access, roofing, and M&E capabilities. We diagnose the defect, specify the remedial scope, execute the physical repair, and verify completion within EntireCAFM.',
    },
    {
      question: 'Are your commercial drone operations compliant with UK Civil Aviation Authority (CAA) regulations?',
      answer: 'Yes. All EntireFM flight operations are conducted strictly in accordance with UK aviation law, applicable CAA operational authorisations, and site-specific Risk Assessment & Method Statements (RAMS). Our flight crews hold appropriate commercial flyer and operator competencies, secure required airspace clearances (including FRZs and congested areas), and maintain comprehensive aviation third-party liability insurance.',
    },
    {
      question: 'Can drone surveys completely eliminate the need for scaffolding, MEWPs, or rope access?',
      answer: 'Drones dramatically reduce the need for initial physical access equipment, eliminating the cost, disruption, and safety risks of erecting scaffolding purely for inspection. When physical repair work is required, drone data enables precise, targeted deployment of rope access technicians, BMU cradles, or MEWPs directly to the defect location, minimizing total access expenditure and on-site contractor hours.',
    },
    {
      question: 'How do drone inspections integrate into Planned Preventative Maintenance (PPM)?',
      answer: 'Drone inspections can be scheduled on quarterly, biannual, or annual cadences as part of your SFG20 maintenance plan. Typical regimes include quarterly gutter and drainage reviews, biannual roof membrane condition audits, and annual thermal envelope and solar PV performance scans. Every flight record is archived against the asset register in EntireCAFM for longitudinal trend analysis.',
    },
    {
      question: 'What weather conditions prevent commercial drone flights?',
      answer: 'Commercial flight safety parameters require wind speeds below equipment gust thresholds (typically 20–25 knots / 28 mph), absence of active precipitation (rain, snow, sleet), and visibility sufficient to maintain Visual Line of Sight (VLOS). For thermal imaging surveys, specific environmental conditions—such as dry surfaces, solar loading delta, or overcast night transitions—are required for accurate delta-T radiometric measurements.',
    },
    {
      question: 'What file formats and deliverables do clients receive following an inspection?',
      answer: 'Deliverables are tailored to your requirements and can include high-resolution georeferenced inspection imagery, structured PDF defect condition reports with priority scoring, georeferenced 2D orthomosaics (GeoTIFF, ECW), thermal radiometric datasets, 3D point clouds (LAS, LAZ, OBJ), DXF/DWG contours, and digital twin web viewer access.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Drone Services', url: '/services/drone-services' },
  ],
  relatedRoutes: [
    '/services/drone-services/drone-inspections',
    '/services/drone-services/roof-inspections',
    '/services/drone-services/building-envelope-inspections',
    '/services/drone-services/thermal-imaging',
    '/services/drone-services/solar-pv-inspections',
    '/services/drone-services/surveying-mapping',
    '/services/drone-services/construction-monitoring',
    '/services/drone-services/emergency-insurance-surveys',
    '/services/drone-services/digital-twin-3d-capture',
    '/services/drone-services/volumetric-surveys',
    '/services/drone-services/aerial-photography-video',
    '/working-at-height-rope-access-bmu',
    '/ppm',
    '/building-maintenance',
    '/hard-services',
  ],
  conversionGoal: 'Generate commercial flight planning enquiries, multi-site inspection framework proposals, and Drone PPM quotes.',
  verificationRequirements: [
    'Strict alignment with BUSINESS-CLAIMS-VERIFICATION.md',
    'No unverified CAA regulatory claims',
    'Clear end-to-end EntireCAFM remediation workflow',
  ],
  contentStatus: 'CONTENT_COMPLETE',
};
