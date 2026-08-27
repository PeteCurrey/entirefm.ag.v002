import { AuthorityEntity, EditorialCandidate, EntityRelationship, StandardReference } from './types';

// Authority entities (Regulators, Institutions, Standards bodies)
export const AUTHORITIES: AuthorityEntity[] = [
  {
    id: 'auth-bsr',
    slug: 'building-safety-regulator',
    name: 'Building Safety Regulator (HSE)',
    acronym: 'BSR',
    role: 'Statutory Regulator',
    website: 'https://www.hse.gov.uk/building-safety',
    description: 'Enforcing the Building Safety Act 2022 and supervising safety across higher-risk buildings in England.',
    icon: 'ShieldAlert',
  },
  {
    id: 'auth-hse',
    slug: 'health-and-safety-executive',
    name: 'Health and Safety Executive',
    acronym: 'HSE',
    role: 'Statutory Regulator',
    website: 'https://www.hse.gov.uk',
    description: 'National independent regulator for workplace health, safety and statutory welfare compliance.',
    icon: 'ShieldCheck',
  },
  {
    id: 'auth-cibse',
    slug: 'cibse',
    name: 'Chartered Institution of Building Services Engineers',
    acronym: 'CIBSE',
    role: 'Professional Institution',
    website: 'https://www.cibse.org',
    description: 'Authoritative publisher of Guide M (Maintenance), Guide B (HVAC), and electrical engineering codes.',
    icon: 'BookOpen',
  },
  {
    id: 'auth-besa',
    slug: 'besa',
    name: 'Building Engineering Services Association',
    acronym: 'BESA',
    role: 'Trade Association',
    website: 'https://www.thebesa.com',
    description: 'Custodian of SFG20 standard maintenance specification for building services.',
    icon: 'Wrench',
  },
  {
    id: 'auth-iwfm',
    slug: 'iwfm',
    name: 'Institute of Workplace and Facilities Management',
    acronym: 'IWFM',
    role: 'Professional Institution',
    website: 'https://www.iwfm.org.uk',
    description: 'Professional body for workplace and facilities management practitioners across the UK and internationally.',
    icon: 'GraduationCap',
  },
];

// Standard references
export const STANDARDS: StandardReference[] = [
  {
    id: 'std-bs-7671',
    code: 'BS 7671:2018+A2:2022',
    title: 'Requirements for Electrical Installations (IET Wiring Regulations 18th Edition)',
    authorityId: 'auth-cibse',
    authorityName: 'IET / BSI',
    status: 'Current',
    summary: 'The national standard in the United Kingdom for electrical installation safety and verification.',
  },
  {
    id: 'std-acop-l8',
    code: 'ACOP L8 & HSG274',
    title: 'Legionnaires’ disease: The control of legionella bacteria in water systems',
    authorityId: 'auth-hse',
    authorityName: 'HSE',
    status: 'Current',
    summary: 'Approved Code of Practice and technical guidance on statutory water risk assessments, monitoring, and flushing regimes.',
  },
  {
    id: 'std-sfg20',
    code: 'SFG20',
    title: 'Standard Maintenance Specification for Building Engineering Services',
    authorityId: 'auth-besa',
    authorityName: 'BESA',
    status: 'Current',
    summary: 'The definitive standard for planned preventative maintenance task scheduling and statutory frequency benchmarking.',
  },
  {
    id: 'std-cibse-guide-m',
    code: 'CIBSE Guide M',
    title: 'Maintenance Engineering and Management (2023 Edition)',
    authorityId: 'auth-cibse',
    authorityName: 'CIBSE',
    status: 'Current',
    summary: 'Comprehensive methodology for asset condition grading, economic lifecycle replacement, and engineering strategy.',
  },
];

// Entity relationships: Put this into practice / Continue the conversation
const RELATIONSHIPS: EntityRelationship[] = [
  // Building Safety relationships
  {
    id: 'rel-bsa-01',
    sourceType: 'article',
    sourceId: 'building-safety-act-what-fm-teams-need-to-know-now',
    relationshipType: 'PUT_INTO_PRACTICE_WITH',
    targetType: 'tool',
    targetId: 'asset-register-builder',
    targetTitle: 'Asset Register Builder',
    targetUrl: '/tools/asset-register-builder',
    targetSnippet: 'Generate an SFG20-aligned statutory asset schedule with full nameplate data capture.',
    targetBadge: 'Tool',
    weight: 10,
  },
  {
    id: 'rel-bsa-02',
    sourceType: 'article',
    sourceId: 'building-safety-act-what-fm-teams-need-to-know-now',
    relationshipType: 'PUT_INTO_PRACTICE_WITH',
    targetType: 'resource',
    targetId: 'statutory-compliance-matrix',
    targetTitle: 'Commercial FM Statutory Compliance Matrix',
    targetUrl: '/resources/commercial-fm-statutory-compliance-matrix',
    targetSnippet: 'Master reference matrix of all 42 UK statutory maintenance obligations.',
    targetBadge: 'Checklist',
    weight: 9,
  },
  {
    id: 'rel-bsa-03',
    sourceType: 'article',
    sourceId: 'building-safety-act-what-fm-teams-need-to-know-now',
    relationshipType: 'CONTINUE_THE_CONVERSATION',
    targetType: 'room',
    targetId: 'building-safety',
    targetTitle: 'Building Safety & Golden Thread Room',
    targetUrl: '/lobby/rooms/building-safety',
    targetSnippet: 'Join 22 FM professionals discussing Accountable Person dutyholder compliance.',
    targetBadge: 'Live Room',
    weight: 10,
  },
  {
    id: 'rel-bsa-04',
    sourceType: 'article',
    sourceId: 'building-safety-act-what-fm-teams-need-to-know-now',
    relationshipType: 'CONTINUE_THE_CONVERSATION',
    targetType: 'discussion',
    targetId: 'mandatory-digital-occurrence-reporting-duty-holder-records',
    targetTitle: 'Mandatory Occurrence Reporting under BSA 2022',
    targetUrl: '/lobby/community/discussion/mandatory-digital-occurrence-reporting-duty-holder-records',
    targetSnippet: 'How FM teams log near-misses without inbox chaos.',
    targetBadge: 'Community',
    weight: 8,
  },

  // Condenser airflow / HVAC relationships
  {
    id: 'rel-hvac-01',
    sourceType: 'article',
    sourceId: 'condenser-airflow-starvation-on-enclosed-rooftops',
    relationshipType: 'PUT_INTO_PRACTICE_WITH',
    targetType: 'tool',
    targetId: 'ppm-frequency-calculator',
    targetTitle: 'PPM Frequency & Runtime Calculator',
    targetUrl: '/tools/ppm-frequency-calculator',
    targetSnippet: 'Calculate duty cycle and optimal condenser coil cleaning intervals.',
    targetBadge: 'Calculator',
    weight: 10,
  },
  {
    id: 'rel-hvac-02',
    sourceType: 'article',
    sourceId: 'condenser-airflow-starvation-on-enclosed-rooftops',
    relationshipType: 'CONTINUE_THE_CONVERSATION',
    targetType: 'discussion',
    targetId: 'ahu-belts-failing-early-alignment-tension-or-sheave-wear',
    targetTitle: 'AHU drive belts failing within 90 days — alignment vs tension',
    targetUrl: '/lobby/community/discussion/ahu-belts-failing-early-alignment-tension-or-sheave-wear',
    targetSnippet: 'Solved discussion on acoustic tension meters and sheave groove gauges.',
    targetBadge: 'Solved',
    weight: 9,
  },
  {
    id: 'rel-hvac-03',
    sourceType: 'article',
    sourceId: 'condenser-airflow-starvation-on-enclosed-rooftops',
    relationshipType: 'CONTINUE_THE_CONVERSATION',
    targetType: 'room',
    targetId: 'engineering-me',
    targetTitle: 'Engineering & M&E Plant Room',
    targetUrl: '/lobby/rooms/engineering-me',
    targetSnippet: 'Realtime chat with mechanical and electrical engineers.',
    targetBadge: 'Live Room',
    weight: 8,
  },
];

// Editorial candidates for promotion workflow
const EDITORIAL_CANDIDATES: EditorialCandidate[] = [
  {
    id: 'cand-01',
    discussionSlug: 'how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
    discussionTitle: 'How much asset data do you insist on before accepting mobilisation sign-off?',
    candidateType: 'Ask EntireFM',
    status: 'candidate',
    authorMemberName: 'Pete Currey & Liam O’Connor',
    nominatedBy: 'Editorial Desk',
    nominatedAt: '2026-08-27T10:00:00Z',
    editorNotes: 'Liam’s 3-step commercial framework (A-D grading, unverified exclusions, funded survey) should be drafted into an Ask EntireFM executive guide.',
  },
  {
    id: 'cand-02',
    discussionSlug: 'ahu-belts-failing-early-alignment-tension-or-sheave-wear',
    discussionTitle: 'AHU drive belts failing within 90 days — alignment, tensioning method or sheave wear?',
    candidateType: "Engineer's Note",
    status: 'candidate',
    authorMemberName: 'Pete Currey',
    nominatedBy: 'Hard FM Lead',
    nominatedAt: '2026-08-26T16:30:00Z',
    editorNotes: 'Turn the acoustic Hz measurement vs thumb deflection rule into an illustrated Engineer’s Note with photography.',
  },
];

export function getEntityRelationships(
  sourceType: EntityRelationship['sourceType'],
  sourceId: string,
  relationshipType?: EntityRelationship['relationshipType']
): EntityRelationship[] {
  let list = RELATIONSHIPS.filter((r) => r.sourceType === sourceType && r.sourceId === sourceId);
  if (relationshipType) {
    list = list.filter((r) => r.relationshipType === relationshipType);
  }
  return list.sort((a, b) => b.weight - a.weight);
}

export function getEditorialCandidates(): EditorialCandidate[] {
  return EDITORIAL_CANDIDATES;
}

export function nominateEditorialCandidate(data: {
  discussionSlug: string;
  discussionTitle: string;
  candidateType: EditorialCandidate['candidateType'];
  authorMemberName: string;
  nominatedBy: string;
  editorNotes?: string;
}): EditorialCandidate {
  const id = `cand-${Date.now()}`;
  const cand: EditorialCandidate = {
    id,
    discussionSlug: data.discussionSlug,
    discussionTitle: data.discussionTitle,
    candidateType: data.candidateType,
    status: 'candidate',
    authorMemberName: data.authorMemberName,
    nominatedBy: data.nominatedBy,
    nominatedAt: new Date().toISOString(),
    editorNotes: data.editorNotes,
  };
  EDITORIAL_CANDIDATES.unshift(cand);
  return cand;
}
