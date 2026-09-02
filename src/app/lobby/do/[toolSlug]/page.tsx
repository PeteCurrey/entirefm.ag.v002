import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TemplateLobbyDoToolDetail, type ToolDetailData } from '@/templates/lobby/TemplateLobbyDoToolDetail';
import { FM_TOOLBOX_DATA } from '@/data/lobby/toolbox-data';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

// Rich detail specifications for FM Toolbox tools
const TOOL_DETAIL_REGISTRY: Record<string, Omit<ToolDetailData, keyof typeof FM_TOOLBOX_DATA[0]>> = {
  'ppm-schedule-builder': {
    whatItDoes: [
      'Generates a comprehensive 52-week planned maintenance matrix based on building asset selections.',
      'Maps asset types directly to SFG20 standard frequencies (weekly, monthly, quarterly, annual).',
      'Distinguishes statutory mandatory testing from recommended good-practice maintenance intervals.',
      'Exports directly to Excel (.xlsx) for loading into commercial CAFM engines.',
    ],
    whenToUseIt: [
      'Mobilising a new commercial office or residential building.',
      'Auditing an incumbent contractor’s maintenance regime during tender renewal.',
      'Establishing a baseline asset governance register for Building Safety Act Golden Thread compliance.',
    ],
    inputsRequired: [
      'Site property type and approximate square footage.',
      'Installed asset categories (HVAC, Electrical, Fire Life Safety, Water Hygiene, Lifting Equipment).',
      'Desired service level tier (Statutory Baseline vs Enhanced Operational Resilience).',
    ],
    outputDetails: [
      'Interactive 52-week maintenance calendar grid.',
      'Task breakdown per asset with standard hours and engineering trade discipline.',
      'Exportable Excel PPM schedule ready for CAFM import.',
    ],
    methodologyNotes:
      'Frequencies are aligned with primary UK statutory obligations (EAWR 1989, RRO 2005, ACOP L8, F-Gas) and BESA SFG20 guidelines. Asset operating hours and manufacturer warranties should be cross-referenced.',
    relatedCheckUrl: '/lobby/check',
    relatedKnowUrl: '/lobby/know',
    relatedFindUrl: '/lobby/find',
  },
  'tender-brief-generator': {
    whatItDoes: [
      'Structures a neutral, professional facilities management tender brief from high-level estate requirements.',
      'Defines clear service level agreements (SLAs), emergency response windows, and contractor KPIs.',
      'Establishes CAFM reporting transparency, statutory audit rights, and invoicing protocols.',
      'Formats technical specifications ready for market engagement.',
    ],
    whenToUseIt: [
      'Market-testing hard FM, cleaning, security, or total facilities management contracts.',
      'Replacing an under-performing incumbent contractor with measurable performance covenants.',
      'Drafting procurement specifications for Crown Commercial Service or public-sector tenders.',
    ],
    inputsRequired: [
      'Estate portfolio scope (number of sites, locations, floor area).',
      'Required service lots (M&E, Water, Fire, Fabric Maintenance, Soft Services).',
      'Key performance priority (Cost Predictability vs Statutory Assurance vs High-Touch Occupant Experience).',
    ],
    outputDetails: [
      'Complete Invitation to Tender (ITT) technical specification brief.',
      'Service Level Agreement (SLA) response time matrix.',
      'Contractor evaluation scoring criteria guide.',
    ],
    methodologyNotes:
      'Generates technical and operational drafting briefs. Legal terms of business and commercial contract clauses should be reviewed by qualified legal counsel.',
    relatedCheckUrl: '/lobby/check',
    relatedKnowUrl: '/lobby/know',
    relatedFindUrl: '/lobby/find',
  },
  'asset-scanner': {
    whatItDoes: [
      'Runs optical character recognition (OCR) on plantroom nameplate photographs.',
      'Extracts manufacturer, model number, serial number, electrical ratings (kW/A), and refrigerant charge.',
      'Maps scanned plant items directly to SFG20 asset taxonomy codes.',
      'Identifies statutory inspection intervals based on extracted equipment specifications.',
    ],
    whenToUseIt: [
      'Conducting site condition surveys and asset verification audits during building takeover.',
      'Updating legacy asset registers that lack full serial numbers or refrigerant weights.',
      'Auditing rooftop chiller and condensing unit F-Gas compliance.',
    ],
    inputsRequired: [
      'Direct photograph of the plantroom equipment nameplate or serial badge.',
      'Optional building location and plantroom identifier notes.',
    ],
    outputDetails: [
      'Structured Golden Thread asset record with validated serial numbers.',
      'F-Gas CO2 equivalent calculation where refrigerant weights are extracted.',
      'Recommended statutory maintenance frequency code.',
    ],
    methodologyNotes:
      'OCR accuracy depends on image resolution, lighting, and physical condition of the plantplate. Critical life-safety asset tags should always be visually verified.',
    relatedCheckUrl: '/lobby/check#hvac',
    relatedKnowUrl: '/lobby/know',
    relatedFindUrl: '/lobby/find',
  },
  'statutory-compliance-checker': {
    whatItDoes: [
      'Screens commercial building operations against 10 primary UK statutory compliance regimes.',
      'Calculates an objective estate compliance risk score based on current audit status.',
      'Identifies duty-holder liability exposure under the Building Safety Act, EAWR, and Fire Safety Order.',
      'Generates a prioritised action plan targeting overdue statutory certifications.',
    ],
    whenToUseIt: [
      'Preparing for incoming landlord statutory audits or insurance renewal inspections.',
      'Assuming responsible-person duty-holder liability for a new property portfolio.',
      'Benchmarking current managing agent compliance record hygiene.',
    ],
    inputsRequired: [
      'Building profile (height, multi-occupancy status, commercial/residential mix).',
      'Current certification dates for Fire, EICR, Gas, Legionella, LOLER, Asbestos, and EPC.',
    ],
    outputDetails: [
      'Prioritised statutory gap analysis report.',
      'Immediate action checklist for expired or overdue regimes.',
      'Duty-holder exposure summary.',
    ],
    methodologyNotes:
      'Diagnostic tool designed for estate risk screening. Does not substitute for on-site statutory inspections conducted by certified competent persons.',
    relatedCheckUrl: '/lobby/check',
    relatedKnowUrl: '/lobby/know',
    relatedFindUrl: '/lobby/find',
  },
};

export async function generateStaticParams() {
  return Object.keys(TOOL_DETAIL_REGISTRY).map((slug) => ({
    toolSlug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ toolSlug: string }> }): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = FM_TOOLBOX_DATA.find((t) => t.slug === toolSlug);

  if (!tool) {
    return {
      title: 'FM Tool | The Lobby — EntireFM',
    };
  }

  return {
    title: `${tool.name} · FM Toolbox | The Lobby — EntireFM`,
    description: tool.description,
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/do/${toolSlug}`,
    },
    openGraph: {
      title: `${tool.name} · FM Toolbox | The Lobby — EntireFM`,
      description: tool.description,
      url: `${PRODUCTION_CANONICAL_HOST}/lobby/do/${toolSlug}`,
      type: 'website',
    },
  };
}

export default async function LobbyDoToolDetailPage({
  params,
}: {
  params: Promise<{ toolSlug: string }>;
}) {
  const { toolSlug } = await params;
  const baseTool = FM_TOOLBOX_DATA.find((t) => t.slug === toolSlug);
  const detailExtra = TOOL_DETAIL_REGISTRY[toolSlug];

  if (!baseTool || !detailExtra) {
    notFound();
  }

  const toolData: ToolDetailData = {
    ...baseTool,
    ...detailExtra,
  };

  return <TemplateLobbyDoToolDetail tool={toolData} />;
}
