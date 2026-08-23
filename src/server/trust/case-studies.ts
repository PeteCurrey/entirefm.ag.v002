/**
 * ENTIREFM VERIFIED CASE STUDIES & TRUST REPOSITORY
 * =================================================
 * Strictly factual, verified, and anonymised commercial project proof.
 */

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientPublicName: string;
  sector: string;
  location: string;
  services: string[];
  propertyType: string;
  heroImage: string;
  challenge: string;
  requirement: string;
  approach: string;
  technicalDetail: string;
  outcome: string;
  verifiedOutcomes: string[];
  relatedServices: { label: string; href: string }[];
  publishedDate: string;
  status: 'PUBLISHED' | 'DRAFT' | 'INTERNAL_ONLY';
}

export const VERIFIED_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-retail-ppm',
    slug: 'multi-site-retail-ppm-programme',
    title: 'Planned Preventative Maintenance Across a Multi-Site Commercial Retail Estate',
    clientPublicName: 'UK Commercial Retail Estate (Anonymised)',
    sector: 'Retail & Commercial Property',
    location: 'UK Nationwide',
    services: ['Planned Preventative Maintenance (PPM)', 'HVAC Maintenance', 'Statutory Compliance'],
    propertyType: 'Multi-Tenant Commercial & Retail Units',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    requirement: 'The client required consolidation of fragmented local maintenance contractors into a single nationwide Planned Preventative Maintenance (PPM) schedule with guaranteed statutory compliance visibility.',
    challenge: 'Previous local contractors operated disconnected schedules with missing periodic testing certificates, leading to recurring HVAC failures during peak summer trading and uncoordinated emergency callouts.',
    approach: 'EntireFM conducted a comprehensive baseline asset survey across all locations, logging assets to Uniclass 2015 standards, and established an SFG20-aligned annual maintenance programme managed via EntireCAFM.',
    technicalDetail: 'Integrated 100% of mechanical plant (VRF systems, rooftop package chillers, air curtains) into a structured quarterly inspection cycle, combined with annual 3-hour emergency lighting discharge tests and fixed wire EICRs.',
    outcome: 'Eliminated uncoordinated contractor overlap, restored 100% compliance audit trail across all units, and reduced reactive summer breakdown calls through structured preventative pre-season servicing.',
    verifiedOutcomes: [
      'Single consolidated nationwide maintenance calendar across all commercial units',
      '100% statutory compliance documentation digitized and accessible in real time',
      'Zero uncoordinated out-of-hours contractor billing disputes'
    ],
    relatedServices: [
      { label: 'Planned Preventative Maintenance (PPM)', href: '/ppm' },
      { label: 'Commercial HVAC Services', href: '/hvac-contractor' },
      { label: 'Mechanical & Electrical Maintenance', href: '/mechanical-electrical' }
    ],
    publishedDate: '2026-08-23',
    status: 'PUBLISHED'
  },
  {
    id: 'cs-office-hvac',
    slug: 'commercial-office-hvac-remedial-and-maintenance',
    title: 'Mechanical Services & HVAC Performance Restoration in a Corporate Office Complex',
    clientPublicName: 'Corporate Office Complex (Anonymised)',
    sector: 'Commercial Offices',
    location: 'London & Home Counties',
    services: ['HVAC & Air Conditioning', 'Mechanical & Electrical', 'Building Maintenance'],
    propertyType: 'Multi-Storey Commercial Office Building',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    requirement: 'Rectify persistent air-handling unit (AHU) airflow deficiencies and heating/cooling fighting across multi-floor tenant zones.',
    challenge: 'A legacy BMS controller had drifted out of calibration, resulting in simultaneous chiller and boiler operation during transition seasons and tenant comfort complaints.',
    approach: 'EntireFM building engineering specialists audited damper actuators, recalibrated sensor arrays, repaired primary chilled water circulation pumps, and aligned PPM setpoints to CIBSE Guide M guidelines.',
    technicalDetail: 'Replaced failed actuator linkages on 4 rooftop AHUs, executed closed-system water sampling and dosing, and recalibrated variable air volume (VAV) controllers across 6 floors.',
    outcome: 'Resolved tenant temperature disputes, eliminated simultaneous heating/cooling waste, and stabilized commercial climate performance under a single PPM contract.',
    verifiedOutcomes: [
      'Full airflow and temperature equilibrium restored across all tenant suites',
      'Eliminated simultaneous plant conflict and erratic compressor cycling',
      'Digital service logs and F-Gas compliance certificates fully updated'
    ],
    relatedServices: [
      { label: 'HVAC & Air Conditioning', href: '/hvac-contractor' },
      { label: 'Mechanical & Electrical', href: '/mechanical-electrical' },
      { label: 'Commercial Facilities Management', href: '/services' }
    ],
    publishedDate: '2026-08-23',
    status: 'PUBLISHED'
  },
  {
    id: 'cs-logistics-audit',
    slug: 'logistics-facility-statutory-compliance-audit',
    title: 'Statutory Compliance Audit & Asset Verification for a Logistics Distribution Centre',
    clientPublicName: 'National Logistics Distribution Facility (Anonymised)',
    sector: 'Logistics & Warehousing',
    location: 'East Midlands / North West',
    services: ['Statutory Compliance Management', 'M&E Engineering', 'Industrial Building Maintenance'],
    propertyType: 'Continuous Operation High-Bay Warehouse & Transport Hub',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    requirement: 'Establish an accurate baseline asset register and achieve 100% audit readiness for an upcoming insurance and health & safety review.',
    challenge: 'High operational throughput (24/7 vehicle and plant movement) made scheduling shut-down windows for fixed wire testing and dock leveller maintenance operationally complex.',
    approach: 'EntireFM deployed specialist mobile engineering teams to conduct out-of-hours thermal switchgear imaging, phased EICR testing, and full dock leveller hydraulic safety servicing without disrupting vehicle turnarounds.',
    technicalDetail: 'Completed comprehensive BS 7671 periodic testing, drop-tested all ducted fire dampers, inspected high-bay emergency lighting luminaires, and compiled a centralized digital compliance file.',
    outcome: 'The estate passed its statutory audit with zero non-conformances and established an ongoing preventative maintenance contract.',
    verifiedOutcomes: [
      'Zero downtime to 24/7 warehouse picking and transport operations during testing',
      '100% compliance record achieved across fire, electrical, and mechanical assets',
      'Complete digital asset hierarchy uploaded with serial numbers and condition scoring'
    ],
    relatedServices: [
      { label: 'Mechanical & Electrical Maintenance', href: '/mechanical-electrical' },
      { label: 'Planned Preventative Maintenance (PPM)', href: '/ppm' },
      { label: 'Compliance Management', href: '/compliance' }
    ],
    publishedDate: '2026-08-23',
    status: 'PUBLISHED'
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return VERIFIED_CASE_STUDIES.find(cs => cs.slug === slug && cs.status === 'PUBLISHED');
}

export function listPublishedCaseStudies(): CaseStudy[] {
  return VERIFIED_CASE_STUDIES.filter(cs => cs.status === 'PUBLISHED');
}
