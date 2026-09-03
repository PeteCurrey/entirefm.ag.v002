/**
 * CONTRACTOR SEO ENGINE — CONFIGURATION & DATA LAYER
 * ====================================================
 * Authoritative content and metadata definitions for all Contractor SEO pages.
 * Ensures consistent on-page SEO, Schema.org entities, breadcrumbs,
 * FAQs, and internal cross-linking across Phase 1 priorities.
 *
 * COMMERCIAL PROPOSITION:
 *  - £95 annual membership fee (payable during application submission).
 *  - No guaranteed work; allocation is merit-based.
 */

import { BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import { FaqItem } from '@/components/contractors/ContractorFaqAccordion';
import { RelatedLinkItem } from '@/components/contractors/ContractorRelatedGrid';
import { StepItem } from '@/components/contractors/ContractorStepByStep';
import { ComparisonRow } from '@/components/contractors/ContractorComparisonTable';

export interface ContractorPageConfig {
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle?: string;
  eyebrow: string;
  intro: string;
  heroImage: {
    src: string;
    alt: string;
  };
  breadcrumbs: BreadcrumbItem[];
  quickSummary?: {
    question: string;
    summary: string;
    keyPoints: string[];
    readTime?: string;
  };
  steps?: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    items: StepItem[];
    columns?: 1 | 2;
  };
  comparison?: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    colAName: string;
    colBName: string;
    rows: ComparisonRow[];
  };
  faqs: FaqItem[];
  relatedLinks: RelatedLinkItem[];
}

export const CONTRACTOR_COMMERCIAL_PAGES: Record<string, ContractorPageConfig> = {
  '/contractors': {
    path: '/contractors',
    metaTitle: 'Facilities Management Contractor Network UK | EntireFM',
    metaDescription:
      'Join the EntireFM Facilities Management Contractor Network. UK-wide commercial property maintenance, approved contractor panels, and £95 annual membership.',
    h1: 'Facilities Management Contractor Network UK',
    subtitle: 'Commercial maintenance opportunities for approved UK trade specialists.',
    eyebrow: 'ENTIREFM CONTRACTOR NETWORK // COMMERCIAL HUB',
    intro:
      'EntireFM connects qualified trade contractors and engineering specialists with commercial facilities management contracts across the UK. Put your business forward for planned preventative maintenance and reactive building services across corporate, industrial, and retail estates.',
    heroImage: {
      src: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
      alt: 'EntireFM corporate headquarters and UK facilities management contractor network hub',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
    ],
    faqs: [
      {
        question: 'What is the EntireFM Contractor Network?',
        answer:
          'The EntireFM Contractor Network is an approved panel of vetted trade contractors and specialist engineering firms who are considered for commercial facilities management, planned maintenance (PPM), and reactive service work across our nationwide client property portfolios.',
      },
      {
        question: 'How much does membership cost?',
        answer:
          'Membership is £95 + VAT per year. The £95 fee is payable during the application process when you submit your business details, insurance certificates, and trade accreditations for technical desk review.',
      },
      {
        question: 'Does membership guarantee that my business will receive work?',
        answer:
          'No. Membership does not guarantee work, contract awards, or lead volume. All work allocations are made strictly on merit, taking into account client specifications, contractor trade competency, insurance limits, geographical proximity, and demonstrated reliability.',
      },
      {
        question: 'What trades does EntireFM require?',
        answer:
          'We engage contractors across 10 primary building services disciplines: Electrical (EICR/18th Edition), Mechanical & Plantroom, HVAC & Refrigeration (F-Gas/Refcom), Commercial Plumbing & Gas, Commercial Roofing, Commercial Cleaning & Hygiene, Fire & Security (BAFE/BS5839), Grounds Maintenance, Building Fabric Maintenance, and Commercial Drainage.',
      },
      {
        question: 'What compliance credentials do contractors need to demonstrate?',
        answer:
          'Applicants must hold minimum Public Liability insurance (£5m standard, £10m preferred for high-value sites), Employers Liability insurance (where applicable), relevant trade competency accreditations (such as NICEIC, Gas Safe, Refcom, or BAFE), and valid SSIP health and safety accreditation (e.g. CHAS, SafeContractor, or Constructionline).',
      },
    ],
    relatedLinks: [
      {
        title: 'Join the EntireFM Contractor Network',
        description: 'Complete the contractor qualification intake to put your business forward for commercial FM opportunities.',
        href: '/contractors/join',
        badge: 'Apply Now',
        category: 'Commercial',
      },
      {
        title: 'Find Facilities Management Work',
        description: 'Understand procurement routes, managing agents, and how approved contractor panels award work.',
        href: '/contractors/find-work',
        badge: 'Procurement',
        category: 'Commercial',
      },
      {
        title: 'Approved Contractor Network UK',
        description: 'Learn why tier-1 facilities managers use approved supplier networks and how compliance vetting works.',
        href: '/contractors/approved-contractor-network',
        badge: 'Assurance',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/join': {
    path: '/contractors/join',
    metaTitle: 'Join the EntireFM Contractor Network | £95 Annual Membership',
    metaDescription:
      'Apply to join the EntireFM Contractor Network. Put your business forward for UK facilities management opportunities. £95 annual membership payable on submission.',
    h1: 'Join the EntireFM Contractor Network',
    subtitle: 'Vetted contractor qualification for commercial facilities management opportunities.',
    eyebrow: 'CONTRACTOR ONBOARDING // APPLICATION HUB',
    intro:
      'Put your business forward to become an approved EntireFM contractor. Access our commercial operating platform, digital Document Vault, and merit-based consideration for facilities management requirements across the UK.',
    heroImage: {
      src: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
      alt: 'EntireFM commercial facilities survey team and contractor vetting process',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Join the Network', url: '/contractors/join' },
    ],
    faqs: [
      {
        question: 'When is the £95 membership fee paid?',
        answer:
          'The £95 + VAT annual membership fee is payable during the online application process when you submit your contractor profile and compliance details for assessment.',
      },
      {
        question: 'What happens after I submit my application?',
        answer:
          'Our contractor assurance team conducts a technical desk review of your declared business details, trade accreditations, and insurance limits. Once validated, your profile is activated in our operating system and your coverage area is mapped to relevant commercial client sites.',
      },
      {
        question: 'Can sole traders apply or only limited companies?',
        answer:
          'We welcome qualified sole traders, partnerships, and limited companies. What matters is statutory trade competence, valid insurance, appropriate health and safety procedures, and commitment to commercial service standards.',
      },
      {
        question: 'What does membership include?',
        answer:
          'Membership includes access to the EntireFM contractor operating platform, your dedicated Document Vault with automated expiry tracking for insurances and certs, job pack tools, and active consideration for relevant commercial FM assignments.',
      },
      {
        question: 'Does joining the network guarantee a specific volume of contracts?',
        answer:
          'No. We maintain commercial transparency: membership does not buy or guarantee work. Work is dispatched when client requirements match your specific technical trade, operating radius, and verified compliance record.',
      },
    ],
    relatedLinks: [
      {
        title: 'Approved Contractor Network Overview',
        description: 'Review our due diligence framework, compliance expectations, and supplier vetting criteria.',
        href: '/contractors/approved-contractor-network',
        badge: 'Standards',
        category: 'Compliance',
      },
      {
        title: 'How to Write RAMS',
        description: 'Ensure your Risk Assessments and Method Statements meet commercial FM client standards.',
        href: '/contractor-resources/rams/how-to-write-rams',
        badge: 'Guide',
        category: 'RAMS',
      },
      {
        title: 'Commercial Maintenance Network',
        description: 'Explore opportunities across planned preventative maintenance and reactive building services.',
        href: '/contractors/commercial-maintenance',
        badge: 'Services',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/find-work': {
    path: '/contractors/find-work',
    metaTitle: 'Find Facilities Management Work as a Contractor UK | EntireFM',
    metaDescription:
      'Learn how to find facilities management work as a UK contractor. Explore tendering, managing agent panels, approved contractor networks, and EntireFM.',
    h1: 'Find Facilities Management Work as a Contractor',
    subtitle: 'Strategic routes into commercial property maintenance and building engineering contracts.',
    eyebrow: 'CONTRACTOR MARKET INTELLIGENCE // SECURING FM WORK',
    intro:
      'Securing commercial facilities management work requires understanding how building owners, managing agents, and FM companies procure trade services. Discover the main commercial routes into the FM supply chain and how approved contractor networks streamline work access.',
    heroImage: {
      src: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
      alt: 'Commercial electrical contractor testing industrial switchgear on facilities management site',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Find Work', url: '/contractors/find-work' },
    ],
    faqs: [
      {
        question: 'Why do commercial FM companies use contractor networks instead of ad-hoc trades?',
        answer:
          'FM companies manage multi-site portfolios under strict Service Level Agreements (SLAs). Ad-hoc hiring creates severe compliance, liability, and response risks. An approved network ensures that every contractor has pre-verified insurance, SSIP accreditation, trade competencies, and agreed hourly and call-out rates.',
      },
      {
        question: 'How do managing agents differ from facilities management firms?',
        answer:
          'Managing agents represent landlords or freeholders and oversee service charge budgets, lease covenants, and general asset administration. Facilities managers oversee the operational delivery, engineering infrastructure, statutory compliance, and physical maintenance of the buildings. FM firms frequently serve managing agents.',
      },
      {
        question: 'What is the fastest way for an SME contractor to access FM contracts?',
        answer:
          'Rather than bidding on complex, slow public tenders that take months of resource, joining established FM contractor panels provides immediate visibility to operational teams with ongoing reactive and planned maintenance requirements.',
      },
    ],
    relatedLinks: [
      {
        title: 'How to Get Facilities Management Work',
        description: 'In-depth guide on pre-qualification questionnaires, SSIP schemes, and pitching to managing agents.',
        href: '/contractor-resources/winning-work/how-to-get-facilities-management-work',
        badge: 'Deep Guide',
        category: 'Commercial',
      },
      {
        title: 'Join EntireFM Contractor Network',
        description: 'Submit your contractor profile and put your business forward for commercial FM opportunities.',
        href: '/contractors/join',
        badge: 'Apply',
        category: 'Commercial',
      },
      {
        title: 'Subcontractor Opportunities',
        description: 'Understand how subcontracting works in facilities management and what tier-1 contractors expect.',
        href: '/contractors/subcontractor-opportunities',
        badge: 'Subcontracting',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/approved-contractor-network': {
    path: '/contractors/approved-contractor-network',
    metaTitle: 'Approved Contractor Network UK | Commercial FM Panels | EntireFM',
    metaDescription:
      'What is an approved contractor network? How UK facilities management panels operate, vetting standards, compliance expectations, and EntireFM membership.',
    h1: 'Approved Contractor Network UK',
    subtitle: 'Vetted supplier panels, compliance assurance, and commercial partnership frameworks.',
    eyebrow: 'SUPPLY CHAIN ASSURANCE // ACCREDITED PANELS',
    intro:
      'Approved contractor networks form the operational backbone of UK commercial property management. Discover what compliance standards tier-1 FM organisations demand, why vetted status builds lasting commercial relationships, and how EntireFM manages its approved contractor panel.',
    heroImage: {
      src: '/images/editorial/entirefm-site-arrival-2000w.webp',
      alt: 'EntireFM approved engineering contractor arriving at modern commercial facility',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Approved Contractor Network', url: '/contractors/approved-contractor-network' },
    ],
    faqs: [
      {
        question: 'What is the definition of an approved contractor network?',
        answer:
          'An approved contractor network is a formally audited register of independent trade and engineering companies who have undergone rigorous pre-qualification for technical competence, statutory compliance, insurance adequacy, financial standing, and health & safety governance.',
      },
      {
        question: 'Why do FM companies mandate SSIP accreditation for approved status?',
        answer:
          'Safety Schemes in Procurement (SSIP) mutual recognition (such as CHAS, SafeContractor, or Constructionline) proves that a contractor meets core Stage 1 health & safety standards under CDM 2015 regulations, dramatically reducing duplication and verifying baseline safety compliance.',
      },
      {
        question: 'How does EntireFM maintain approved contractor records?',
        answer:
          'We operate a digital Document Vault with 90, 60, and 30-day automated alerts for expiring liability insurances, calibration certificates, and trade registrations. This ensures our contractor network remains continuously audit-ready for client reviews.',
      },
    ],
    relatedLinks: [
      {
        title: 'Join the Approved Network',
        description: 'Complete the intake wizard and upload your credentials for desk review.',
        href: '/contractors/join',
        badge: 'Apply',
        category: 'Commercial',
      },
      {
        title: 'What Are RAMS?',
        description: 'Understand the legal basis and structure of Risk Assessments and Method Statements.',
        href: '/contractor-resources/rams/what-are-rams',
        badge: 'Compliance',
        category: 'RAMS',
      },
      {
        title: 'Property Management Network',
        description: 'Learn how approved contractors work with commercial managing agents and property portfolios.',
        href: '/contractors/property-management',
        badge: 'Sectors',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/property-management': {
    path: '/contractors/property-management',
    metaTitle: 'Property Management Contractor Network UK | EntireFM',
    metaDescription:
      'Commercial property management contractor opportunities. Connecting trade specialists with commercial landlords, managing agents, and multi-tenant estates.',
    h1: 'Property Management Contractor Network',
    subtitle: 'Connecting trade contractors with commercial landlords, managing agents, and multi-tenant estates.',
    eyebrow: 'SECTOR SOLUTIONS // PROPERTY MANAGEMENT INTEGRATION',
    intro:
      'Commercial property managers and managing agents require dependable, compliance-first contractors to protect landlord asset value and keep tenant businesses operational. Learn how EntireFM bridges specialist trade contractors into managed commercial property portfolios.',
    heroImage: {
      src: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
      alt: 'Commercial property management estate and business park maintained by EntireFM contractor network',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Property Management', url: '/contractors/property-management' },
    ],
    faqs: [
      {
        question: 'What types of properties are managed through the network?',
        answer:
          'Our network services multi-tenant commercial offices, business parks, industrial logistics hubs, retail parks, science parks, and mixed-use commercial developments across the UK.',
      },
      {
        question: 'What do managing agents prioritise when hiring contractors?',
        answer:
          'Managing agents prioritise rapid response to building tenant issues, strict adherence to site access and permit-to-work procedures, immaculate RAMS, professional operative conduct, and fast submission of digital service reports with photo evidence.',
      },
      {
        question: 'How are service charge considerations handled?',
        answer:
          'Managing agents operate under strict Section 20 and service charge accounting governance. Transparent quotation, clear breakdown of labour and materials, and accurate photographic job closeouts are required for invoice sign-off.',
      },
    ],
    relatedLinks: [
      {
        title: 'Commercial Maintenance Network',
        description: 'Explore the full range of planned and reactive maintenance across commercial properties.',
        href: '/contractors/commercial-maintenance',
        badge: 'Maintenance',
        category: 'Commercial',
      },
      {
        title: 'What Is PPM in Facilities Management?',
        description: 'Guide to planned preventative maintenance schedules and SFG20 asset care.',
        href: '/contractor-resources/facilities-management/what-is-ppm',
        badge: 'Guide',
        category: 'PPM',
      },
      {
        title: 'Apply for Contractor Membership',
        description: 'Submit your company profile for consideration across commercial property estates.',
        href: '/contractors/join',
        badge: 'Join',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/commercial-maintenance': {
    path: '/contractors/commercial-maintenance',
    metaTitle: 'Commercial Maintenance Contractor Network UK | EntireFM',
    metaDescription:
      'Join our commercial maintenance contractor network. Opportunities across HVAC, electrical, mechanical, plumbing, roofing, and building fabric maintenance.',
    h1: 'Commercial Maintenance Contractor Network',
    subtitle: 'Delivering scheduled PPM and reactive maintenance across UK commercial estates.',
    eyebrow: 'COMMERCIAL SERVICES // MAINTENANCE SPECIALISTS',
    intro:
      'From complex plantrooms and rooftop chillers to distribution boards and high-traffic building fabric, commercial maintenance requires specialist engineering competence. Join our approved panel of commercial maintenance contractors.',
    heroImage: {
      src: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      alt: 'Commercial maintenance contractor servicing mechanical booster pumps in building plant room',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Commercial Maintenance', url: '/contractors/commercial-maintenance' },
    ],
    faqs: [
      {
        question: 'What is the split between planned (PPM) and reactive maintenance work?',
        answer:
          'EntireFM operates both scheduled planned maintenance contracts (SFG20-aligned annual maintenance regimes) and 24/7 reactive call-out services. Approved contractors are matched according to their declared capabilities, response availability, and travel radius.',
      },
      {
        question: 'Do contractors need 24/7 emergency response capability?',
        answer:
          'No, 24/7 emergency availability is not mandatory for network participation. Contractors who offer out-of-hours call-outs can opt in to emergency dispatch, but scheduled PPM and business-hours maintenance represent the majority of work orders.',
      },
      {
        question: 'What documentation is required upon completing a maintenance visit?',
        answer:
          'Contractors must complete a digital service sheet detailing work completed, parts replaced, asset serial numbers, time on site, and before/after photographs, accompanied by the client or site representative signature.',
      },
    ],
    relatedLinks: [
      {
        title: 'Subcontractor Opportunities',
        description: 'Find out how specialist engineering subcontractors work with EntireFM on commercial contracts.',
        href: '/contractors/subcontractor-opportunities',
        badge: 'Subcontracting',
        category: 'Commercial',
      },
      {
        title: 'What Is Facilities Management?',
        description: 'An overview of hard and soft FM services from the contractor perspective.',
        href: '/contractor-resources/facilities-management/what-is-facilities-management',
        badge: 'Guide',
        category: 'Guide',
      },
      {
        title: 'Apply to Join Network',
        description: 'Start your application and activate your commercial contractor profile.',
        href: '/contractors/join',
        badge: '£95/yr',
        category: 'Commercial',
      },
    ],
  },

  '/contractors/subcontractor-opportunities': {
    path: '/contractors/subcontractor-opportunities',
    metaTitle: 'Facilities Management Subcontractor Opportunities UK | EntireFM',
    metaDescription:
      'Explore UK FM subcontractor opportunities. How commercial subcontracting works, compliance expectations, payment standards, and joining EntireFM.',
    h1: 'Facilities Management Subcontractor Opportunities',
    subtitle: 'Professional subcontracting frameworks for UK building engineering specialists.',
    eyebrow: 'SUB-CONTRACTING FRAMEWORK // TRADE CONTRACTORS',
    intro:
      'Subcontracting provides trade specialists with consistent commercial work without the heavy overheads of direct client acquisition, complex public tendering, or multi-year marketing campaigns. Discover how EntireFM engages subcontractors and how to become an approved supply chain partner.',
    heroImage: {
      src: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      alt: 'Specialist engineering subcontractor conducting high-voltage switchgear inspection in commercial substation',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractors', url: '/contractors' },
      { name: 'Subcontractor Opportunities', url: '/contractors/subcontractor-opportunities' },
    ],
    faqs: [
      {
        question: 'How do subcontractor agreements work with EntireFM?',
        answer:
          'Approved subcontractors operate under our standard Master Services Agreement (MSA) and Purchase Order (PO) framework. Individual assignments are issued with clear work scopes, agreed commercial rates, SLA response windows, and site-specific permit instructions.',
      },
      {
        question: 'What are the payment terms for approved subcontractors?',
        answer:
          'We uphold fair, dependable commercial payment terms. Once a completed job report and valid VAT invoice referencing the Purchase Order are received, payments are processed in accordance with agreed contract cycles.',
      },
      {
        question: 'Can subcontractors represent their own brand on site?',
        answer:
          'Subcontractors attending EntireFM client sites operate under professional supply chain guidelines. While driving their own liveried trade vehicles, operatives carry EntireFM digital or physical ID cards to confirm authorised access to client building managers.',
      },
    ],
    relatedLinks: [
      {
        title: 'Join the Contractor Network',
        description: 'Complete the contractor intake process (£95 annual membership) to qualify for opportunities.',
        href: '/contractors/join',
        badge: 'Apply',
        category: 'Commercial',
      },
      {
        title: 'Find Facilities Management Work',
        description: 'Learn the difference between direct client tendering and joining approved contractor networks.',
        href: '/contractors/find-work',
        badge: 'Overview',
        category: 'Commercial',
      },
      {
        title: 'What Is a Method Statement?',
        description: 'Guidance on preparing safe systems of work for commercial subcontractor work orders.',
        href: '/contractor-resources/rams/what-is-a-method-statement',
        badge: 'Guide',
        category: 'RAMS',
      },
    ],
  },
};

export const CONTRACTOR_RESOURCE_PAGES: Record<string, ContractorPageConfig> = {
  '/contractor-resources/rams/what-are-rams': {
    path: '/contractor-resources/rams/what-are-rams',
    metaTitle: 'What Are RAMS? Meaning, Purpose & Requirements for Contractors | EntireFM',
    metaDescription:
      'What are RAMS? What does RAMS stand for? UK contractor guide to Risk Assessments & Method Statements, legal duties under MHSWR 1999, and site-specific RAMS.',
    h1: 'What Are RAMS?',
    subtitle: 'The essential UK contractor guide to Risk Assessments and Method Statements.',
    eyebrow: 'CONTRACTOR COMPLIANCE // ESSENTIAL KNOWLEDGE',
    intro:
      'RAMS is the cornerstone of health and safety documentation in UK facilities management and construction. Learn what RAMS stands for, why commercial clients demand it before granting site access, and what makes a compliant, site-specific safety package.',
    heroImage: {
      src: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
      alt: 'Facilities management engineers reviewing RAMS compliance documentation for commercial building',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'RAMS', url: '/contractor-resources/rams' },
      { name: 'What Are RAMS?', url: '/contractor-resources/rams/what-are-rams' },
    ],
    quickSummary: {
      question: 'What does RAMS stand for and what is its purpose?',
      summary:
        'RAMS stands for Risk Assessment and Method Statement. It is a combined safety package that documents the hazards of a task (the Risk Assessment) and details the step-by-step safe method of executing the work (the Method Statement). In the UK, commercial facilities managers require RAMS before issuing work permits or allowing contractors on site.',
      keyPoints: [
        'RAMS = Risk Assessment + Method Statement',
        'Legal basis: Health & Safety at Work Act 1974 & MHSWR 1999 Reg 3',
        'Mandatory for commercial FM site access and permit-to-work issuance',
        'Must be tailored to the specific site — generic templates are rejected',
      ],
      readTime: '6 min read',
    },
    comparison: {
      eyebrow: 'CORE ANATOMY',
      title: 'Risk Assessment vs Method Statement: Key Differences',
      subtitle: 'Understanding the paired components of a complete RAMS package.',
      colAName: 'Risk Assessment (RA)',
      colBName: 'Method Statement (MS)',
      rows: [
        {
          attribute: 'Primary Purpose',
          colA: 'Identifies hazards and evaluates who could be harmed and how',
          colB: 'Defines the chronological step-by-step safe sequence of works',
          highlight: true,
        },
        {
          attribute: 'Key Question Answered',
          colA: 'What could go wrong on site and how bad could it be?',
          colB: 'How will the engineering team complete the job safely?',
        },
        {
          attribute: 'Quantification',
          colA: 'Numerical risk matrix scoring (Likelihood × Severity)',
          colB: 'Descriptive narrative, diagrams, and sequential instructions',
        },
        {
          attribute: 'Statutory Obligation',
          colA: 'Explicitly mandated by MHSWR 1999 Regulation 3',
          colB: 'Implicit duty under HASWA 1974 Section 2 (Safe Systems of Work)',
        },
        {
          attribute: 'Target Audience',
          colA: 'Safety managers, compliance reviewers, and insurance auditors',
          colB: 'Site operatives, engineers, and client building managers',
        },
      ],
    },
    faqs: [
      {
        question: 'What does RAMS stand for?',
        answer:
          'RAMS stands for Risk Assessment and Method Statement. It brings together hazard evaluation and safe working procedures into a single operational safety document.',
      },
      {
        question: 'Are RAMS legally required in the UK?',
        answer:
          'Under Regulation 3 of the Management of Health and Safety at Work Regulations 1999 (MHSWR), all employers and self-employed contractors have an explicit statutory duty to conduct suitable and sufficient risk assessments. While the exact term "Method Statement" is not written verbatim into legislation, Section 2 of the Health and Safety at Work etc. Act 1974 mandates the provision of safe systems of work. In commercial facilities management, RAMS is a mandatory contractual prerequisite.',
      },
      {
        question: 'Why are generic RAMS templates frequently rejected by FM clients?',
        answer:
          'Generic templates do not address the unique hazards of the physical building—such as specific asbestos register locations, fragile roof lights, proximity to high-voltage equipment, occupied commercial tenants, or restricted escape routes. FM review desks reject generic RAMS because they fail the legal test of being "suitable and sufficient" for the actual site.',
      },
      {
        question: 'Who must sign the RAMS document?',
        answer:
          'The document must be authored and signed off by a competent person from the contractor company. Crucially, before starting any work on site, every operative and engineer carrying out the task must read, understand, and sign the briefing sheet to confirm they will follow the agreed method.',
      },
    ],
    relatedLinks: [
      {
        title: 'How to Write RAMS: Step-by-Step Guide',
        description: 'Practical 11-step walkthrough for drafting compliant RAMS for UK commercial contracts.',
        href: '/contractor-resources/rams/how-to-write-rams',
        badge: 'How-To',
        category: 'RAMS',
      },
      {
        title: 'What Is a Method Statement?',
        description: 'Deep dive into the anatomy and legal role of Safe Systems of Work.',
        href: '/contractor-resources/rams/what-is-a-method-statement',
        badge: 'Guide',
        category: 'RAMS',
      },
      {
        title: 'EntireFM Contractor Network',
        description: 'Join our approved network of qualified trade specialists (£95/yr annual membership).',
        href: '/contractors/join',
        badge: 'Join',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/rams/how-to-write-rams': {
    path: '/contractor-resources/rams/how-to-write-rams',
    metaTitle: 'How to Write RAMS: 11-Step Contractor Guide | EntireFM',
    metaDescription:
      'Learn how to write professional RAMS for UK commercial facilities management. 11-step practical guide covering hazard identification, control measures, and method statements.',
    h1: 'How to Write RAMS',
    subtitle: 'A practical, step-by-step authoring guide for UK trade and engineering contractors.',
    eyebrow: 'STEP-BY-STEP COMPLIANCE // AUTHORING GUIDE',
    intro:
      'Writing effective, client-ready Risk Assessments and Method Statements does not require dense textbook jargon. It requires a clear, logical understanding of the work scope, real hazards, and sequential safe execution. Follow this practical 11-step guide to author compliant RAMS.',
    heroImage: {
      src: '/images/editorial/entirefm-access-control-install-2000w.webp',
      alt: 'Commercial electrical contractor installing building access control according to site-specific RAMS',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'RAMS', url: '/contractor-resources/rams' },
      { name: 'How to Write RAMS', url: '/contractor-resources/rams/how-to-write-rams' },
    ],
    quickSummary: {
      question: 'What are the essential steps to write a compliant RAMS?',
      summary:
        'To write compliant RAMS: (1) Understand task scope, (2) Identify site-specific hazards, (3) Evaluate risk severity and likelihood, (4) Apply the Hierarchy of Controls, (5) Specify required PPE, (6) Detail emergency plans, (7) Draft sequential method steps, (8) Name competent personnel, (9) Authorise sign-off, (10) Deliver site briefing to operatives, and (11) Review dynamically if site conditions alter.',
      keyPoints: [
        'Always establish the exact physical boundary and scope before authoring',
        'Follow the ERICPD Hierarchy of Controls (Eliminate, Reduce, Isolate, Control, PPE, Discipline)',
        'Write chronological method steps with specific isolation and permit details',
        'Brief operatives on site and capture signatures before commencing',
      ],
      readTime: '9 min read',
    },
    steps: {
      eyebrow: 'AUTHORING FRAMEWORK',
      title: 'The 11-Step Process for Writing Commercial RAMS',
      subtitle: 'A structured, repeatable methodology for engineering and maintenance contractors.',
      columns: 2,
      items: [
        {
          step: 1,
          title: 'Understand the Scope & Physical Environment',
          description:
            'Review the job specification, drawings, and site constraints. Determine whether the site is an occupied office, public retail space, or industrial plantroom, and identify interface risks with building users.',
          badge: 'Scoping',
        },
        {
          step: 2,
          title: 'Identify Task & Site Hazards',
          description:
            'List all potential hazards: working at height, live electricity, hot surfaces, hazardous substances (COSHH), noise, confined spaces, and manual handling.',
          badge: 'Hazards',
        },
        {
          step: 3,
          title: 'Assess Risk & Calculate Scores',
          description:
            'For each hazard, assess who could be harmed (operatives, building occupants, members of the public) and assign Likelihood (1–5) and Severity (1–5) ratings.',
          badge: 'Scoring',
        },
        {
          step: 4,
          title: 'Define Control Measures (ERICPD)',
          description:
            'Apply the Hierarchy of Controls: Eliminate the hazard where possible; Reduce risk; Isolate with barriers; implement technical Controls; supply suitable PPE; enforce Discipline.',
          badge: 'Mitigation',
        },
        {
          step: 5,
          title: 'Determine Mandatory PPE',
          description:
            'Specify exact PPE standards required for the task (e.g. BS EN safety boots, eye protection, dielectric gloves, or harness with double lanyards), not just generic "PPE as required".',
          badge: 'Equipment',
        },
        {
          step: 6,
          title: 'Establish Emergency & First Aid Protocols',
          description:
            'Document site-specific emergency arrangements: nearest first aider, eye-wash stations, fire alarm procedures, site evacuation assembly points, and emergency contact numbers.',
          badge: 'Emergency',
        },
        {
          step: 7,
          title: 'Write the Sequential Method Statement',
          description:
            'Write step-by-step instructions in chronological order: arrival & sign-in, isolation of services (LOTO), task delivery, testing, clean-down, handover, and site sign-out.',
          badge: 'Methodology',
        },
        {
          step: 8,
          title: 'Identify Responsible & Competent Persons',
          description:
            'Clearly name the site supervisor, designated competent person, first aider, and appointed safety manager with contact details and verified qualifications.',
          badge: 'Personnel',
        },
        {
          step: 9,
          title: 'Technical Review & Authorisation',
          description:
            'A qualified company manager or supervisor must formally review and sign the RAMS package prior to issuing it to the client for permit-to-work review.',
          badge: 'Sign-Off',
        },
        {
          step: 10,
          title: 'Communicate & Brief Site Operatives',
          description:
            'Before any tools are unpacked on site, all operatives must attend a briefing, read the RAMS, ask clarifying questions, and sign the operative briefing register.',
          badge: 'Briefing',
        },
        {
          step: 11,
          title: 'Dynamic Review When Circumstances Change',
          description:
            'If site conditions change—such as unexpected weather, discovering asbestos, scope alterations, or live tenant movements—halt work, review controls, and update the RAMS.',
          badge: 'Dynamic Review',
        },
      ],
    },
    faqs: [
      {
        question: 'How long should a good RAMS document be?',
        answer:
          'Length depends on risk and scope. A simple routine filter change may only need 4 to 6 concise pages. A complex chiller replacement, roof plant lift, or high-voltage isolation may require 15 to 25 detailed pages. Clarity, sequence, and accuracy are far more important than raw page counts.',
      },
      {
        question: 'Can I reuse a RAMS template from a previous job?',
        answer:
          'You can use proven templates as an authoring baseline, but you must thoroughly tailor the details for each job: site address, access routes, specific plant models, tenant sensitivities, emergency exits, and named operatives.',
      },
      {
        question: 'What is a Dynamic Risk Assessment (DRA)?',
        answer:
          'A Dynamic Risk Assessment is the continuous evaluation of risk carried out by operatives in real time as unexpected situations arise on site. If an unexpected hazard occurs that is not covered by the written RAMS, work must pause until controls are updated.',
      },
    ],
    relatedLinks: [
      {
        title: 'What Are RAMS?',
        description: 'The foundational guide to RAMS definitions, legal requirements, and FM expectations.',
        href: '/contractor-resources/rams/what-are-rams',
        badge: 'Core Concept',
        category: 'RAMS',
      },
      {
        title: 'What Is a Method Statement?',
        description: 'Detailed analysis of drafting chronological Safe Systems of Work.',
        href: '/contractor-resources/rams/what-is-a-method-statement',
        badge: 'Deep Dive',
        category: 'RAMS',
      },
      {
        title: 'How to Write a Risk Assessment',
        description: 'Step-by-step risk assessment guide focusing on hazard matrices and control scoring.',
        href: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment',
        badge: 'Guide',
        category: 'Compliance',
      },
    ],
  },

  '/contractor-resources/rams/what-is-a-method-statement': {
    path: '/contractor-resources/rams/what-is-a-method-statement',
    metaTitle: 'What Is a Method Statement? Definition & Contractor Guide | EntireFM',
    metaDescription:
      'What is a method statement? Learn what a Safe System of Work (SSoW) is, mandatory contents, sequential steps, and how it differs from a risk assessment in UK FM.',
    h1: 'What Is a Method Statement?',
    subtitle: 'Safe Systems of Work (SSoW) and chronological procedures for UK commercial contractors.',
    eyebrow: 'SAFE SYSTEMS OF WORK // CONTRACTOR KNOWLEDGE',
    intro:
      'While a Risk Assessment identifies what could go wrong, a Method Statement details precisely how the work will be carried out safely. Discover the definition, legal status, essential contents, and common drafting errors of commercial Method Statements.',
    heroImage: {
      src: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
      alt: 'Commercial mechanical engineering contractor carrying out hydrostatic pressure test following method statement procedure',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'RAMS', url: '/contractor-resources/rams' },
      { name: 'What Is a Method Statement?', url: '/contractor-resources/rams/what-is-a-method-statement' },
    ],
    quickSummary: {
      question: 'What is a Method Statement and why is it required?',
      summary:
        'A Method Statement (often termed a Safe System of Work or SSoW) is a formal document detailing the exact sequential procedure for executing a work task safely. It specifies plant, equipment, isolation procedures, access arrangements, personal protective equipment (PPE), and emergency protocols.',
      keyPoints: [
        'Operational translation of control measures identified in the risk assessment',
        'Written chronologically so site engineers follow a clear sequence',
        'Mandatory for high-risk, intrusive, or commercial maintenance works',
        'Helps clients confirm that the contractor has planned safe execution',
      ],
      readTime: '7 min read',
    },
    faqs: [
      {
        question: 'Is a Method Statement legally required in the UK?',
        answer:
          'While the specific term "Method Statement" does not appear in UK statutory legislation, employers have an explicit legal duty under Section 2 of the Health and Safety at Work etc. Act 1974 to provide and maintain "safe systems of work". A Method Statement is the recognised industry standard for documenting this safe system.',
      },
      {
        question: 'Who should write the Method Statement?',
        answer:
          'The contractor or subcontractor carrying out the works must author the document. It must be written by a technically competent individual who genuinely understands the practical trade steps, plant, tooling, isolations, and site risks.',
      },
      {
        question: 'What are the most common mistakes in contractor Method Statements?',
        answer:
          'The top mistakes include: lack of chronological sequence, vague statements like "work will be done carefully", omitting isolation/lockout procedures (LOTO), ignoring waste disposal and environmental controls, and failing to specify emergency rescue plans for working at height.',
      },
    ],
    relatedLinks: [
      {
        title: 'What Are RAMS?',
        description: 'Explore the complete RAMS framework combining risk assessments and method statements.',
        href: '/contractor-resources/rams/what-are-rams',
        badge: 'Core Concept',
        category: 'RAMS',
      },
      {
        title: 'How to Write RAMS',
        description: 'Step-by-step practical authoring methodology for UK facilities management contracts.',
        href: '/contractor-resources/rams/how-to-write-rams',
        badge: 'Methodology',
        category: 'RAMS',
      },
      {
        title: 'Contractor Subcontractor Opportunities',
        description: 'Put your business forward for commercial FM subcontracts (£95 annual membership).',
        href: '/contractors/subcontractor-opportunities',
        badge: 'Opportunities',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/risk-assessments/what-is-a-risk-assessment': {
    path: '/contractor-resources/risk-assessments/what-is-a-risk-assessment',
    metaTitle: 'What Is a Risk Assessment? UK Contractor Guide | EntireFM',
    metaDescription:
      'What is a risk assessment? UK contractor guide to hazard identification, risk evaluation, 5 steps to risk assessment, and legal duties under MHSWR 1999.',
    h1: 'What Is a Risk Assessment?',
    subtitle: 'Statutory hazard evaluation and practical risk mitigation for UK trade contractors.',
    eyebrow: 'STATUTORY COMPLIANCE // RISK PRINCIPLES',
    intro:
      'Every commercial contractor in the UK has a legal duty to evaluate risks before undertaking work. Learn what a risk assessment is, the difference between a hazard and a risk, the HSE 5-step model, and how risk scoring matrices work in facilities management.',
    heroImage: {
      src: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      alt: 'Facilities management risk assessment survey on commercial rooftop plant deck',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'Risk Assessments', url: '/contractor-resources/risk-assessments' },
      { name: 'What Is a Risk Assessment?', url: '/contractor-resources/risk-assessments/what-is-a-risk-assessment' },
    ],
    quickSummary: {
      question: 'What is a Risk Assessment and what is its legal foundation?',
      summary:
        'A risk assessment is the systematic process of identifying workplace hazards, evaluating the likelihood and severity of potential harm, and putting proportionate control measures in place. Under Regulation 3 of the Management of Health and Safety at Work Regulations 1999, employers and self-employed contractors must conduct suitable and sufficient risk assessments.',
      keyPoints: [
        'Hazard = anything that can cause harm; Risk = the chance that harm will occur and how severe it will be',
        'Mandatory for all employers; written record required by law if employing 5 or more people',
        'FM clients mandate written risk assessments regardless of contractor head count',
        'Must follow the 5-step HSE framework to be legally sufficient',
      ],
      readTime: '6 min read',
    },
    faqs: [
      {
        question: 'What is the precise difference between a hazard and a risk?',
        answer:
          'A hazard is something with the potential to cause harm (e.g. electricity, a 4-metre roof edge, wet floor, or toxic refrigerant). A risk is the likelihood that someone will be harmed by that hazard, combined with the severity of the consequences.',
      },
      {
        question: 'Do sole traders need to write a risk assessment?',
        answer:
          'Yes. Under the Health and Safety at Work etc. Act 1974, self-employed persons must protect themselves and others from their work activities. While statute technically exempts businesses with fewer than 5 employees from writing it down, commercial clients and principal contractors will not permit any contractor on site without a written, signed risk assessment.',
      },
      {
        question: 'How does a 5x5 risk matrix work?',
        answer:
          'A 5x5 matrix multiplies Likelihood (1 = Rare to 5 = Almost Certain) by Severity (1 = Negligible to 5 = Fatal/Catastrophic). The resulting score (1 to 25) categorises risk into Low (1–6), Medium (8–12), or High (15–25). Tasks must only proceed once control measures reduce residual risk to Low or Medium.',
      },
    ],
    relatedLinks: [
      {
        title: 'How to Write a Risk Assessment',
        description: 'Practical walkthrough with concrete hazard matrices and plantroom case studies.',
        href: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment',
        badge: 'How-To',
        category: 'Compliance',
      },
      {
        title: 'What Are RAMS?',
        description: 'Understand how risk assessments pair with method statements in commercial FM packages.',
        href: '/contractor-resources/rams/what-are-rams',
        badge: 'Overview',
        category: 'RAMS',
      },
      {
        title: 'Commercial Maintenance Network',
        description: 'Join the EntireFM approved contractor network (£95/yr annual membership).',
        href: '/contractors/commercial-maintenance',
        badge: 'Network',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment': {
    path: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment',
    metaTitle: 'How to Write a Risk Assessment: Step-by-Step UK Guide | EntireFM',
    metaDescription:
      'Step-by-step contractor guide to writing a risk assessment. Learn how to identify hazards, calculate risk matrix scores, apply control measures, and record findings.',
    h1: 'How to Write a Risk Assessment',
    subtitle: 'A practical, structured guide for commercial engineering and maintenance contractors.',
    eyebrow: 'PRACTICAL APPLICATION // RISK METHODOLOGY',
    intro:
      'Creating an audit-ready risk assessment is a practical skill that protects your workforce and satisfies commercial client compliance. Follow this structured 5-stage guide to identify hazards, calculate initial and residual risk scores, and apply proportionate control measures.',
    heroImage: {
      src: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
      alt: 'Building engineer conducting risk assessment survey and thermal hazard inspection',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'Risk Assessments', url: '/contractor-resources/risk-assessments' },
      { name: 'How to Write a Risk Assessment', url: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment' },
    ],
    quickSummary: {
      question: 'How do you structure and write a commercial risk assessment?',
      summary:
        'Writing a risk assessment involves: (1) Identifying workplace hazards across physical tasks, tools, and environments, (2) Deciding who might be harmed and how, (3) Evaluating the initial risk score, (4) Specifying control measures using the ERICPD hierarchy to achieve a safe residual risk score, and (5) Recording findings and reviewing regularly.',
      keyPoints: [
        'Stage 1: Walk the site or inspect drawings to spot genuine hazards',
        'Stage 2: Specify all affected persons (engineers, tenants, cleaners, public)',
        'Stage 3: Calculate Initial Risk = Likelihood × Severity',
        'Stage 4: Apply controls until Residual Risk reaches acceptable levels',
      ],
      readTime: '8 min read',
    },
    steps: {
      eyebrow: '5-STAGE METHODOLOGY',
      title: 'HSE-Aligned 5-Step Risk Assessment Workflow',
      subtitle: 'The statutory UK standard for commercial contractor risk management.',
      columns: 1,
      items: [
        {
          step: 1,
          title: 'Identify the Hazards',
          description:
            'Observe the physical workspace and task: electrical shock, working at height, moving machinery parts, manual handling, noise, vibration, slips/trips, and hazardous chemical substances (COSHH).',
          badge: 'Stage 1',
        },
        {
          step: 2,
          title: 'Decide Who Might Be Harmed and How',
          description:
            'Identify everyone exposed: site engineers, apprentices, building occupants, maintenance staff, visitors, and members of the public. Specify the exact mechanism of injury (e.g. burns from hot water calorifiers, crushing from dropped loads).',
          badge: 'Stage 2',
        },
        {
          step: 3,
          title: 'Evaluate the Risks & Decide on Controls (ERICPD)',
          description:
            'Score the initial unmitigated risk using a 5x5 matrix. Then apply the ERICPD hierarchy: Eliminate the hazard, Reduce exposure, Isolate from people, implement Technical controls, supply PPE, and enforce site Discipline.',
          badge: 'Stage 3',
        },
        {
          step: 4,
          title: 'Record Your Significant Findings & Calculate Residual Risk',
          description:
            'Document the agreed control measures on your risk assessment form. Re-score the hazard to verify that the Residual Risk score has dropped to an acceptable (Low/Medium) level before work begins.',
          badge: 'Stage 4',
        },
        {
          step: 5,
          title: 'Review Your Assessment & Update if Necessary',
          description:
            'Review the assessment when site conditions change, new machinery is introduced, new personnel arrive, or after any incident or near miss. For ongoing contracts, review at least annually.',
          badge: 'Stage 5',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the ERICPD hierarchy of controls?',
        answer:
          'ERICPD is the established hierarchy for controlling health and safety risks: Eliminate the hazard completely; Reduce the hazard through safer substitutes; Isolate workers from the hazard (e.g. barriers or enclosures); Control through engineering means; PPE (Personal Protective Equipment) as a last line of defence; and Discipline (training, supervision, and procedures).',
      },
      {
        question: 'What is the difference between Initial Risk and Residual Risk?',
        answer:
          'Initial Risk is the level of risk before any safety measures are applied. Residual Risk is the remaining risk after all specified control measures (guards, PPE, training, isolations) have been implemented. Work must never commence if the residual risk remains high.',
      },
    ],
    relatedLinks: [
      {
        title: 'What Is a Risk Assessment?',
        description: 'Core concepts, legal requirements, and hazard definitions.',
        href: '/contractor-resources/risk-assessments/what-is-a-risk-assessment',
        badge: 'Core Guide',
        category: 'Compliance',
      },
      {
        title: 'How to Write RAMS',
        description: 'Combine your risk assessment with a sequential method statement.',
        href: '/contractor-resources/rams/how-to-write-rams',
        badge: 'How-To',
        category: 'RAMS',
      },
      {
        title: 'EntireFM Contractor Network',
        description: 'Apply to join our approved contractor panel (£95/yr annual membership).',
        href: '/contractors/join',
        badge: 'Apply',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/facilities-management/what-is-facilities-management': {
    path: '/contractor-resources/facilities-management/what-is-facilities-management',
    metaTitle: 'What Is Facilities Management? Guide for Contractors | EntireFM',
    metaDescription:
      'What is facilities management (FM)? UK contractor guide to hard FM, soft FM, planned maintenance, compliance, CAFM systems, and contractor opportunities.',
    h1: 'What Is Facilities Management?',
    subtitle: 'Understanding the UK FM sector from the trade contractor and engineering perspective.',
    eyebrow: 'SECTOR INTELLIGENCE // FACILITIES MANAGEMENT 101',
    intro:
      'Facilities Management (FM) is the multidisciplinary practice of ensuring commercial buildings, estates, and engineering assets operate safely, efficiently, and compliantly. Learn how the FM sector functions, the difference between Hard and Soft FM, and where specialist contractors fit into the commercial supply chain.',
    heroImage: {
      src: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
      alt: 'Modern UK commercial facilities management estate and corporate business park',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'Facilities Management', url: '/contractor-resources/facilities-management' },
      { name: 'What Is Facilities Management?', url: '/contractor-resources/facilities-management/what-is-facilities-management' },
    ],
    quickSummary: {
      question: 'What is Facilities Management and how is it structured?',
      summary:
        'Facilities Management encompasses the management and maintenance of commercial physical assets and workplaces. It is broadly divided into Hard FM (physical engineering, HVAC, electrical, mechanical, plumbing, and fabric) and Soft FM (cleaning, security, grounds, and waste). Approved contractors deliver the technical specialist services under FM management.',
      keyPoints: [
        'Hard FM: M&E engineering, asset compliance, HVAC, plantrooms, and statutory testing',
        'Soft FM: Commercial cleaning, security, pest control, grounds maintenance, and hygiene',
        'Driven by CAFM (Computer-Aided Facility Management) and strict SLAs',
        'Approved trade contractors provide the specialized boots-on-the-ground capability',
      ],
      readTime: '7 min read',
    },
    comparison: {
      eyebrow: 'SECTOR STRUCTURE',
      title: 'Hard FM vs Soft FM: Key Distinctions',
      subtitle: 'Where different trade disciplines operate within facilities management.',
      colAName: 'Hard FM (Engineering & Fabric)',
      colBName: 'Soft FM (Environmental & Services)',
      rows: [
        {
          attribute: 'Core Definition',
          colA: 'Physical, structural, and engineering systems built into the property',
          colB: 'Services that support building users and maintain clean, secure spaces',
          highlight: true,
        },
        {
          attribute: 'Typical Trades',
          colA: 'Electrical, HVAC, Mechanical, Plumbing, Gas, Roofing, Fabric, Drainage',
          colB: 'Commercial Cleaning, Security, Grounds Maintenance, Pest Control, Waste',
        },
        {
          attribute: 'Compliance Driver',
          colA: 'Statutory legal obligations (Electricity at Work, Gas Safety, F-Gas, L8)',
          colB: 'Contractual SLAs, hygiene standards, COSHH, and visual presentation',
        },
        {
          attribute: 'Maintenance Focus',
          colA: 'Planned Preventative Maintenance (SFG20), asset lifecycle, reactive repairs',
          colB: 'Daily or periodic scheduled operational routines and response services',
        },
      ],
    },
    faqs: [
      {
        question: 'What role do subcontractors play in facilities management?',
        answer:
          'Even large national FM providers cannot economically employ every specialized trade in every UK post code. They rely on vetted, approved regional contractor networks to execute specialized tasks: chiller overhauls, EICRs, fire damper testing, water chlorination, drainage jetting, and emergency reactive call-outs.',
      },
      {
        question: 'What is a CAFM system?',
        answer:
          'CAFM stands for Computer-Aided Facility Management. It is a software platform (such as EntireCAFM) used by facilities managers to log jobs, dispatch work orders, monitor contractor attendance, store compliance certificates, and approve invoices.',
      },
      {
        question: 'What is SFG20 in facilities management?',
        answer:
          'SFG20 is the definitive UK industry standard for building maintenance specifications developed by BESA (Building Engineering Services Association). It provides standardized maintenance schedules, frequencies, and statutory task lists for commercial building assets.',
      },
    ],
    relatedLinks: [
      {
        title: 'What Is PPM in Facilities Management?',
        description: 'Explore Planned Preventative Maintenance schedules, asset registers, and contractor tasks.',
        href: '/contractor-resources/facilities-management/what-is-ppm',
        badge: 'PPM Guide',
        category: 'PPM',
      },
      {
        title: 'How to Get Facilities Management Work',
        description: 'Practical guide to breaking into the commercial FM supply chain.',
        href: '/contractor-resources/winning-work/how-to-get-facilities-management-work',
        badge: 'Procurement',
        category: 'Commercial',
      },
      {
        title: 'Join EntireFM Contractor Network',
        description: 'Connect your business with commercial FM opportunities across the UK (£95/yr).',
        href: '/contractors/join',
        badge: 'Apply',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/facilities-management/what-is-ppm': {
    path: '/contractor-resources/facilities-management/what-is-ppm',
    metaTitle: 'What Is PPM in Facilities Management? Contractor Guide | EntireFM',
    metaDescription:
      'What is PPM? Planned Preventative Maintenance explained for UK contractors. SFG20 standards, statutory compliance tasks, asset care, and commercial contracts.',
    h1: 'What Is PPM in Facilities Management?',
    subtitle: 'Scheduled maintenance, statutory compliance, and asset lifecycle care in practical contractor terms.',
    eyebrow: 'MAINTENANCE STRATEGY // PLANNED ASSET CARE',
    intro:
      'Planned Preventative Maintenance (PPM) forms the majority of commercial facilities management expenditure. Learn what PPM is, how it differs from reactive maintenance, what SFG20 schedules demand, and how approved contractors deliver planned maintenance packages.',
    heroImage: {
      src: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
      alt: 'Commercial HVAC engineer carrying out scheduled planned preventative maintenance (PPM) on air conditioning cassette',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'Facilities Management', url: '/contractor-resources/facilities-management' },
      { name: 'What Is PPM?', url: '/contractor-resources/facilities-management/what-is-ppm' },
    ],
    quickSummary: {
      question: 'What is PPM and why is it critical in commercial property?',
      summary:
        'PPM (Planned Preventative Maintenance) is the proactive, scheduled servicing of building engineering systems at set calendar or running-hour intervals. It ensures statutory compliance (e.g. emergency lights, gas safety, water hygiene), prevents unexpected equipment breakdown, reduces operational disruption, and extends asset lifespan.',
      keyPoints: [
        'PPM = Planned Preventative Maintenance (scheduled proactive servicing)',
        'Statutory tasks: Fixed wire testing, fire alarms, F-Gas checks, emergency lighting, legionella testing',
        'Industry benchmark: SFG20 standard task schedules',
        'Offers predictable, recurring revenue streams for trade engineering contractors',
      ],
      readTime: '7 min read',
    },
    comparison: {
      eyebrow: 'MAINTENANCE APPROACHES',
      title: 'PPM vs Reactive Maintenance: Comparison',
      subtitle: 'Understanding the commercial dynamics between planned care and emergency call-outs.',
      colAName: 'Planned Maintenance (PPM)',
      colBName: 'Reactive Maintenance (Call-Outs)',
      rows: [
        {
          attribute: 'Scheduling',
          colA: 'Pre-scheduled calendar dates (monthly, quarterly, bi-annually, annually)',
          colB: 'Unscheduled; triggered by unexpected equipment failure or tenant reports',
          highlight: true,
        },
        {
          attribute: 'Statutory Compliance',
          colA: 'Fulfills legal duty of care and generates audit-ready compliance certificates',
          colB: 'Restores function after an incident, breakdown, or safety failure',
        },
        {
          attribute: 'Budgeting & Cost',
          colA: 'Predictable contract pricing; planned labour allocation and parts procurement',
          colB: 'Variable cost; emergency call-out premiums, expediting fees, downtime impact',
        },
        {
          attribute: 'Asset Impact',
          colA: 'Maximises design lifespan and preserves energy efficiency',
          colB: 'Accelerates wear and tear; catastrophic failure risks wider building damage',
        },
      ],
    },
    faqs: [
      {
        question: 'What are the main statutory PPM tasks in a commercial building?',
        answer:
          'Key statutory PPM tasks include: Fixed Wire Testing (EICR - 5 yearly/annual percentage), Emergency Lighting testing (monthly flick test / annual 3-hour drain test), Fire Alarm servicing (quarterly/weekly test), Gas Safety inspections (annual CP12/CP15), Legionella water temperature monitoring (monthly/quarterly), and F-Gas refrigerant leak inspections (frequency dictated by CO2 equivalent charge).',
      },
      {
        question: 'Why do contractors prefer PPM contracts over reactive-only work?',
        answer:
          'PPM contracts provide stable, predictable recurring cash flow, planned engineer scheduling, and strong client relationships. Furthermore, planned inspections often uncover legitimate remedial repair opportunities that lead to approved quotation work.',
      },
      {
        question: 'How does EntireFM package PPM for network contractors?',
        answer:
          'EntireFM schedules annual maintenance plans across our client portfolios. We bundle relevant mechanical, electrical, and building services tasks into scheduled service visits, matching work orders to approved contractors based on their certified trade skills and location.',
      },
    ],
    relatedLinks: [
      {
        title: 'Commercial Maintenance Contractor Network',
        description: 'Join our panel of approved commercial maintenance engineering specialists.',
        href: '/contractors/commercial-maintenance',
        badge: 'Network',
        category: 'Commercial',
      },
      {
        title: 'What Is Facilities Management?',
        description: 'Comprehensive overview of hard and soft FM services from the contractor perspective.',
        href: '/contractor-resources/facilities-management/what-is-facilities-management',
        badge: 'Overview',
        category: 'Guide',
      },
      {
        title: 'Apply to Join EntireFM',
        description: 'Submit your contractor profile for commercial FM opportunities (£95 annual membership).',
        href: '/contractors/join',
        badge: '£95/yr',
        category: 'Commercial',
      },
    ],
  },

  '/contractor-resources/winning-work/how-to-get-facilities-management-work': {
    path: '/contractor-resources/winning-work/how-to-get-facilities-management-work',
    metaTitle: 'How to Get Facilities Management Work: Contractor Guide | EntireFM',
    metaDescription:
      'How to get facilities management work as a UK contractor. Explore approved panels, managing agents, tendering, SSIP compliance, and joining EntireFM.',
    h1: 'How to Get Facilities Management Work',
    subtitle: 'A strategic guide for trade and engineering contractors wanting to win commercial FM contracts.',
    eyebrow: 'BUSINESS GROWTH // COMMERCIAL WORK ACQUISITION',
    intro:
      'Winning work in the UK facilities management sector requires more than good trade skills. It demands the right compliance accreditations, insurance limits, professional response systems, and understanding of how FM companies procure subcontractors. Learn how to position your business for commercial FM success.',
    heroImage: {
      src: '/images/editorial/entirefm-client-review-2000w.webp',
      alt: 'Facilities management commercial review meeting discussing contractor panel procurement',
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contractor Resources', url: '/contractor-resources' },
      { name: 'Winning Work', url: '/contractor-resources/winning-work' },
      { name: 'How to Get Facilities Management Work', url: '/contractor-resources/winning-work/how-to-get-facilities-management-work' },
    ],
    quickSummary: {
      question: 'What are the main steps to secure facilities management contracts?',
      summary:
        'To get facilities management work: (1) Secure core compliance prerequisites (minimum £5m Public Liability, SSIP scheme such as CHAS or SafeContractor), (2) Obtain statutory trade accreditations (NICEIC, Gas Safe, Refcom), (3) Define your geographical operating corridor and response times, (4) Apply to established approved contractor panels like EntireFM, and (5) Deliver flawless digital reporting and RAMS on early assignments to earn preferred supplier status.',
      keyPoints: [
        'Prerequisites: £5m+ Public Liability insurance + SSIP accreditation (CHAS/SafeContractor/Constructionline)',
        'Three routes: Direct client tenders, commercial managing agents, and approved FM contractor panels',
        'Approved panels provide the fastest route to live commercial work orders for SMEs',
        'Consistency, clear digital reporting, and responsiveness generate repeat assignments',
      ],
      readTime: '10 min read',
    },
    steps: {
      eyebrow: 'CONTRACTOR SUCCESS ROADMAP',
      title: '6 Key Steps to Securing Facilities Management Work',
      subtitle: 'From baseline compliance to preferred supplier status.',
      columns: 2,
      items: [
        {
          step: 1,
          title: 'Establish Your Compliance Baseline',
          description:
            'Ensure your Public Liability covers £5m (preferably £10m), Employers Liability covers £10m, and your business holds valid SSIP accreditation (CHAS, SafeContractor, or Constructionline).',
          badge: 'Compliance',
        },
        {
          step: 2,
          title: 'Verify Trade Competencies',
          description:
            'Validate all relevant technical registrations: NICEIC/NAPIT for electrical, Gas Safe for commercial gas, Refcom for HVAC/refrigeration, and CSCS cards for all site engineers.',
          badge: 'Competency',
        },
        {
          step: 3,
          title: 'Prepare Audit-Ready RAMS',
          description:
            'Develop a professional, site-tailored Risk Assessment and Method Statement template system. FM companies will not issue work orders without compliant RAMS.',
          badge: 'Safety',
        },
        {
          step: 4,
          title: 'Join Established Approved Contractor Panels',
          description:
            'Apply to join managed contractor networks such as EntireFM. This bypasses long public tender cycles and puts your business directly in front of active job dispatchers.',
          badge: 'Intake',
        },
        {
          step: 5,
          title: 'Demonstrate Digital Reporting Discipline',
          description:
            'Provide rapid, transparent service sheets with asset numbers, serial codes, part numbers, and clear before/after photographs for every completed assignment.',
          badge: 'Delivery',
        },
        {
          step: 6,
          title: 'Build Repeat Preferred Status',
          description:
            'Consistently meeting response times and submitting clean, accurate invoices referencing Purchase Orders elevates your business to preferred status for scheduled PPM packages.',
          badge: 'Growth',
        },
      ],
    },
    faqs: [
      {
        question: 'Why is SSIP accreditation so important for FM work?',
        answer:
          'Safety Schemes in Procurement (SSIP) is supported by the HSE and provides mutual recognition across major UK safety schemes (CHAS, SafeContractor, SMAS, Constructionline). FM companies require SSIP because it verifies that your health & safety policy, risk assessments, training, and accident records meet UK CDM 2015 stage 1 standards.',
      },
      {
        question: 'What insurance levels do commercial FM clients expect?',
        answer:
          'The standard commercial threshold is £5,000,000 Public Liability. For high-value commercial offices, critical data centres, and industrial manufacturing plants, £10,000,000 Public Liability and £10,000,000 Employers Liability are commonly required.',
      },
      {
        question: 'How do I join the EntireFM Contractor Network?',
        answer:
          'You can apply online via our qualification intake at /contractors/join. The annual membership is £95 + VAT, payable upon application submission. Your profile, declared territories, and compliance certificates are desk-reviewed for approval onto our active contractor panel.',
      },
    ],
    relatedLinks: [
      {
        title: 'Join the EntireFM Contractor Network',
        description: 'Complete the contractor qualification intake (£95 annual membership).',
        href: '/contractors/join',
        badge: 'Apply Now',
        category: 'Commercial',
      },
      {
        title: 'Find Facilities Management Work',
        description: 'An overview of FM procurement routes and approved panels.',
        href: '/contractors/find-work',
        badge: 'Overview',
        category: 'Commercial',
      },
      {
        title: 'Approved Contractor Network UK',
        description: 'Learn why tier-1 FM organisations use approved supplier networks.',
        href: '/contractors/approved-contractor-network',
        badge: 'Standards',
        category: 'Commercial',
      },
    ],
  },
};
