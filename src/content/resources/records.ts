/**
 * RESOURCES & TOOLS CONTENT RECORDS
 * =================================
 * Single source of truth for metadata and content specs across the restored
 * and upgraded EntireFM interactive tools, resource hubs, Academy, Document Vault,
 * FM Intelligence and Building Walk.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const RESOURCES_CONTENT: Record<string, ContentRecord> = {
  '/resources': {
    path: '/resources',
    title: 'FM Resources, Tools & Guides | Facilities Management Hub | Entire FM',
    metaDescription: 'Free practical facilities management tools, statutory compliance guides, glossary, downloadable templates, Academy learning, and 2026 FM market intelligence.',
    h1: 'Resources for People Responsible for Buildings',
    eyebrow: 'Knowledge & Tools Ecosystem',
    heroIntro: 'Practical engineering tools, statutory compliance guidance, plain-English terminology, and operational templates designed for facilities managers, property directors, and estate teams.',
    heroDescription: 'From asset-led PPM schedule builders to compliance calendars and downloadable document templates, explore resources engineered for commercial estate decision-makers.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Historic commercial search intent for facilities management resources and guides',
    primaryIntent: 'facilities management resources',
    secondaryIntents: ['FM guides', 'building compliance resources', 'facilities management tools', 'FM document templates'],
    pageType: 'company',
    historicTopics: ['FM resources overview', 'Statutory compliance', 'Interactive FM tools', 'Knowledge hub'],
    requiredSections: ['hero', 'tools-grid', 'compliance-pathway', 'knowledge-grid', 'articles-grid', 'cta'],
    sections: [
      {
        heading: 'An Authoritative FM Resource Centre Without the Paywall',
        body: 'EntireFM provides free access to structured scheduling logic, legal duty baselines, downloadable spreadsheets, and market intelligence for commercial building custodians across the UK.'
      }
    ],
    capabilities: [
      {
        name: 'Interactive FM Planning Toolkit',
        description: 'Asset-led schedule builders, 12-month compliance calendars, PPM cost estimators, and tender brief generators.',
        tag: 'Interactive Tools'
      },
      {
        name: 'Statutory Compliance Authority',
        description: 'Clear guidance separating legal statutory requirements, British Standards, Approved Codes of Practice, and risk intervals.',
        tag: 'Compliance Centre'
      },
      {
        name: 'Operational Learning & Downloads',
        description: 'Plain-English FM Glossary, Academy training modules, and ungated downloadable CSV templates and logbooks.',
        tag: 'Learning & Templates'
      }
    ],
    faqs: [
      {
        question: 'Are all resources and tools in this hub free to use?',
        answer: 'Yes. All interactive calculators, PPM schedule builders, glossary definitions, Academy modules, and document vault downloads are 100% free and ungated.'
      },
      {
        question: 'What technical standards underpin EntireFM guidance?',
        answer: 'Our resources reference current UK statutory legislation (RRO 2005, Electricity at Work Regs 1989, COSHH, LOLER) and technical standards including BS 7671, BS 5266, BS 5839, and HSE Approved Codes of Practice such as ACOP L8.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' }
    ],
    relatedRoutes: [
      '/tools',
      '/compliance',
      '/facilities-management-glossary',
      '/fm-intelligence',
      '/academy',
      '/resources/document-vault',
      '/building-walk'
    ],
    conversionGoal: 'Establish authoritative brand trust and provide genuine ongoing utility to FM decision-makers.',
    verificationRequirements: [
      'Zero fake download numbers or fictional metrics',
      'All compliance links point to live registered 200 routes'
    ],
    contentStatus: 'COMPLETE'
  },
  '/tools': {
    path: '/tools',
    title: 'FM Tools & Calculators | Facilities Management Planning | Entire FM',
    metaDescription: 'Free practical tools for maintenance planning, statutory compliance schedules, cost estimation, TCO analysis and FM tender generation.',
    h1: 'Practical Facilities Management Tools & Calculators',
    eyebrow: 'Interactive FM Planning Toolkit',
    heroIntro: 'Practical tools engineered for property managers, estates directors and facilities teams to plan maintenance, verify compliance obligations and structure commercial procurement.',
    heroDescription: 'From asset-led PPM schedule generation to compliance calendar builders and tender brief creators, every tool uses verified UK technical standards and transparent calculation models.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Historic commercial search intent for facilities management tools and calculators',
    primaryIntent: 'facilities management tools',
    secondaryIntents: ['FM calculators UK', 'PPM schedule builder', 'FM building health check', 'FM tender brief generator'],
    pageType: 'company',
    historicTopics: ['FM tools overview', 'PPM calculation', 'Compliance scheduling', 'Tender generation'],
    requiredSections: ['hero', 'tools-grid', 'methodology', 'faq', 'cta'],
    sections: [
      {
        heading: 'Asset-Led Tools Without the Sales Wall',
        body: 'Every tool in the EntireFM suite provides transparent, immediate value without forcing an enquiry simply to view your output. Export your schedules to CSV, download formatted tender briefs, and build statutory maintenance calendars aligned with current UK legislation and Approved Codes of Practice.'
      }
    ],
    capabilities: [
      {
        name: 'Maintenance Planning Suite',
        description: 'Asset-led schedule builders and cost estimation frameworks designed around actual installed equipment rather than generic rules of thumb.',
        tag: 'Maintenance Planning'
      },
      {
        name: 'Compliance & Statutory Schedulers',
        description: 'Interactive diagnostics and annual calendars separating legal requirements, Approved Codes, British Standards and risk-based frequencies.',
        tag: 'Statutory Compliance'
      },
      {
        name: 'Commercial & Procurement Tools',
        description: 'Total cost of ownership models, reactive vs planned comparisons, and structured RFP tender brief generators.',
        tag: 'Procurement & Strategy'
      }
    ],
    faqs: [
      {
        question: 'Are the EntireFM planning tools free to use?',
        answer: 'Yes. All interactive tools provide full outputs including on-screen results, print views, CSV data and document downloads without requiring an account or sales consultation.'
      },
      {
        question: 'What technical standards underpin the PPM Schedule Builder and Compliance Calendar?',
        answer: 'Our tools reference UK statutory legislation (e.g. Regulatory Reform (Fire Safety) Order, Electricity at Work Regulations, COSHH, LOLER) and technical standards including BS 7671, BS 5266-1, and HSE Approved Codes of Practice such as ACOP L8.'
      },
      {
        question: 'Can I export tool outputs for internal stakeholder presentations?',
        answer: 'Yes. Every tool supports immediate export via formatted PDF print styles, CSV spreadsheets, ICS calendar imports, or copyable markdown.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' }
    ],
    relatedRoutes: [
      '/resources',
      '/tools/ppm-schedule-builder',
      '/tools/fm-health-check',
      '/tools/compliance-calendar',
      '/tools/ppm-estimator',
      '/tools/fm-roi-calculator',
      '/tools/tender-brief',
      '/compliance'
    ],
    conversionGoal: 'Engage commercial FM buyers with interactive tools and establish engineering authority.',
    verificationRequirements: [
      'Claims must match BUSINESS-CLAIMS-VERIFICATION.md',
      'No fictitious client metrics or unverified savings percentages',
      'Transparent calculation assumptions on all financial and scheduling models'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/fm-health-check': {
    path: '/tools/fm-health-check',
    title: 'FM Building Health Check | Facilities Compliance Diagnostic | Entire FM',
    metaDescription: 'Interactive diagnostic helping estates teams identify potential maintenance and compliance evidence gaps across HVAC, electrical, fire and water systems.',
    h1: 'FM Building Health Check & Compliance Diagnostic',
    eyebrow: 'Interactive Estate Review',
    heroIntro: 'Evaluate your estate against core UK statutory maintenance baselines, identify potential record-keeping gaps, and receive targeted operational recommendations.',
    heroDescription: 'A practical, 3-minute diagnostic covering electrical systems, fire safety, water hygiene, HVAC maintenance, gas safety, building fabric and supply chain governance.',
    heroImage: '/branding/EntireFM Branding 002.png',
    historicIntent: 'Historic search intent for building maintenance diagnostic and compliance audit check',
    primaryIntent: 'FM building health check',
    secondaryIntents: ['facilities management audit tool', 'compliance gap analysis', 'building maintenance checklist'],
    pageType: 'company',
    historicTopics: ['Building audit', 'Statutory compliance check', 'Maintenance gap analysis'],
    requiredSections: ['hero', 'diagnostic-tool', 'scoring-explanation', 'disclaimer', 'cta'],
    sections: [
      {
        heading: 'Identifying Evidence Gaps Before Enforcement Inspections',
        body: 'Compliance is demonstrated through contemporaneous records, competent assessment and timely remedial closeout. This diagnostic evaluates your current estate governance model to highlight areas where duty holders most commonly face documentation or operational exposure.'
      }
    ],
    faqs: [
      {
        question: 'Does this health check constitute legal compliance certification?',
        answer: 'No. This diagnostic provides an indicative operational review and highlights potential documentation gaps. Legal compliance can only be determined through physical site surveys and competent person inspections.'
      },
      {
        question: 'What happens after completing the diagnostic?',
        answer: 'You receive an instant breakdown across 7 core building areas with prioritised action points, relevant technical guidance links, and the option to export a structured summary report.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'Health Check', url: '/tools/fm-health-check' }
    ],
    relatedRoutes: [
      '/tools',
      '/tools/ppm-schedule-builder',
      '/tools/compliance-calendar',
      '/compliance',
      '/ppm'
    ],
    conversionGoal: 'Assist facilities managers in identifying maintenance risks and offer technical survey support.',
    verificationRequirements: [
      'Explicit disclaimer stating this is not legal advice or statutory certification',
      'No arbitrary percentage compliance scoring presented as legal fact'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/ppm-schedule-builder': {
    path: '/tools/ppm-schedule-builder',
    title: 'PPM Schedule Builder | Planned Maintenance Planner | Entire FM',
    metaDescription: 'Build an asset-led planned preventative maintenance schedule across HVAC, electrical, fire, water and fabric systems with clear statutory and standard basis.',
    h1: 'Asset-Led PPM Schedule Builder',
    eyebrow: 'Preventative Maintenance Planner',
    heroIntro: 'Select your installed building assets to generate a comprehensive, structured PPM task matrix with verified statutory and technical frequency classifications.',
    heroDescription: 'Distinguishes clearly between legal requirements (statute), recognised standards (BS/ACOP), common industry practice, and risk-based intervals across 8 asset categories.',
    heroImage: '/branding/EntireFM Branding 003.png',
    historicIntent: 'Historic search intent for PPM schedule generator and planned maintenance planner',
    primaryIntent: 'PPM schedule builder',
    secondaryIntents: ['planned preventative maintenance schedule', 'building maintenance matrix', 'SFG20 maintenance schedule planner'],
    pageType: 'company',
    historicTopics: ['PPM schedule generation', 'Asset maintenance matrix', 'Statutory intervals'],
    requiredSections: ['hero', 'asset-selector', 'matrix-output', 'export-actions', 'cta'],
    sections: [
      {
        heading: 'Why Technical Basis Matters in Maintenance Planning',
        body: 'Many generic maintenance templates label every annual task as statutory. EntireFM separates genuine legal mandates (such as LOLER 6-month passenger lift thorough examinations) from standard recommendations (such as BS 5266-1 emergency lighting discharge tests) and risk-based intervals, ensuring your budget is deployed effectively.'
      }
    ],
    faqs: [
      {
        question: 'How do you classify maintenance frequencies?',
        answer: 'We classify tasks into: LEGAL (statutory legislation), STANDARD (recognised British Standard or ACOP), PRACTICE (common industry frequency), and RISK (interval determined by site-specific risk assessment).'
      },
      {
        question: 'Can I export the generated PPM schedule?',
        answer: 'Yes. The complete matrix can be exported to CSV format for loading into your CAFM / Excel, or printed directly as a formatted maintenance specification.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'PPM Schedule Builder', url: '/tools/ppm-schedule-builder' }
    ],
    relatedRoutes: [
      '/tools',
      '/ppm',
      '/mechanical-electrical',
      '/compliance',
      '/tools/compliance-calendar'
    ],
    conversionGoal: 'Help estates teams configure asset-specific PPM scopes and request site asset surveys.',
    verificationRequirements: [
      'Strict adherence to Compliance Centre requirement levels (LEGAL, STANDARD, PRACTICE, RISK)',
      'No generic mislabelling of guidance as statutory statute'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/compliance-calendar': {
    path: '/tools/compliance-calendar',
    title: 'FM Compliance Calendar Builder | Statutory Testing Schedule | Entire FM',
    metaDescription: 'Generate an interactive annual compliance and statutory testing calendar for your building with ICS calendar export and legal duty breakdowns.',
    h1: 'FM Statutory Compliance Calendar Builder',
    eyebrow: 'Annual Inspection & Testing Planner',
    heroIntro: 'Build a customised 12-month calendar of statutory inspections, periodic testing and risk assessment review milestones tailored to your building systems.',
    heroDescription: 'Includes fire safety, fixed wire testing, emergency lighting, water hygiene, commercial gas, LOLER lift examinations, and pressure systems with exportable calendar reminders.',
    heroImage: '/branding/EntireFM Branding 004.png',
    historicIntent: 'Historic search intent for FM compliance calendar and statutory maintenance schedule',
    primaryIntent: 'FM compliance calendar',
    secondaryIntents: ['statutory compliance calendar', 'building compliance checklist calendar', 'FM testing schedule'],
    pageType: 'company',
    historicTopics: ['Compliance calendar', 'Statutory inspection schedule', 'Annual FM planner'],
    requiredSections: ['hero', 'systems-selector', 'calendar-grid', 'ics-export', 'cta'],
    sections: [
      {
        heading: 'Never Miss a Statutory Review or Inspection Date',
        body: 'Duty holders are legally required to maintain building safety records and timely inspection cycles. Our calendar builder maps out monthly checks, quarterly inspections, annual certificates, and multi-year periodic test deadlines in a single, cohesive timeline.'
      }
    ],
    faqs: [
      {
        question: 'Can I import this calendar into Outlook or Google Calendar?',
        answer: 'Yes. The tool generates standard .ICS calendar files compatible with Microsoft Outlook, Google Calendar, Apple Calendar, and enterprise CAFM suites.'
      },
      {
        question: 'Does the calendar explain why each test is required?',
        answer: 'Each calendar item cites the governing UK legislation, British Standard, or Approved Code of Practice along with the responsible duty holder.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'Compliance Calendar', url: '/tools/compliance-calendar' }
    ],
    relatedRoutes: [
      '/tools',
      '/compliance',
      '/tools/ppm-schedule-builder',
      '/compliance/fire-risk-assessment',
      '/compliance/fixed-wire-testing-eicr'
    ],
    conversionGoal: 'Assist estates teams in scheduling annual statutory compliance workflows.',
    verificationRequirements: [
      'All inspection frequencies cross-referenced with COMPLIANCE_TOPICS',
      'Reliable ICS file generation for export'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/ppm-estimator': {
    path: '/tools/ppm-estimator',
    title: 'PPM Cost Estimator | Maintenance Budget Calculator | Entire FM',
    metaDescription: 'Calculate an indicative planned maintenance budget range based on estate square footage, building type, sector complexity and service scope.',
    h1: 'PPM Cost Estimator & Maintenance Budget Calculator',
    eyebrow: 'Indicative Planning Tool',
    heroIntro: 'Model an indicative annual planned maintenance cost range for your commercial property based on gross internal area, sector profile, and service intensity.',
    heroDescription: 'Provides transparent budget benchmarks for M&E maintenance, statutory compliance servicing, fabric care, and HVAC management with visible planning assumptions.',
    heroImage: '/branding/EntireFM Branding 005.png',
    historicIntent: 'Historic search intent for PPM cost calculator and maintenance budget estimator',
    primaryIntent: 'PPM cost estimator',
    secondaryIntents: ['facilities management cost calculator', 'maintenance cost per sq ft UK', 'commercial PPM pricing estimator'],
    pageType: 'company',
    historicTopics: ['PPM cost calculation', 'Maintenance budget range', 'Commercial FM pricing model'],
    requiredSections: ['hero', 'calculator-inputs', 'budget-breakdown', 'assumptions-panel', 'cta'],
    sections: [
      {
        heading: 'Transparent Commercial Benchmarking Without Artificial Promises',
        body: 'Maintenance costs vary with plant age, operating hours, and asset density. This estimator uses realistic UK industry planning ranges to assist commercial budgeting, while making all baseline assumptions explicit.'
      }
    ],
    faqs: [
      {
        question: 'Are these figures binding contract quotations?',
        answer: 'No. The output is an indicative planning range based on standard commercial estate benchmarks. Formal proposals require a site asset survey to evaluate installed equipment condition and operational hours.'
      },
      {
        question: 'How do you calculate the cost per square metre / square foot?',
        answer: 'Our model factors in building sector weighting, baseline engineering maintenance hours, specialist compliance subcontractor allowances, and statutory testing intervals.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'PPM Cost Estimator', url: '/tools/ppm-estimator' }
    ],
    relatedRoutes: [
      '/tools',
      '/ppm',
      '/tools/fm-roi-calculator',
      '/tools/tender-brief',
      '/mechanical-electrical'
    ],
    conversionGoal: 'Assist prospective clients in establishing realistic maintenance budget expectations.',
    verificationRequirements: [
      'Explicitly labelled as "Indicative Planning Range"',
      'No claims of guaranteed percentage savings without evidence'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/fm-roi-calculator': {
    path: '/tools/fm-roi-calculator',
    title: 'FM ROI & TCO Calculator | Maintenance Cost Comparison | Entire FM',
    metaDescription: 'Compare your current reactive FM model with planned, consolidated facilities management to analyse total cost of ownership and avoidable callout spend.',
    h1: 'FM Total Cost of Ownership & ROI Calculator',
    eyebrow: 'Commercial Model Comparison',
    heroIntro: 'Compare your current facilities spend across multiple suppliers with a structured, planned preventative maintenance approach.',
    heroDescription: 'Analyse the total cost of ownership (TCO) across emergency reactive premiums, internal administration overhead, asset downtime, and planned maintenance investment.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Historic search intent for FM ROI calculator and maintenance savings comparison',
    primaryIntent: 'FM ROI calculator',
    secondaryIntents: ['facilities management TCO calculator', 'reactive vs planned maintenance ROI', 'FM consolidation model'],
    pageType: 'company',
    historicTopics: ['FM ROI model', 'TCO calculation', 'Reactive vs planned costs'],
    requiredSections: ['hero', 'cost-model-inputs', 'comparison-visualiser', 'assumptions-explained', 'cta'],
    sections: [
      {
        heading: 'Understanding Total Cost of Ownership in Estate Management',
        body: 'The direct price on a maintenance invoice is only one element of FM expenditure. Reactive callout surcharges, multiple supplier administration, and uncoordinated plant failures create hidden commercial drag that planned delivery directly mitigates.'
      }
    ],
    faqs: [
      {
        question: 'How does the calculator determine reactive versus planned cost balance?',
        answer: 'The model uses standard UK industry ratios reflecting how unmaintained assets generate higher emergency callout frequency, out-of-hours labour premiums, and shortened asset lifespans.'
      },
      {
        question: 'Can I customise the management overhead assumptions?',
        answer: 'Yes. You can adjust internal invoice processing costs, supplier coordination hours, and reactive failure rates to match your organisation’s actual operational experience.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'ROI Calculator', url: '/tools/fm-roi-calculator' }
    ],
    relatedRoutes: [
      '/tools',
      '/tools/ppm-estimator',
      '/tools/tender-brief',
      '/hard-services',
      '/ppm'
    ],
    conversionGoal: 'Demonstrate commercial value of planned facilities consolidation.',
    verificationRequirements: [
      'All calculation logic exposed and user-tunable',
      'No manufactured savings claims that cannot be mathematically audited'
    ],
    contentStatus: 'COMPLETE'
  },

  '/tools/tender-brief': {
    path: '/tools/tender-brief',
    title: 'FM Tender Brief Generator | Facilities RFP Specification Tool | Entire FM',
    metaDescription: 'Generate a comprehensive, structured FM tender brief and RFP specification tailored to your estate size, service lines, compliance needs and SLA expectations.',
    h1: 'FM Tender Brief & RFP Specification Generator',
    eyebrow: 'Procurement Specification Tool',
    heroIntro: 'Create a professional, structured Facilities Management tender brief covering scope of services, compliance requirements, CAFM reporting, and SLA standards.',
    heroDescription: 'Designed for procurement teams, property directors, and managing agents to articulate estate requirements cleanly and obtain competitive, like-for-like market proposals.',
    heroImage: '/branding/EntireFM Branding 002.png',
    historicIntent: 'Historic search intent for FM tender brief generator and facilities management RFP template',
    primaryIntent: 'FM tender brief generator',
    secondaryIntents: ['facilities management RFP builder', 'FM procurement specification tool', 'FM tender template generator'],
    pageType: 'company',
    historicTopics: ['Tender brief generator', 'FM RFP specification', 'Procurement framework'],
    requiredSections: ['hero', 'step-form', 'specification-preview', 'download-options', 'cta'],
    sections: [
      {
        heading: 'Clean Tender Specifications Yield Better Contract Outcomes',
        body: 'Ambiguous tender documents lead to supplier variations, mismatched expectations, and protracted mobilisation. This generator builds a structured RFP covering hard FM, soft services, statutory compliance, CAFM integration, and key performance indicators.'
      }
    ],
    faqs: [
      {
        question: 'Does this tender brief force me to choose EntireFM?',
        answer: 'No. The generated brief is an open, provider-neutral RFP document that you can issue to any prospective facilities management contractor or market framework.'
      },
      {
        question: 'What format is the generated tender specification?',
        answer: 'You can copy the markdown text directly, print to formatted PDF, or download a structured document ready for insertion into your procurement pack.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'Tender Brief Generator', url: '/tools/tender-brief' }
    ],
    relatedRoutes: [
      '/tools',
      '/tools/ppm-schedule-builder',
      '/tools/ppm-estimator',
      '/about-entire-facilities-management',
      '/contact-us'
    ],
    conversionGoal: 'Empower procurement professionals while positioning EntireFM as an authority on FM contract structuring.',
    verificationRequirements: [
      'Document generator must produce clean, neutral RFP specifications',
      'Downloadable and copyable without requiring sales contact'
    ],
    contentStatus: 'COMPLETE'
  },

  '/fm-intelligence': {
    path: '/fm-intelligence',
    title: 'FM Intelligence & Market Analysis 2026 | Industry Benchmarks | Entire FM',
    metaDescription: 'Curated 2026 UK facilities management market intelligence, statutory regulation updates, labour trends, energy benchmarks and operational insights.',
    h1: 'UK Facilities Management Intelligence & Market Trends 2026',
    eyebrow: 'Market Analysis & Industry Benchmarks',
    heroIntro: 'Verified commercial intelligence, regulatory updates, engineering wage trends, and operational benchmark data for UK property and estate leaders.',
    heroDescription: 'Curated and published quarterly with verified methodology, transparent sourcing, and rigorous distinction between statutory mandates and commercial trends.',
    heroImage: '/branding/EntireFM Branding 003.png',
    historicIntent: 'Historic search intent for FM market report and facilities management industry intelligence',
    primaryIntent: 'FM intelligence',
    secondaryIntents: ['UK FM market report 2026', 'facilities management industry benchmarks', 'FM market trends and data'],
    pageType: 'post',
    historicTopics: ['FM market report', 'Industry intelligence', 'Operational benchmarks'],
    requiredSections: ['hero', 'market-indicators', 'regulatory-briefing', 'operational-trends', 'citations', 'cta'],
    sections: [
      {
        heading: 'Current UK Facilities Management Landscape — 2026 Outlook',
        body: 'The UK commercial property sector faces evolving statutory demands around building safety, energy decarbonisation, and engineering labour availability. This briefing brings together verified regulatory changes and market data to assist strategic property decisions.'
      },
      {
        heading: 'Regulatory Landscape & Statutory Shifts',
        body: 'Building Safety Act 2022 implementation milestones, mandatory digital record-keeping requirements, and updated BS 7671 Amendment guidance continue to reshape hard engineering obligations across multi-occupied and commercial estates.'
      }
    ],
    faqs: [
      {
        question: 'How often is the FM Intelligence briefing updated?',
        answer: 'Data and regulatory analysis are reviewed and updated quarterly. All metrics cite their source, publication date, and measurement period.'
      },
      {
        question: 'Where does the benchmark data originate?',
        answer: 'We compile data from public statutory bodies (HSE, GOV.UK, Building Safety Regulator), recognised technical institutions (BSI, IET, CIBSE), and verified industry economic reporting.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Intelligence', url: '/fm-intelligence' }
    ],
    relatedRoutes: [
      '/resources',
      '/compliance',
      '/facilities-management-glossary',
      '/tools',
      '/blog'
    ],
    conversionGoal: 'Position EntireFM as a knowledgeable, data-grounded engineering leader.',
    verificationRequirements: [
      'All statistics must cite publication source, date, and scope',
      'No stale 2024/2025 data presented as current 2026 metrics',
      'Zero fabricated survey percentages'
    ],
    contentStatus: 'COMPLETE'
  },

  '/academy': {
    path: '/academy',
    title: 'EntireFM Academy | Professional Facilities Management Learning | Entire FM',
    metaDescription: 'Practical facilities management learning modules, technical engineering fundamentals, statutory compliance training and operational best practice.',
    h1: 'EntireFM Academy — Practical Facilities Learning',
    eyebrow: 'Knowledge & Professional Training',
    heroIntro: 'Free operational learning modules covering statutory maintenance compliance, building services engineering fundamentals, and estate contract management.',
    heroDescription: 'Structured for property managers, junior facilities coordinators, and duty holders wanting plain-English technical grounding without academic fluff.',
    heroImage: '/branding/EntireFM Branding 004.png',
    historicIntent: 'Historic search intent for FM academy and facilities management training courses',
    primaryIntent: 'FM academy',
    secondaryIntents: ['facilities management learning modules', 'building services engineering training', 'statutory compliance training FM'],
    pageType: 'company',
    historicTopics: ['FM academy', 'Operational training', 'Compliance modules'],
    requiredSections: ['hero', 'curriculum-grid', 'learning-modules', 'learning-paths', 'cta'],
    sections: [
      {
        heading: 'Engineering Grounding for Property Decision Makers',
        body: 'Understanding how building services operate, why statutory maintenance exists, and how to read an engineering certificate is essential for managing property risk. EntireFM Academy distills field engineering expertise into accessible, actionable learning paths.'
      }
    ],
    faqs: [
      {
        question: 'Are EntireFM Academy modules free of charge?',
        answer: 'Yes. All learning modules, technical guides, and self-assessment knowledge checks are open-access resources.'
      },
      {
        question: 'Do these courses provide formal accredited certifications?',
        answer: 'No. EntireFM Academy provides practical operational knowledge and technical education. It does not issue accredited qualifications or NVQ certificates.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Academy', url: '/academy' }
    ],
    relatedRoutes: [
      '/resources',
      '/compliance',
      '/facilities-management-glossary',
      '/building-walk',
      '/tools'
    ],
    conversionGoal: 'Educate prospective clients and build lasting topical trust.',
    verificationRequirements: [
      'No false claims of external accreditation or university affiliation',
      'Honest description of practical learning content'
    ],
    contentStatus: 'COMPLETE'
  },

  '/resources/document-vault': {
    path: '/resources/document-vault',
    title: 'FM Document Vault | Downloadable Templates & Checklists | Entire FM',
    metaDescription: 'Free downloadable facilities management templates, asset registers, compliance logbooks, PPM matrix spreadsheets and contractor evaluation forms.',
    h1: 'FM Document Vault — Operational Templates & Tools',
    eyebrow: 'Downloadable Estate Resources',
    heroIntro: 'Practical, verified FM templates, asset registers, compliance audit checklists, and logbook sheets designed for immediate operational use.',
    heroDescription: 'Every document in the vault is a real, functional template available in CSV, spreadsheet or printable formats — with zero fake download counters or gated forms.',
    heroImage: '/branding/EntireFM Branding 005.png',
    historicIntent: 'Historic search intent for FM document vault and facilities management templates download',
    primaryIntent: 'FM document vault',
    secondaryIntents: ['facilities management templates download', 'PPM template CSV', 'asset register template UK', 'compliance audit checklist FM'],
    pageType: 'company',
    historicTopics: ['Document vault', 'FM templates', 'Downloadable checklists'],
    requiredSections: ['hero', 'vault-categories', 'downloads-grid', 'usage-guide', 'cta'],
    sections: [
      {
        heading: 'Operational Resources Built for Real Building Managers',
        body: 'Building management requires structured records. We provide clean, editable spreadsheets and structured checklists covering asset registers, statutory logbooks, contractor induction packs, and maintenance audit trackers.'
      }
    ],
    faqs: [
      {
        question: 'Are the documents free to download and use?',
        answer: 'Yes. All templates are freely downloadable for operational use across your estates.'
      },
      {
        question: 'What file formats are provided in the Document Vault?',
        answer: 'Templates are supplied in CSV, Excel-compatible formats, and formatted print-ready printable views.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Document Vault', url: '/resources/document-vault' }
    ],
    relatedRoutes: [
      '/resources',
      '/tools',
      '/tools/ppm-schedule-builder',
      '/compliance',
      '/ppm'
    ],
    conversionGoal: 'Provide high-utility tools that save estate managers time and earn long-term trust.',
    verificationRequirements: [
      'Every listed document must genuinely be downloadable and functional',
      'No fictitious download counts or fake rating stars'
    ],
    contentStatus: 'COMPLETE'
  },

  '/building-walk': {
    path: '/building-walk',
    title: 'The Building Walk | Visual Site & Plantroom Inspection Series | Entire FM',
    metaDescription: 'Explore real-world commercial estate inspection walkthroughs, plantroom surveys, common maintenance defects, and practical engineering solutions.',
    h1: 'The Building Walk — Engineering & Site Inspection Series',
    eyebrow: 'Practical Plantroom & Estate Walkthroughs',
    heroIntro: 'Step-by-step technical walkthroughs of commercial offices, industrial estates, retail parks, and plantrooms — highlighting common defects, statutory risks, and engineering solutions.',
    heroDescription: 'From distribution boards and chiller decks to boiler houses and emergency lighting routes, The Building Walk takes you on site with certified facilities engineers.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Historic search intent for building walk site survey and facilities walkthrough',
    primaryIntent: 'The Building Walk',
    secondaryIntents: ['building inspection walkthrough', 'plantroom audit guide', 'commercial FM site survey series'],
    pageType: 'post',
    historicTopics: ['Building walkthrough', 'Plantroom survey', 'Defect identification'],
    requiredSections: ['hero', 'walkthrough-episodes', 'inspection-framework', 'expert-tips', 'cta'],
    sections: [
      {
        heading: 'What Engineers Look For When Surveying a Commercial Building',
        body: 'Walking a building with an experienced engineer reveals subtle warning signs before they become catastrophic failures. This series breaks down plantroom inspections, switchgear health, HVAC airflow observations, and roof-level asset surveys.'
      }
    ],
    faqs: [
      {
        question: 'What types of estates are featured in The Building Walk?',
        answer: 'The series covers multi-tenant commercial offices, manufacturing plants, logistics distribution centres, and mixed-use commercial developments.'
      },
      {
        question: 'Can EntireFM perform a bespoke Building Walk on my estate?',
        answer: 'Yes. Our senior engineering team provides comprehensive initial asset surveys and condition appraisals for commercial property managers across the UK.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'The Building Walk', url: '/building-walk' }
    ],
    relatedRoutes: [
      '/resources',
      '/case-studies',
      '/tools/fm-health-check',
      '/mechanical-electrical',
      '/hvac-contractor'
    ],
    conversionGoal: 'Demonstrate deep engineering competence through practical site walkthroughs.',
    verificationRequirements: [
      'All case studies and walkthroughs must reflect real engineering practices',
      'No placeholder videos presented as finished production material'
    ],
    contentStatus: 'COMPLETE'
  },
  '/fm-briefing': {
    path: '/fm-briefing',
    title: 'The FM Briefing | Practical Facilities Management Intelligence | EntireFM',
    metaDescription: 'Get The FM Briefing: a concise weekly facilities management publication covering maintenance, compliance, engineering, and building technology.',
    h1: 'THE FM BRIEFING — Practical Intelligence for People Responsible for Buildings',
    eyebrow: 'Recurring FM Publication',
    heroIntro: 'A concise weekly editorial briefing on maintenance, statutory compliance, engineering, AI & technology, and property operations. No marketing noise.',
    heroDescription: 'Delivered every Tuesday: the week that matters in UK facilities management, practical compliance guidance, and useful operational tools.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'FM briefing newsletter subscription intent',
    primaryIntent: 'the fm briefing newsletter',
    secondaryIntents: ['facilities management newsletter', 'FM industry briefing UK', 'building maintenance intelligence'],
    pageType: 'company',
    historicTopics: ['FM newsletter', 'The FM Briefing', 'Industry updates'],
    requiredSections: ['hero', 'pillars', 'preview', 'cta'],
    sections: [
      {
        heading: 'Facilities-Management Intelligence Without the Noise',
        body: 'The FM Briefing is engineered for estate directors, facilities managers, property operations heads, and building engineers who need actionable signal, not vendor noise.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'The FM Briefing', url: '/fm-briefing' }
    ],
    relatedRoutes: ['/blog', '/resources', '/compliance', '/tools'],
    conversionGoal: 'Grow opted-in readership of property decision-makers.',
    verificationRequirements: ['Opt-in consent must be recorded distinctly from contact enquiries'],
    contentStatus: 'COMPLETE'
  },
  '/fm-briefing/unsubscribe': {
    path: '/fm-briefing/unsubscribe',
    title: 'Unsubscribe | The FM Briefing | EntireFM',
    metaDescription: 'Manage your subscription preferences or unsubscribe from The FM Briefing.',
    h1: 'Unsubscribe & Preference Centre',
    eyebrow: 'Subscription Preferences',
    heroIntro: 'Manage your email preferences or opt out of recurring editorial communications.',
    pageType: 'company',
    historicIntent: 'FM briefing newsletter unsubscribe and preference management',
    primaryIntent: 'unsubscribe from fm briefing',
    secondaryIntents: ['manage email preferences', 'opt out FM newsletter', 'fm briefing subscription settings'],
    historicTopics: ['newsletter unsubscribe', 'email preferences', 'subscription management'],
    requiredSections: ['unsubscribe-form'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'The FM Briefing', url: '/fm-briefing' },
      { name: 'Unsubscribe', url: '/fm-briefing/unsubscribe' }
    ],
    relatedRoutes: ['/fm-briefing', '/privacy-policy'],
    conversionGoal: 'Provide compliant, one-click unsubscribe mechanism.',
    verificationRequirements: ['Immediate suppression list update upon token submission'],
    contentStatus: 'COMPLETE'
  }
};
