export type FindCategory =
  | 'ALL'
  | 'JOBS'
  | 'CONTRACTORS'
  | 'SUPPLIERS'
  | 'PROFESSIONALS'
  | 'TENDERS'
  | 'FRAMEWORKS'
  | 'OPPORTUNITIES';

export interface ContractorListing {
  id: string;
  name: string;
  trade: string;
  tradeSlug: string;
  description: string;
  regions: string[];
  sectors: string[];
  statutoryAccreditations: string[];
  emergencyAvailability: boolean;
  plannedPpm: boolean;
  reactiveRepairs: boolean;
  membershipTier: 'Contractor Partner' | 'Approved Network Member' | 'Commercial Participant';
  verificationStatus: 'VERIFIED' | 'SELF_DECLARED';
  insuranceVerified: boolean;
  insuranceLevel: string;
  websiteUrl: string;
  profileUrl: string;
  complianceConnectionUrl?: string;
}

export interface SupplierListing {
  id: string;
  name: string;
  category: 'Equipment & Plant' | 'FM Software & CAFM' | 'Consumables & Materials' | 'Specialist Systems' | 'Water Treatment';
  description: string;
  products: string[];
  deliveryCoverage: string;
  sectors: string[];
  membershipTier: 'Supplier Partner' | 'Commercial Participant';
  verificationStatus: 'VERIFIED' | 'SELF_DECLARED';
  websiteUrl: string;
  applyUrl: string;
}

export interface ProfessionalListing {
  id: string;
  name: string;
  practice: string;
  discipline: 'Building Surveying' | 'M&E Consulting' | 'Fire Engineering' | 'Health & Safety' | 'Energy & BREEAM' | 'Project Management';
  professionalBody: string; // e.g. RICS, CIBSE, IFE, IOSH
  description: string;
  locations: string[];
  sectors: string[];
  statutoryFocus: string;
  verificationStatus: 'VERIFIED' | 'SELF_DECLARED';
  contactRoute: string;
}

export interface TenderListing {
  id: string;
  title: string;
  buyer: string;
  procurementRoute: 'Find a Tender Service' | 'Contracts Finder' | 'Crown Commercial Service' | 'Commercial Private Tender';
  sector: string;
  location: string;
  deadlineDate: string;
  estimatedValue?: string;
  contractDuration: string;
  sourceUrl: string;
  significanceSummary: string;
  serviceCategory: string;
}

export interface FrameworkListing {
  id: string;
  frameworkName: string;
  contractingAuthority: string;
  lotName: string;
  geographicScope: string;
  servicesCovered: string[];
  status: 'OPEN_FOR_SUBMISSION' | 'ACTIVE_SUPPLIERS' | 'RE-TENDER_UPCOMING';
  expiryDate: string;
  source: string;
  eligibilityNotes: string;
}

export interface JobPreview {
  id: string;
  slug: string;
  title: string;
  employer: string;
  discipline: string;
  location: string;
  locationType: 'on_site' | 'hybrid' | 'remote';
  employmentType: 'Permanent' | 'Contract' | 'Temporary';
  salaryGuide?: string;
  sector: string;
  postedDate: string;
  isVerifiedEmployer: boolean;
}

// ── 01. AUTHENTIC 10-TRADE CONTRACTORS (LINKED TO PLATFORM) ───────
export const CONTRACTOR_DIRECTORY: ContractorListing[] = [
  {
    id: 'cont-elec-01',
    name: 'EntireFM National Electrical Engineering',
    trade: 'Electrical Contracting & Switchgear',
    tradeSlug: 'electrical',
    description: 'Commercial electrical installation, statutory EICR testing, distribution board thermal surveys, EV charging infrastructure, and remedial rewiring.',
    regions: ['Midlands', 'London & South East', 'North West', 'Yorkshire'],
    sectors: ['Commercial Offices', 'Industrial & Logistics', 'Healthcare', 'Retail'],
    statutoryAccreditations: ['NICEIC Approved Contractor', 'ECA Registered', 'BS 7671:2018+A3:2024'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Contractor Partner',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/electrical',
    profileUrl: '/contractors/electrical',
    complianceConnectionUrl: '/lobby/check#electrical',
  },
  {
    id: 'cont-hvac-02',
    name: 'EntireFM Commercial HVAC & Chiller Services',
    trade: 'HVAC, Refrigeration & Chillers',
    tradeSlug: 'hvac',
    description: 'Commercial chiller overhauls, VRF/VRV maintenance, F-Gas statutory leak checks, AHU ventilation balancing, and heat pump retrofits.',
    regions: ['North West', 'Midlands', 'London & South East', 'Yorkshire'],
    sectors: ['Corporate Commercial', 'Data Centres', 'Educational Facilities', 'Hospitality'],
    statutoryAccreditations: ['Refcom F-Gas Elite', 'BESA Member', 'SafeContractor'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Contractor Partner',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/hvac',
    profileUrl: '/contractors/hvac',
    complianceConnectionUrl: '/lobby/check#hvac',
  },
  {
    id: 'cont-fire-03',
    name: 'EntireFM Fire & Life Safety Systems',
    trade: 'Fire Safety & Life Safety Systems',
    tradeSlug: 'fire-security',
    description: 'BS 5839 fire alarm servicing, emergency lighting 3-hour discharge tests, fire door gap inspections, smoke damper testing, and riser audits.',
    regions: ['National UK Coverage', 'London', 'Midlands', 'North'],
    sectors: ['Multi-Occupancy Residential', 'Commercial Offices', 'Student Accommodation'],
    statutoryAccreditations: ['BAFE SP203-1 Fire Alarms', 'FIA Member', 'FIRAS Certified'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Contractor Partner',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/fire-security',
    profileUrl: '/contractors/fire-security',
    complianceConnectionUrl: '/lobby/check#fire',
  },
  {
    id: 'cont-plumb-04',
    name: 'EntireFM Mechanical, Plumbing & Water Hygiene',
    trade: 'Plumbing, Water Hygiene & Gas Services',
    tradeSlug: 'plumbing',
    description: 'Commercial gas boiler servicing, ACOP L8 Legionella monitoring, booster pump overhauls, TMV servicing, and calorifier clean/disinfection.',
    regions: ['Midlands', 'North West', 'Yorkshire', 'London'],
    sectors: ['Commercial Offices', 'Manufacturing', 'Hospitality', 'Public Sector'],
    statutoryAccreditations: ['Gas Safe Register (Commercial)', 'Legionella Control Association (LCA)', 'CIPHE'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Contractor Partner',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/plumbing',
    profileUrl: '/contractors/plumbing',
    complianceConnectionUrl: '/lobby/check#water',
  },
  {
    id: 'cont-roof-05',
    name: 'EntireFM Commercial Roofing & Building Envelope',
    trade: 'Roofing, Guttering & Building Envelopes',
    tradeSlug: 'roofing',
    description: 'CAA-certified thermal drone roof surveys, liquid plastics flat roofing repairs, rainwater downpipe jetting, and rope access facade inspections.',
    regions: ['National UK Coverage', 'North West', 'Midlands', 'London'],
    sectors: ['Industrial Warehousing', 'Commercial Headquarters', 'Retail Parks'],
    statutoryAccreditations: ['NFRC Registered', 'SafeContractor', 'IRATA Rope Access'],
    emergencyAvailability: false,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Approved Network Member',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/roofing',
    profileUrl: '/contractors/roofing',
    complianceConnectionUrl: '/lobby/check',
  },
  {
    id: 'cont-clean-06',
    name: 'EntireFM Commercial Cleaning & Soft Services',
    trade: 'Commercial Cleaning, Hygiene & Waste',
    tradeSlug: 'cleaning',
    description: 'Corporate daily office cleaning, high-level window abseiling, washroom hygiene consumables management, and post-construction sparkle cleans.',
    regions: ['London & South East', 'Midlands', 'North West', 'Yorkshire'],
    sectors: ['Corporate Commercial', 'Educational Campuses', 'Healthcare Demises'],
    statutoryAccreditations: ['BICSc Accredited', 'ISO 9001 / ISO 14001', 'SafeContractor'],
    emergencyAvailability: false,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Approved Network Member',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £10M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/cleaning',
    profileUrl: '/contractors/cleaning',
    complianceConnectionUrl: '/lobby/check',
  },
  {
    id: 'cont-grounds-07',
    name: 'EntireFM Grounds Maintenance & Winter Gritting',
    trade: 'Grounds Maintenance, Arboriculture & Gritting',
    tradeSlug: 'grounds-maintenance',
    description: 'Contracted winter precautionary gritting with Met Office road surface telemetry, grass cutting, weed eradication, and tree safety audits.',
    regions: ['Midlands', 'North West', 'Yorkshire', 'London'],
    sectors: ['Business Parks', 'Distribution Logistics', 'Corporate Campuses'],
    statutoryAccreditations: ['BALI Member', 'SafeContractor', 'NPTC Qualified'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: false,
    membershipTier: 'Approved Network Member',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/grounds-maintenance',
    profileUrl: '/contractors/grounds-maintenance',
    complianceConnectionUrl: '/lobby/check',
  },
  {
    id: 'cont-drain-08',
    name: 'EntireFM Drainage & Interceptor Services',
    trade: 'Drainage, CCTV Surveys & Interceptors',
    tradeSlug: 'drainage',
    description: 'High-pressure water jetting, full CCTV sonar drainage surveys with WinCan reporting, interceptor waste disposal, and pump station maintenance.',
    regions: ['Midlands', 'North West', 'London', 'Yorkshire'],
    sectors: ['Industrial & Logistics', 'Commercial Property', 'Retail Centres'],
    statutoryAccreditations: ['Water Industry Approved', 'Environment Agency Waste Carrier', 'SafeContractor'],
    emergencyAvailability: true,
    plannedPpm: true,
    reactiveRepairs: true,
    membershipTier: 'Approved Network Member',
    verificationStatus: 'VERIFIED',
    insuranceVerified: true,
    insuranceLevel: '£10M Employers Liability / £5M Public Liability',
    websiteUrl: 'https://www.entirefm.com/contractors/drainage',
    profileUrl: '/contractors/drainage',
    complianceConnectionUrl: '/lobby/check',
  },
];

// ── 02. SUPPLIERS & SUPPLY CHAIN PARTNERS ─────────────────────────
export const SUPPLIER_DIRECTORY: SupplierListing[] = [
  {
    id: 'sup-01',
    name: 'National Plant & Pump Distribution Ltd',
    category: 'Equipment & Plant',
    description: 'Commercial circulation pumps, booster sets, pressurisation units, and replacement heat exchangers with next-day UK site delivery.',
    products: ['Centrifugal In-Line Pumps', 'Twin Booster Sets', 'Expansion Vessels', 'Gasketed Heat Exchangers'],
    deliveryCoverage: 'UK Mainland Next Day',
    sectors: ['Commercial Offices', 'Manufacturing', 'District Energy'],
    membershipTier: 'Supplier Partner',
    verificationStatus: 'VERIFIED',
    websiteUrl: 'https://www.entirefm.com/suppliers/partner-network',
    applyUrl: '/suppliers/apply',
  },
  {
    id: 'sup-02',
    name: 'FM Analytics & Sensor Telemetry Systems',
    category: 'FM Software & CAFM',
    description: 'LoRaWAN wireless environmental sensors, water pipe sentinel temperature loggers, and CAFM asset telemetry gateway integrations.',
    products: ['Legionella Pipe Temperature Sensors', 'Indoor Air Quality Monitors', 'Vibration Vibration Sensors', 'Open API Gateways'],
    deliveryCoverage: 'National Delivery & Remote Deployment',
    sectors: ['Commercial Property', 'Healthcare', 'Higher Education'],
    membershipTier: 'Supplier Partner',
    verificationStatus: 'VERIFIED',
    websiteUrl: 'https://www.entirefm.com/suppliers/innovation',
    applyUrl: '/suppliers/apply',
  },
  {
    id: 'sup-03',
    name: 'Eco-Hygiene Commercial Consumables Supply',
    category: 'Consumables & Materials',
    description: 'Zero-landfill washroom paper products, EU Ecolabel certified concentrated cleaning chemicals, and touchless dispensing systems.',
    products: ['FSC Certified Hand Towels', 'Biological Drain Cleaners', 'Microfibre Systems', 'Chemical Dosing Units'],
    deliveryCoverage: 'National Scheduled Route Delivery',
    sectors: ['Commercial Offices', 'Retail Parks', 'Public Sector'],
    membershipTier: 'Commercial Participant',
    verificationStatus: 'SELF_DECLARED',
    websiteUrl: 'https://www.entirefm.com/suppliers/sustainability',
    applyUrl: '/suppliers/apply',
  },
];

// ── 03. INDEPENDENT PROFESSIONALS & CONSULTANTS ───────────────────
export const PROFESSIONAL_DIRECTORY: ProfessionalListing[] = [
  {
    id: 'prof-01',
    name: 'Chartered Building Surveying Consultancy Practice',
    practice: 'Estates Advisory & Dilapidations Associates',
    discipline: 'Building Surveying',
    professionalBody: 'Royal Institution of Chartered Surveyors (RICS)',
    description: 'Commercial dilapidations defense, planned preventative maintenance condition surveys, asset lifecycle modeling, and lease exit negotiations.',
    locations: ['London', 'Birmingham', 'Manchester', 'Leeds'],
    sectors: ['Grade-A Commercial Offices', 'Institutional Portfolios', 'Retail Assets'],
    statutoryFocus: 'RICS Guidance Notes / Party Wall Act / Defect Analysis',
    verificationStatus: 'VERIFIED',
    contactRoute: '/lobby/connect',
  },
  {
    id: 'prof-02',
    name: 'Building Services & Decarbonisation Engineering',
    practice: 'CIBSE Low Carbon Consulting Engineers',
    discipline: 'M&E Consulting',
    professionalBody: 'Chartered Institution of Building Services Engineers (CIBSE)',
    description: 'Commercial heat pump conversion feasibility, electrical load capacity audits for EV/solar, TM44 air conditioning inspections, and thermal modeling.',
    locations: ['London', 'Bristol', 'Midlands', 'Manchester'],
    sectors: ['Commercial Headquarters', 'Industrial Facilities', 'Universities'],
    statutoryFocus: 'CIBSE Guides A, B, F, M / EPBD Regulations / Part L',
    verificationStatus: 'VERIFIED',
    contactRoute: '/lobby/connect',
  },
  {
    id: 'prof-03',
    name: 'Independent Fire Safety & Building Safety Act Advisory',
    practice: 'Fire Engineering Risk Strategies Ltd',
    discipline: 'Fire Engineering',
    professionalBody: 'Institution of Fire Engineers (IFE) & Warringtonfire Register',
    description: 'Type 1–4 Fire Risk Assessments, Building Safety Act 2022 Part 4 Safety Case preparation, compartmentation surveys, and external wall reviews.',
    locations: ['National UK Coverage'],
    sectors: ['Higher-Risk Buildings (HRBs)', 'Mixed-Use Developments', 'Hospitals'],
    statutoryFocus: 'Building Safety Act 2022 / Fire Safety (England) Regs / PAS 79',
    verificationStatus: 'VERIFIED',
    contactRoute: '/lobby/connect',
  },
];

// ── 04. SOURCED TENDERS & PUBLIC SECTOR PROCUREMENT ───────────────
export const TENDER_DIRECTORY: TenderListing[] = [
  {
    id: 'tnd-01',
    title: 'Hard Facilities Management, M&E PPM & Statutory Compliance Term Contract',
    buyer: 'Department for Transport / National Regional Estate',
    procurementRoute: 'Find a Tender Service',
    sector: 'Central Government Public Sector',
    location: 'West Midlands & South West',
    deadlineDate: '18 September 2026',
    estimatedValue: '£14,200,000',
    contractDuration: '4 Years (with optional 1+1 extension)',
    sourceUrl: 'https://www.find-tender.service.gov.uk',
    significanceSummary: 'Unified mechanical, electrical, water hygiene, and fire alarm maintenance across 38 operational facilities.',
    serviceCategory: 'Hard FM & M&E',
  },
  {
    id: 'tnd-02',
    title: 'Cleanroom M&E Servicing & Laboratory Chiller Planned Maintenance',
    buyer: 'North West NHS Health & Innovation Trust',
    procurementRoute: 'Contracts Finder',
    sector: 'Healthcare & Science',
    location: 'Greater Manchester',
    deadlineDate: '24 September 2026',
    estimatedValue: '£3,850,000',
    contractDuration: '3 Years Fixed',
    sourceUrl: 'https://www.contractsfinder.service.gov.uk',
    significanceSummary: 'High-resilience 2-hour emergency attendance SLA for critical medical laboratory plant.',
    serviceCategory: 'HVAC & Critical Engineering',
  },
  {
    id: 'tnd-03',
    title: 'Total Facilities Management (TFM) Framework Appointment',
    buyer: 'Crown Commercial Service (CCS RM6264 Lot 1b)',
    procurementRoute: 'Crown Commercial Service',
    sector: 'Multi-Departmental UK Government',
    location: 'National UK Regions',
    deadlineDate: '02 October 2026',
    estimatedValue: 'Multi-Supplier Framework Banding',
    contractDuration: '4 Years',
    sourceUrl: 'https://www.crowncommercial.gov.uk',
    significanceSummary: 'Statutory compliance assurance, social value reporting, and net-zero estate transition scope.',
    serviceCategory: 'Total FM (Hard & Soft)',
  },
];

// ── 05. FRAMEWORKS ────────────────────────────────────────────────
export const FRAMEWORK_DIRECTORY: FrameworkListing[] = [
  {
    id: 'fw-01',
    frameworkName: 'Crown Commercial Service Facilities Management & Workplace Services',
    contractingAuthority: 'Crown Commercial Service (CCS RM6264)',
    lotName: 'Lot 1b: Hard Facilities Management Services (Estate Value £10M+)',
    geographicScope: 'Great Britain (England, Wales, Scotland)',
    servicesCovered: ['M&E Planned Maintenance', 'Water Hygiene', 'Fire Safety', 'Fabric Maintenance', 'Refrigerant Compliance'],
    status: 'ACTIVE_SUPPLIERS',
    expiryDate: 'December 2027',
    source: 'Crown Commercial Service Official Register',
    eligibilityNotes: 'Requires ISO 9001, ISO 14001, ISO 45001, verified Cyber Essentials Plus, and audited Carbon Reduction Plan.',
  },
  {
    id: 'fw-02',
    frameworkName: 'NHS Shared Business Services Hard FM Framework',
    contractingAuthority: 'NHS SBS',
    lotName: 'Lot 3: Specialist Building Services & HVAC Engineering',
    geographicScope: 'England & Wales Health Trusts',
    servicesCovered: ['Chiller Maintenance', 'Medical Gas Systems', 'Boiler Replacement', 'Emergency Electrical Distribution'],
    status: 'ACTIVE_SUPPLIERS',
    expiryDate: 'November 2026',
    source: 'NHS SBS Procurement Portal',
    eligibilityNotes: 'Mandatory HTM compliance records, enhanced DBS engineer clearance, and 24/7/365 telemetry monitoring.',
  },
];

// ── 06. LIVE JOBS PREVIEW (ALIGNED TO REAL DATABASE TAXONOMY) ─────
export const SAMPLE_FM_JOBS: JobPreview[] = [
  {
    id: 'job-01',
    slug: 'commercial-hvac-chiller-technician-manchester',
    title: 'Commercial HVAC & Chiller Specialist Engineer',
    employer: 'EntireFM Technical Directorate',
    discipline: 'M&E Engineering',
    location: 'Manchester & North West',
    locationType: 'on_site',
    employmentType: 'Permanent',
    salaryGuide: '£46,000 – £52,000 + Standby & Vehicle',
    sector: 'Commercial Offices & Critical Plant',
    postedDate: '28 Aug 2026',
    isVerifiedEmployer: true,
  },
  {
    id: 'job-02',
    slug: 'senior-statutory-compliance-manager-birmingham',
    title: 'Senior Statutory Compliance & Building Safety Manager',
    employer: 'Midlands Institutional Property Trust',
    discipline: 'Compliance & Safety',
    location: 'Birmingham & Hybrid',
    locationType: 'hybrid',
    employmentType: 'Permanent',
    salaryGuide: '£58,000 – £65,000 + Benefits',
    sector: 'Commercial Multi-Let Estates',
    postedDate: '26 Aug 2026',
    isVerifiedEmployer: false,
  },
  {
    id: 'job-03',
    slug: 'facilities-manager-corporate-headquarters-london',
    title: 'Facilities Operations Manager · Corporate HQ',
    employer: 'Global Professional Services Client',
    discipline: 'Facilities Management',
    location: 'London EC2 (Bishopsgate)',
    locationType: 'on_site',
    employmentType: 'Permanent',
    salaryGuide: '£52,000 – £56,000',
    sector: 'Corporate Financial & Legal',
    postedDate: '24 Aug 2026',
    isVerifiedEmployer: false,
  },
  {
    id: 'job-04',
    slug: 'contract-mobilisation-project-manager',
    title: 'FM Mobilisation & Transition Project Manager',
    employer: 'National Facilities Operations Group',
    discipline: 'Project Management',
    location: 'Leeds / Sheffield / Regional Mobile',
    locationType: 'hybrid',
    employmentType: 'Contract',
    salaryGuide: '£380 – £440 Day Rate',
    sector: 'Public & Private Estate Transitions',
    postedDate: '22 Aug 2026',
    isVerifiedEmployer: true,
  },
];

// ── 07. GUIDED SUPPLIER MATCH QUESTIONS ───────────────────────────
export interface SupplierMatchQuestion {
  step: number;
  question: string;
  field: string;
  options: { label: string; value: string }[];
}

export const SUPPLIER_MATCH_QUESTIONS: SupplierMatchQuestion[] = [
  {
    step: 1,
    question: 'What service discipline do you require?',
    field: 'service',
    options: [
      { label: 'Electrical & Switchgear (EICR)', value: 'electrical' },
      { label: 'HVAC, Chillers & Refrigerant', value: 'hvac' },
      { label: 'Fire Safety & Life Safety Systems', value: 'fire-security' },
      { label: 'Mechanical, Plumbing & Water Hygiene', value: 'plumbing' },
      { label: 'Commercial Roofing & Drone Surveys', value: 'roofing' },
      { label: 'Commercial Cleaning & Soft Services', value: 'cleaning' },
      { label: 'Grounds Maintenance & Winter Gritting', value: 'grounds-maintenance' },
      { label: 'Drainage & Interceptor Clearing', value: 'drainage' },
    ],
  },
  {
    step: 2,
    question: 'Where is the commercial building located?',
    field: 'region',
    options: [
      { label: 'London & South East', value: 'London & South East' },
      { label: 'Midlands (Birmingham, Nottingham, Derby)', value: 'Midlands' },
      { label: 'North West (Manchester, Liverpool)', value: 'North West' },
      { label: 'Yorkshire (Leeds, Sheffield)', value: 'Yorkshire' },
      { label: 'National UK Portfolio', value: 'National UK Coverage' },
    ],
  },
  {
    step: 3,
    question: 'What is the commercial building type?',
    field: 'buildingType',
    options: [
      { label: 'Multi-Let Commercial Office', value: 'Commercial Offices' },
      { label: 'Industrial Warehouse & Logistics Hub', value: 'Industrial & Logistics' },
      { label: 'Healthcare, Laboratory & Life Sciences', value: 'Healthcare' },
      { label: 'Retail Park or Shopping Centre', value: 'Retail' },
    ],
  },
  {
    step: 4,
    question: 'Is this for planned maintenance or reactive attendance?',
    field: 'deliveryMode',
    options: [
      { label: 'Contracted Planned Preventive Maintenance (PPM)', value: 'ppm' },
      { label: '24/7 Priority Emergency Attendance', value: 'emergency' },
      { label: 'Single Remedial Repair or Project', value: 'reactive' },
    ],
  },
];
