/**
 * RESOURCES & TOOLS CONTENT RECORDS
 * =================================
 * Single source of truth for metadata and content specs across the restored
 * and upgraded EntireFM interactive tools, resource hubs, Academy, Document Vault,
 * FM Intelligence and Building Walk.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const RESOURCES_CONTENT: Record<string, ContentRecord> = {
  '/case-studies': {
    path: '/case-studies',
    title: 'Facilities Management Case Studies & Project Proof | EntireFM',
    metaDescription: 'Explore verified commercial facilities management case studies and engineering project reviews from EntireFM across UK commercial property and industrial estates.',
    h1: 'Real Estates. Real Engineering Challenges. Real FM Delivery.',
    eyebrow: 'Proven Operational Delivery',
    heroIntro: 'Explore how EntireFM solves complex commercial maintenance, statutory compliance, and building engineering challenges across UK commercial, retail, and industrial estates.',
    heroDescription: 'Verifiable project reviews detailing asset surveys, PPM restructuring, mechanical remedials, and statutory compliance management.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    historicIntent: 'Commercial FM case studies and project proof search intent',
    primaryIntent: 'facilities management case studies',
    secondaryIntents: ['fm project reviews', 'commercial maintenance proof', 'm&e case studies uk'],
    pageType: 'company',
    historicTopics: ['Case studies', 'Project proof', 'PPM delivery', 'Commercial HVAC overhaul', 'Compliance audits'],
    requiredSections: ['hero', 'case-studies-grid', 'trust-bar', 'cta'],
    sections: [
      {
        heading: 'Documented Engineering & FM Outcomes',
        body: 'Every case study reflects physical engineering works, baseline asset audits, and structured maintenance schedules delivered across commercial, logistics, and retail estates.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Case Studies', url: '/case-studies' }
    ],
    relatedRoutes: ['/services', '/ppm', '/mechanical-electrical', '/compliance'],
    conversionGoal: 'Demonstrate tangible operational proof to commercial buyers, managing agents, and procurement teams.',
    verificationRequirements: [
      'Anonymised operational facts verified against real engineering scopes',
      'Zero synthetic savings percentages or unverified client claims'
    ],
    contentStatus: 'COMPLETE'
  },
  '/media': {
    path: '/media',
    title: 'Media Centre & Press Enquiries | EntireFM',
    metaDescription: 'Official media centre for EntireFM: press enquiries, verified company facts, brand assets, and expert commentary on UK facilities management.',
    h1: 'EntireFM Press & Media Centre',
    eyebrow: 'News & Media Resources',
    heroIntro: 'Official company facts, media contact pathways, approved brand assets, and practical facilities management commentary for journalists and editors.',
    heroDescription: 'Access verified company background, interview requests with EntireFM technical leadership, and citations from our research library.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    historicIntent: 'Media and press enquiries search intent',
    primaryIntent: 'facilities management media centre',
    secondaryIntents: ['entirefm press office', 'fm media enquiries', 'facilities management press kit'],
    pageType: 'company',
    historicTopics: ['Media centre', 'Press office', 'Company facts', 'Brand assets'],
    requiredSections: ['hero', 'contact', 'company-facts', 'linkable-assets', 'cta'],
    sections: [
      {
        heading: 'Official Press & Media Enquiries',
        body: 'EntireFM provides fast-turnaround technical commentary, data citations, and expert perspectives across commercial maintenance, statutory compliance, energy, and AI in building operations.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Media Centre', url: '/media' }
    ],
    relatedRoutes: ['/about-entire-facilities-management', '/resources', '/resources/guides', '/contact'],
    conversionGoal: 'Provide clear, credible media contact and fact sheet for UK property and trade journalists.',
    verificationRequirements: [
      'Verified media@entirefm.com contact routing',
      'Fact sheet verified against registered company profile'
    ],
    contentStatus: 'COMPLETE'
  },
  '/resources/guides': {
    path: '/resources/guides',
    title: 'Practical Facilities Management Guides & Knowledge Library | EntireFM',
    metaDescription: 'Authoritative, practical FM guides covering Hard vs Soft FM, planned maintenance, asset registers, commercial tendering, and statutory compliance.',
    h1: 'Practical Facilities Management Guides',
    eyebrow: 'Knowledge & Guidance Library',
    heroIntro: 'Detailed, practical guidance engineered for people responsible for commercial buildings, statutory maintenance, asset compliance, procurement, and FM strategy.',
    heroDescription: 'From asset registers to tender procurement and planned maintenance frameworks, explore evergreen resources written by practicing FM engineers.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    historicIntent: 'Educational search intent for facilities management guides and best practices',
    primaryIntent: 'facilities management guides',
    secondaryIntents: ['FM guides UK', 'commercial maintenance guide', 'facilities management best practices'],
    pageType: 'company',
    historicTopics: ['FM guides', 'PPM guide', 'Asset register guide', 'FM tender guide'],
    requiredSections: ['hero', 'featured-guide', 'guides-grid', 'cta'],
    sections: [
      {
        heading: 'Authoritative FM Knowledge Engineered for Practice',
        body: 'Our guides provide deep technical clarity across commercial maintenance, statutory obligations, estate asset registers, and procurement without fluff or generic SaaS marketing.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Guides', url: '/resources/guides' }
    ],
    relatedRoutes: ['/resources', '/tools', '/compliance', '/ppm'],
    conversionGoal: 'Provide high-authority educational gateway and structured routing into specific FM guides and tools.',
    verificationRequirements: [
      'Zero broken outbound internal links',
      'Accurate summary cards for all flagship guides'
    ],
    contentStatus: 'COMPLETE'
  },
  '/resources/guides/facilities-management-guide': {
    path: '/resources/guides/facilities-management-guide',
    title: 'The Complete Guide to Facilities Management (2026) | EntireFM',
    metaDescription: 'The definitive guide to UK facilities management: Hard FM engineering, Soft FM services, Total FM delivery, statutory compliance, and CAFM operations.',
    h1: 'The Complete Guide to Facilities Management',
    eyebrow: 'FM Fundamentals & Strategy',
    heroIntro: 'An exhaustive, practical guide to commercial facilities management in the UK: Hard vs Soft FM, delivery models, statutory compliance baselines, and CAFM architecture.',
    heroDescription: 'Explore the full spectrum of modern facilities management, from building engineering and plant maintenance to contractor governance and service SLAs.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    historicIntent: 'Broad educational intent for what is facilities management and how FM works',
    primaryIntent: 'facilities management guide',
    secondaryIntents: ['what is facilities management', 'hard vs soft fm', 'total facilities management guide', 'commercial fm overview'],
    pageType: 'company',
    historicTopics: ['Facilities management fundamentals', 'Hard FM', 'Soft FM', 'Service delivery models', 'Statutory compliance'],
    requiredSections: ['hero', 'intro', 'hard-soft-fm', 'delivery-models', 'compliance', 'cafm', 'cta'],
    sections: [
      {
        heading: '1. What is Facilities Management?',
        body: 'Facilities management (FM) is the multidisciplinary practice of ensuring the built environment functions efficiently, safely, and sustainably. It integrates people, place, process, and technology across commercial real estate, industrial sites, and institutional estates.'
      },
      {
        heading: '2. Hard FM vs Soft FM vs Integrated Total FM',
        body: 'Hard FM encompasses the physical infrastructure, mechanical and electrical engineering plant, fabric maintenance, and statutory life-safety systems. Soft FM covers occupational and workplace services such as contract cleaning, security guarding, grounds maintenance, and waste management. Integrated or Total FM consolidates all disciplines under a single accountable provider.'
      },
      {
        heading: '3. Statutory Compliance & Asset Governance',
        body: 'Commercial duty holders must comply with non-negotiable statutory duties including the Regulatory Reform (Fire Safety) Order 2005, Electricity at Work Regulations 1989, and ACOP L8 Legionella controls. Structured FM ensures every inspection is executed on cycle with verified digital certification.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Guides', url: '/resources/guides' },
      { name: 'Facilities Management Guide', url: '/resources/guides/facilities-management-guide' }
    ],
    relatedRoutes: ['/services', '/hard-services', '/soft-services', '/ppm', '/compliance'],
    conversionGoal: 'Establish broad top-of-funnel FM educational authority with contextual links to Hard/Soft FM services.',
    verificationRequirements: [
      'Grounded in IWFM and ISO 41001 principles',
      'Zero unsupported commercial claims'
    ],
    contentStatus: 'COMPLETE'
  },
  '/resources/guides/ppm-guide': {
    path: '/resources/guides/ppm-guide',
    title: 'The Complete Guide to Planned Preventative Maintenance (PPM) | EntireFM',
    metaDescription: 'How to structure an asset-led planned preventative maintenance (PPM) programme, balance legal vs manufacturer tasks, and eliminate reactive plant failure.',
    h1: 'The Complete Guide to Planned Preventative Maintenance (PPM)',
    eyebrow: 'Maintenance Strategy & Execution',
    heroIntro: 'A comprehensive engineering guide to planned preventative maintenance (PPM): asset registers, statutory intervals, SFG20 task schedules, and remedial workflows.',
    heroDescription: 'Learn how to transition from reactive firefighting to a structured, asset-led maintenance strategy that protects asset life, ensures compliance, and lowers lifecycle costs.',
    heroImage: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    historicIntent: 'Educational search intent for planned preventative maintenance guide and PPM planning',
    primaryIntent: 'planned preventative maintenance guide',
    secondaryIntents: ['ppm guide', 'ppm maintenance schedules', 'planned maintenance best practices', 'ppm vs reactive maintenance'],
    pageType: 'company',
    historicTopics: ['PPM fundamentals', 'Statutory vs standard maintenance', 'Asset registers', 'Scheduling', 'Remedial workflows'],
    requiredSections: ['hero', 'intro', 'statutory-vs-manufacturer', 'schedule-design', 'evidence-remedials', 'cta'],
    sections: [
      {
        heading: '1. What is Planned Preventative Maintenance (PPM)?',
        body: 'Planned Preventative Maintenance (PPM) is the scheduled, proactive servicing of building assets, mechanical plant, and electrical distribution systems to prevent unexpected failure, preserve manufacturer warranties, and satisfy mandatory UK statutory testing duties.'
      },
      {
        heading: '2. Categorising Maintenance: Statutory vs Standard vs Discretionary',
        body: 'PPM tasks must be strictly prioritised. Statutory tasks (e.g. annual Gas Safety CP12, 5-yearly EICR, monthly emergency lighting discharge) are legally mandated. Standard tasks (quarterly AHU filter replacement, annual chiller refrigeration service) preserve operating efficiency. Discretionary tasks provide aesthetic upkeep.'
      },
      {
        heading: '3. Digital Evidence & Remedial Management',
        body: 'A PPM task is only complete when verified engineering evidence (such as refrigerant pressures, insulation resistance megger readings, and photos) is captured in the CAFM. Discovered defects must immediately spawn tracked remedial work orders with clear C1/C2 criticality classifications.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Guides', url: '/resources/guides' },
      { name: 'PPM Guide', url: '/resources/guides/ppm-guide' }
    ],
    relatedRoutes: ['/ppm', '/tools/ppm-schedule-builder', '/compliance', '/hvac-contractor'],
    conversionGoal: 'Drive qualified commercial engagement towards EntireFM PPM services and interactive schedule builder tool.',
    verificationRequirements: [
      'SFG20 & CIBSE Guide M referenced accurately',
      'Direct link to PPM Schedule Builder tool'
    ],
    contentStatus: 'COMPLETE'
  },
  '/resources/guides/asset-register-guide': {
    path: '/resources/guides/asset-register-guide',
    title: 'How to Build an FM Asset Register (ISO 55000 / Uniclass) | EntireFM',
    metaDescription: 'Step-by-step guidance on establishing an ISO 55000 / Uniclass 2015 asset hierarchy, field tagging, condition scoring, and CAFM data hygiene.',
    h1: 'How to Build a Facilities Management Asset Register',
    eyebrow: 'Engineering Data & Asset Governance',
    heroIntro: 'Step-by-step guidance on creating a structured, auditable commercial asset register: spatial hierarchy, Uniclass classification, criticality scoring, and field verification.',
    heroDescription: 'Understand how accurate asset data underpins successful maintenance planning, statutory compliance tracking, lifecycle budgeting, and AI-assisted CAFM operations.',
    heroImage: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    historicIntent: 'Educational search intent for building an asset register in facilities management',
    primaryIntent: 'how to build asset register',
    secondaryIntents: ['fm asset register guide', 'asset register template', 'uniclass asset tagging', 'cafm asset hierarchy'],
    pageType: 'company',
    historicTopics: ['Asset hierarchy', 'Uniclass classification', 'Condition scoring', 'Field surveys', 'CAFM import'],
    requiredSections: ['hero', 'intro', 'hierarchy', 'naming-standards', 'condition-criticality', 'cta'],
    sections: [
      {
        heading: '1. Why an Asset Register is the Foundation of FM',
        body: 'Without an accurate, granular asset register, facilities managers cannot price PPM contracts accurately, ensure statutory compliance coverage, or forecast capital lifecycle replacements. Maintenance schedules built without an asset baseline inevitably lead to missed plant items and unmanaged risk.'
      },
      {
        heading: '2. Structuring the Spatial & System Hierarchy',
        body: 'Adopt a standard hierarchy: Estate &rarr; Site &rarr; Building &rarr; Floor/Zone &rarr; Room/Space &rarr; System &rarr; Asset Parent &rarr; Sub-component. Aligning naming conventions with Uniclass 2015 ensures interoperability across BIM models, CAFM databases, and contractor work orders.'
      },
      {
        heading: '3. Asset Criticality and Condition Scoring',
        body: 'Score assets across Business Criticality (Life Safety, Operational Shutdown, Secondary Comfort) and Physical Condition (1: Good/New to 5: End of Life / Failure Imminent). This matrix informs maintenance frequency and capital expenditure priorities.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Guides', url: '/resources/guides' },
      { name: 'Asset Register Guide', url: '/resources/guides/asset-register-guide' }
    ],
    relatedRoutes: ['/mechanical-electrical', '/ppm', '/tools/fm-health-check', '/resources/document-vault'],
    conversionGoal: 'Demonstrate EntireFM engineering rigour and drive interest in asset discovery surveys and CAFM onboarding.',
    verificationRequirements: [
      'ISO 55000 and Uniclass standards referenced correctly',
      'Downloadable asset template available in Document Vault'
    ],
    contentStatus: 'COMPLETE'
  },
  '/resources/guides/fm-tender-guide': {
    path: '/resources/guides/fm-tender-guide',
    title: 'Facilities Management Tender & RFP Procurement Guide | EntireFM',
    metaDescription: 'How to structure an FM tender: drafting output specifications, establishing estate baselines, evaluating pricing models, and scoring bidder proposals.',
    h1: 'Facilities Management Tender & RFP Procurement Guide',
    eyebrow: 'Procurement & Commercial Strategy',
    heroIntro: 'How to specify, tender, and evaluate commercial facilities management contracts: defining scope, asset baselines, SLA frameworks, pricing mechanisms, and bidder evaluation.',
    heroDescription: 'A practical, objective procurement guide for property directors, procurement managers, and estate custodians preparing an FM request for proposal (RFP).',
    heroImage: '/images/editorial/entirefm-facilities-management-meeting-1200w.webp',
    historicIntent: 'Commercial and educational intent for tendering facilities management contracts',
    primaryIntent: 'facilities management tender guide',
    secondaryIntents: ['fm rfp guide', 'how to tender facilities management', 'fm procurement toolkit', 'fm tender questions'],
    pageType: 'company',
    historicTopics: ['Tender specification', 'Estate data', 'SLA / KPI frameworks', 'Pricing models', 'Bidder evaluation'],
    requiredSections: ['hero', 'intro', 'specification', 'pricing-models', 'evaluation-scoring', 'cta'],
    sections: [
      {
        heading: '1. Structuring the FM Specification: Input vs Output Based',
        body: 'Input-based specifications dictate the exact headcount and hours, whereas output-based specifications define the required performance standard (e.g. plant availability, SLA response times, statutory audit compliance). Output specifications incentivise efficiency and technological innovation.'
      },
      {
        heading: '2. Accurate Estate Data: The Antidote to Post-Award Variations',
        body: 'The single largest cause of post-contract commercial friction is deficient asset data during tender. Providing verified asset counts, floor areas, maintenance history, and statutory certificate registers prevents bidders from inserting large contingency risk premiums or submitting costly post-award variations.'
      },
      {
        heading: '3. Evaluating Pricing and Technical Capability',
        body: 'Score tenders across Quality (60%) and Commercial (40%). Scrutinise direct labour vs subcontracting models, CAFM transparency, mobilisation governance, and contractor audit regimes rather than simply accepting the lowest headline price.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'Guides', url: '/resources/guides' },
      { name: 'FM Tender Guide', url: '/resources/guides/fm-tender-guide' }
    ],
    relatedRoutes: ['/tools/tender-brief', '/services', '/ppm', '/tools/fm-roi-calculator'],
    conversionGoal: 'Position EntireFM as a transparent, high-capability bidder and drive adoption of the Tender Brief Generator tool.',
    verificationRequirements: [
      'Grounded in Crown Commercial Service & IWFM procurement best practices',
      'Direct link to Tender Brief Generator tool'
    ],
    contentStatus: 'COMPLETE'
  },
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
      '/tools/compliance-checker',
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

  '/tools/compliance-checker': {
    path: '/tools/compliance-checker',
    title: 'FM Statutory Compliance Checker | Commercial Estate Audit | EntireFM',
    metaDescription: 'Audit your commercial building statutory compliance across 10 core UK legal regimes. Receive instant risk scoring, priority actions, and a downloadable report.',
    h1: 'Commercial FM Statutory Compliance Checker',
    eyebrow: 'Statutory Screening Audit',
    heroIntro: 'Evaluate your building compliance across 10 statutory regimes: fire safety, electrical systems, commercial gas, water hygiene, lifting equipment, working at height, and digital record retention.',
    heroDescription: 'An authoritative, 3-minute screening instrument designed for property directors, building managers, and duty holders to identify statutory liabilities and generate prioritised remedial roadmaps.',
    heroImage: '/branding/EntireFM Branding 002.png',
    historicIntent: 'Historic search intent for building compliance checker and statutory facilities audit tool',
    primaryIntent: 'FM compliance checker',
    secondaryIntents: ['building compliance audit tool', 'statutory maintenance checker', 'commercial property compliance audit'],
    pageType: 'company',
    historicTopics: ['Fire Safety Order', 'Electricity at Work Regs', 'ACOP L8 Legionella', 'LOLER examinations', 'Gas Safety'],
    requiredSections: ['hero', 'wizard', 'results', 'cta'],
    sections: [
      {
        heading: '1. Why Statutory Compliance Screening Matters',
        body: 'Under UK law, duty holders and Responsible Persons bear strict legal duties to maintain building services in a safe, certified condition. Gaps in statutory testing records invalidate building insurance and expose duty holders to formal enforcement.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'Compliance Checker', url: '/tools/compliance-checker' }
    ],
    relatedRoutes: [
      '/tools/ppm-schedule-builder',
      '/tools/compliance-calendar',
      '/tools/fm-health-check',
      '/compliance'
    ],
    conversionGoal: 'Drive qualified compliance audits and commercial PPM onboarding.',
    verificationRequirements: [
      'Explicit legal references for RRO 2005, EAWR 1989, ACOP L8, and LOLER 1998'
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

  '/tools/asset-scanner': {
    path: '/tools/asset-scanner',
    title: 'Asset Scanner | Plant Recognition & SFG20 Regime Matcher | Entire FM',
    metaDescription: 'Scan plant nameplates and compliance certificates to identify equipment, verify technical details, and match against SFG20 maintenance regimes.',
    h1: 'Asset Scanner & Plant Recognition',
    eyebrow: 'Interactive Engineering Tool',
    heroIntro: 'Upload a plant nameplate photo or compliance document to identify equipment and match against verified SFG20 maintenance regimes.',
    heroDescription: 'Instant multimodal plant identification with strict zero-fabrication standards, linking detected equipment directly to statutory and planned preventative maintenance regimes.',
    heroImage: '/branding/EntireFM Branding 003.png',
    historicIntent: 'Asset recognition and PPM regime matcher',
    primaryIntent: 'Asset scanner',
    secondaryIntents: ['plant nameplate scanner', 'SFG20 asset matcher', 'equipment maintenance regime lookup'],
    pageType: 'company',
    historicTopics: ['Asset scanner', 'Plant nameplate extraction', 'SFG20 regime matching'],
    requiredSections: ['hero', 'scan-uploader', 'results-display', 'ppm-handoff-cta', 'quote-cta'],
    sections: [
      {
        heading: 'How Asset Scanning Works',
        body: 'Upload plant photos or certificates to instantly identify manufacturer, model, and serial details. Scanned assets can be saved to your digital estate register and populated into the 52-week PPM Schedule Builder.'
      }
    ],
    faqs: [
      {
        question: 'How long are anonymous uploads stored?',
        answer: 'Anonymous uploads have a strict 24-hour retention period and are automatically deleted. Logged-in Lobby members have scans saved indefinitely to their estate register.'
      },
      {
        question: 'Can I add scanned assets to a PPM schedule?',
        answer: 'Yes. Once an asset is matched to an SFG20 maintenance regime, you can add it directly to your 52-week PPM Schedule Builder.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      { name: 'FM Tools', url: '/tools' },
      { name: 'Asset Scanner', url: '/tools/asset-scanner' }
    ],
    relatedRoutes: [
      '/tools',
      '/tools/ppm-schedule-builder',
      '/ppm',
      '/compliance'
    ],
    conversionGoal: 'Encourage estate asset digitization and planned maintenance survey requests.',
    verificationRequirements: [
      'No fabricated serial numbers or regimes',
      'Strict SFG20 dataset alignment'
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
        heading: 'Current UK Facilities Management Landscape: 2026 Outlook',
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
    h1: 'EntireFM Academy: Practical Facilities Learning',
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
    h1: 'FM Document Vault: Operational Templates & Tools',
    eyebrow: 'Downloadable Estate Resources',
    heroIntro: 'Practical, verified FM templates, asset registers, compliance audit checklists, and logbook sheets designed for immediate operational use.',
    heroDescription: 'Every document in the vault is a real, functional template available in CSV, spreadsheet or printable formats, with zero fake download counters or gated forms.',
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
    h1: 'The Building Walk: Engineering & Site Inspection Series',
    eyebrow: 'Practical Plantroom & Estate Walkthroughs',
    heroIntro: 'Step-by-step technical walkthroughs of commercial offices, industrial estates, retail parks, and plantrooms, highlighting common defects, statutory risks, and engineering solutions.',
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
    h1: 'THE FM BRIEFING: Practical Intelligence for People Responsible for Buildings',
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
