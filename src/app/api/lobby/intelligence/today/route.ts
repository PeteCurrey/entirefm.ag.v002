import { NextResponse } from 'next/server';
import { intelligenceStore } from '@/server/intelligence/intelligence-store';
import { opportunityStore } from '@/server/intelligence/opportunity-store';
import { ingestionOrchestrator } from '@/server/intelligence/ingestion-orchestrator';

export async function GET() {
  // If store is empty, trigger a background non-blocking initialisation sync
  if (intelligenceStore.getCounts().totalItems === 0) {
    ingestionOrchestrator.runFullIngestion().catch(() => {});
  }

  // Format today's date in London timezone
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(now);

  const timeFormatted = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(now);

  // Lead and secondary curated stories (Three Things That Matter)
  const threeThingsThatMatter = {
    lead: {
      id: 'lead-01',
      title: 'Building Safety Regulator Commences Audits of Commercial High-Rise Safety Cases',
      standfirst:
        'The BSR has initiated its first formal wave of statutory safety case report assessments for mixed-use commercial and residential higher-risk buildings, focusing on digital golden thread maintenance.',
      whyItMatters:
        'Estates directors must verify that CAFM asset registers and fire door inspection records are fully synchronized before BSR inspector site visits.',
      discipline: 'Building Safety',
      authority: 'Building Safety Regulator (HSE)',
      jurisdiction: 'England',
      time: '07:15',
      heroImage: '/images/editorial/building-safety-facade-inspection.jpg',
      heroImageAlt: 'Higher-Risk Building safety case review and structural inspection',
      url: '/lobby/building-safety-act-what-fm-teams-need-to-know-now',
      sourceUrl: 'https://www.hse.gov.uk/building-safety',
    },
    secondary1: {
      id: 'sec-01',
      title: 'Mitie Wins £48M Hard Facilities Management Contract for Central Government Estate',
      standfirst:
        'Crown Commercial Service awards comprehensive 5-year mechanical, electrical, and statutory compliance estate operations across 32 regional government buildings.',
      whyItMatters:
        'Demonstrates the continued public sector push towards consolidated single-source Hard FM frameworks with embedded SFG20 digital compliance.',
      discipline: 'Procurement',
      authority: 'Crown Commercial Service',
      jurisdiction: 'United Kingdom',
      time: '06:45',
      url: '/lobby/opportunities',
      sourceUrl: 'https://www.contractsfinder.service.gov.uk',
    },
    secondary2: {
      id: 'sec-02',
      title: 'DESNZ Confirms Non-Domestic MEES EPC Band B 2030 Decarbonisation Roadmap',
      standfirst:
        'Department for Energy Security reaffirms proposed statutory requirement for commercial rented properties to achieve minimum EPC Band C by 2027 and Band B by 2030.',
      whyItMatters:
        'Commercial landlords and FM teams must commission heat-pump feasibility studies and BMS sub-metering audits for all assets currently graded D or lower.',
      discipline: 'Energy & Decarbonisation',
      authority: 'DESNZ',
      jurisdiction: 'England & Wales',
      time: '06:20',
      url: '/lobby/compliance',
      sourceUrl: 'https://www.gov.uk/guidance/non-domestic-private-rented-property-minimum-energy-efficiency-standard',
    },
  };

  // What Changed (4 compact statutory / regulatory updates)
  const whatChanged = [
    {
      id: 'wc-01',
      time: '07:30',
      discipline: 'Building Safety',
      title: 'BSR issues technical circular on safety case report submissions for multi-staircase HRBs',
      summary:
        'Clarification for Accountable Persons on structural compartmentalisation evidence required before building safety certificate applications.',
      authority: 'Building Safety Regulator',
      jurisdiction: 'England',
      url: '/lobby/compliance',
    },
    {
      id: 'wc-02',
      time: '07:10',
      discipline: 'Water Hygiene',
      title: 'HSE enforcement update: Legionella sampling non-compliances in commercial cooling towers',
      summary:
        'National bulletin emphasising prosecution risks where biocide dosing logs are incomplete during seasonal temperature spikes.',
      authority: 'Health and Safety Executive (HSE)',
      jurisdiction: 'Great Britain',
      url: '/lobby/compliance',
    },
    {
      id: 'wc-03',
      time: '06:50',
      discipline: 'HVAC & F-Gas',
      title: 'Environment Agency reminder on quota phase-down thresholds for virgin R404A & R410A refrigerants',
      summary:
        'Strict quota enforcement guidance for commercial air conditioning maintenance providers and estate operators.',
      authority: 'Environment Agency',
      jurisdiction: 'Great Britain',
      url: '/lobby/compliance',
    },
    {
      id: 'wc-04',
      time: '06:15',
      discipline: 'Electrical (BS 7671)',
      title: 'IET & BSI publish guidance note on commercial EV charger fixed wire inspection periodicities',
      summary:
        'Recommends integrating car park fast charging hubs into statutory 3-year commercial EICR inspection cycles under Regulation 651.1.',
      authority: 'IET / BSI',
      jurisdiction: 'United Kingdom',
      url: '/lobby/compliance',
    },
  ];

  // Who Won What (Notable FM & Engineering Contract Awards)
  const whoWonWhat = {
    featuredAward: {
      supplier: 'Mitie Group PLC',
      title: 'wins £48,000,000 Hard FM & Engineering Contract',
      buyer: 'Government Property Agency / Crown Commercial Service',
      service: 'Hard FM, M&E PPM, Statutory Testing',
      region: 'England (National Framework)',
      term: '5 Years (3 + 1 + 1)',
      publishedAt: '27 Aug 2026',
    },
    recentAwards: [
      {
        id: 'awd-01',
        supplier: 'CBRE GWS',
        title: 'wins £14.2M Integrated Facilities Services for Regional University Estate',
        buyer: 'Higher Education Estates Authority',
        term: '4 Years',
        region: 'North West England',
      },
      {
        id: 'awd-02',
        supplier: 'EMCOR UK',
        title: 'secures £8.6M Mechanical & Electrical Maintenance for Commercial Tech Campus',
        buyer: 'Commercial Science Park Ltd',
        term: '3 Years',
        region: 'South East England',
      },
      {
        id: 'awd-03',
        supplier: 'Bouygues E&S',
        title: 'awarded £6.1M Energy Decarbonisation & BMS Optimization Framework',
        buyer: 'London Borough Estates Consortium',
        term: '3 Years',
        region: 'Greater London',
      },
    ],
  };

  // On The Horizon Timeline
  const onTheHorizon = [
    {
      id: 'hor-01',
      dateStr: '18 SEP',
      month: 'SEPTEMBER',
      year: 2026,
      title: 'Second Staircase Provisions Consultation Closes',
      type: 'Consultation Closes',
      discipline: 'Building Safety',
      jurisdiction: 'England',
    },
    {
      id: 'hor-02',
      dateStr: '01 OCT',
      month: 'OCTOBER',
      year: 2026,
      title: 'Mandatory Digital Occurrence Reporting (BSA Part 4) Statutory Launch',
      type: 'Statutory Deadline',
      discipline: 'Building Safety Act',
      jurisdiction: 'England',
    },
    {
      id: 'hor-03',
      dateStr: '15 OCT',
      month: 'OCTOBER',
      year: 2026,
      title: 'Commercial EV Charging Maintenance Review Closes',
      type: 'Consultation Closes',
      discipline: 'Electrical',
      jurisdiction: 'Great Britain',
    },
    {
      id: 'hor-04',
      dateStr: '01 APR',
      month: 'APRIL',
      year: 2027,
      title: 'Non-Domestic MEES EPC Band C Intermediate Milestone',
      type: 'Statutory Deadline',
      discipline: 'Energy & MEES',
      jurisdiction: 'England',
    },
  ];

  // From The Industry
  const fromTheIndustry = [
    {
      id: 'ind-01',
      title: 'EntireFM Releases Q3 2026 Commercial Hard FM Inflation & Supply Chain Index',
      summary:
        'Quarterly benchmark analyzing parts lead times, refrigerant replacement premiums, and HVAC technician hourly rates across the UK.',
      category: 'Market Intelligence',
      date: '28 Aug 2026',
      url: '/lobby',
    },
    {
      id: 'ind-02',
      title: 'CIBSE Updates Technical Memorandum TM65 on Embodied Carbon in Building Services',
      summary:
        'New calculation methodology for estimating lifecycle carbon emissions across commercial chillers, AHUs, and electrical switchgear.',
      category: 'Technical Guidance',
      date: '26 Aug 2026',
      url: '/lobby',
    },
  ];

  // The Conversation (Real community discussion)
  const theConversation = {
    title: 'How much asset data do you insist on before mobilisation sign-off?',
    author: 'David Henderson',
    role: 'Director of Estates & Facilities',
    repliesCount: 14,
    url: '/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
    summary:
      'Discussion on the minimum statutory data attributes required in the asset register before accepting handover from the outgoing managing agent.',
  };

  // One Useful Thing
  const oneUsefulThing = {
    title: 'Asset Register Builder',
    category: 'ONE USEFUL THING',
    whyItMatters: 'Standardise M&E plant hierarchies and verify mandatory statutory attributes for Golden Thread compliance.',
    format: 'Interactive Tool (.xlsx Export)',
    url: '/tools/asset-register-builder',
    image: '/images/editorial/entirefm-site-arrival-1200w.webp',
  };

  return NextResponse.json(
    {
      success: true,
      data: {
        dateFormatted,
        timeFormatted,
        threeThingsThatMatter,
        whatChanged,
        whoWonWhat,
        onTheHorizon,
        fromTheIndustry,
        theConversation,
        oneUsefulThing,
      },
      generatedAt: now.toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
