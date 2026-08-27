import type { Topic } from './types';

export const LOBBY_TOPICS: Topic[] = [
  {
    slug: 'building-safety',
    name: 'Building Safety',
    description: 'Statutory Golden Thread compliance, safety case reports, occurrence reporting, and duty-holder governance under the Building Safety Act.',
    category: 'compliance',
  },
  {
    slug: 'fire-safety',
    name: 'Fire Safety & Protection',
    description: 'Fire risk assessments (FRA), BS 5839 alarm maintenance, BS 5266 emergency lighting, compartmentation, and evacuation systems.',
    category: 'compliance',
  },
  {
    slug: 'electrical',
    name: 'Electrical & Power Systems',
    description: 'BS 7671 periodic testing (EICR), distribution switchgear, thermographic surveys, EV charging infrastructure, and HV/LV maintenance.',
    category: 'engineering',
  },
  {
    slug: 'water-hygiene',
    name: 'Water Hygiene & Legionella',
    description: 'ACOP L8 written schemes, temperature monitoring, calorifier maintenance, sampling regimes, and statutory water risk assessments.',
    category: 'compliance',
  },
  {
    slug: 'hvac',
    name: 'HVAC & Climate Control',
    description: 'Commercial chillers, AHUs, VRF/VRV air conditioning, F-Gas compliance, ventilation rates, and seasonal commissioning.',
    category: 'engineering',
  },
  {
    slug: 'ppm',
    name: 'Planned Preventative Maintenance',
    description: 'SFG20 task matrices, statutory vs manufacturer maintenance cycles, asset registers, and asset life-cycle optimisation.',
    category: 'operations',
  },
  {
    slug: 'asset-management',
    name: 'Asset Management & Hierarchy',
    description: 'ISO 55000 standards, Uniclass 2015 spatial tagging, condition scoring, and capital expenditure replacement planning.',
    category: 'operations',
  },
  {
    slug: 'cafm-technology',
    name: 'CAFM & Digital Operations',
    description: 'Computer Aided Facilities Management, IoT telemetry, predictive analytics, digital logbooks, and work-order transparency.',
    category: 'technology',
  },
  {
    slug: 'ai-automation',
    name: 'AI & Automation in FM',
    description: 'Practical artificial intelligence applications, autonomous fault detection, intelligent dispatch, and telemetry analysis in building operations.',
    category: 'technology',
  },
  {
    slug: 'procurement',
    name: 'Procurement & Tenders',
    description: 'FM specifications, tender brief formulation, output vs input models, contractor evaluation, and commercial benchmarking.',
    category: 'operations',
  },
  {
    slug: 'mobilisation',
    name: 'Mobilisation & Contract Takeover',
    description: 'Operational handover checklists, baseline asset condition audits, TUPE management, and transition risk mitigation.',
    category: 'operations',
  },
  {
    slug: 'contract-management',
    name: 'Contract Management & Governance',
    description: 'Service level agreements (SLAs), key performance indicators (KPIs), supplier governance, and open-book commercial transparency.',
    category: 'operations',
  },
  {
    slug: 'sustainability',
    name: 'Sustainability & Energy',
    description: 'Commercial heat pump electrification, Building Regulations Part L, EPC standards, TM44 inspections, and decarbonisation pathways.',
    category: 'engineering',
  },
  {
    slug: 'health-safety',
    name: 'Health & Safety Governance',
    description: 'Workplace risk assessments, CDM 2015 regulations, contractor permit-to-work systems, and working at height compliance.',
    category: 'compliance',
  },
  {
    slug: 'compliance',
    name: 'Statutory Compliance Baseline',
    description: 'UK commercial property legal obligations, strict liability enforcement, statutory testing intervals, and prosecution risk reduction.',
    category: 'compliance',
  },
];

export const TOPICS_MAP = new Map<string, Topic>(
  LOBBY_TOPICS.map((t) => [t.slug, t])
);

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS_MAP.get(slug);
}
