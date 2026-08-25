/**
 * ENTIREFM SUPPLIER DATA CONSTANTS
 * ================================
 * Pure TypeScript data module without 'use client' boundary.
 * Safe for server components, metadata, schema.org generators, and client components.
 */

export interface FAQEntry {
  question: string;
  answer: string;
  category: 'onboarding' | 'compliance' | 'commercial' | 'delivery';
}

export const SUPPLIER_FAQS: FAQEntry[] = [
  {
    category: 'onboarding',
    question: 'Who can become an EntireFM supplier or partner?',
    answer: 'We partner with established national service providers, high-quality regional specialist SMEs, independent trade contractors, OEMs, equipment manufacturers, and technology providers across the UK. Requirements are proportionate to the trade and operational risk.',
  },
  {
    category: 'onboarding',
    question: 'Do you work with regional SMEs and independent contractors?',
    answer: 'Yes. Regional SMEs and independent specialist contractors form an essential pillar of our national operating model. We deliberately match works against regional proximity and specialist craft rather than mandating nationwide infrastructure for all suppliers.',
  },
  {
    category: 'onboarding',
    question: 'Do I need national coverage to work with EntireFM?',
    answer: 'No. While we maintain national frameworks, we actively onboard regional specialists covering specific counties, cities (such as London, Manchester, Birmingham, Sheffield, Leeds), or defined postal zones.',
  },
  {
    category: 'compliance',
    question: 'What insurance levels are required for approved status?',
    answer: 'Standard commercial requirements are £5,000,000 (£5M) Public Liability and £10,000,000 (£10M) Employers Liability (where staff are employed). Professional Indemnity insurance is required for design, surveying, and specialist consultancy disciplines. Higher limits (such as £10M or £20M PL) may apply for critical infrastructure and high-risk environments.',
  },
  {
    category: 'compliance',
    question: 'Is SSIP accreditation mandatory for all suppliers?',
    answer: 'SSIP accreditation (such as SafeContractor, CHAS, Constructionline, or SMAS) is our preferred benchmark for health and safety management. Where a smaller specialist contractor does not hold SSIP, we conduct an equivalent Stage 1 Health & Safety due diligence audit covering RAMS, training records, and incident histories.',
  },
  {
    category: 'compliance',
    question: 'What technical trade accreditations are required?',
    answer: 'Accreditations depend strictly on the trade discipline: Gas Safe for commercial gas and heating; NICEIC, NAPIT, or ECA for electrical; F-Gas / REFCOM for air conditioning and refrigeration; IRATA for rope access; IPAF / PASMA for powered access; BAFE / FIA for fire alarms; and LCA for water hygiene.',
  },
  {
    category: 'onboarding',
    question: 'How long does the supplier vetting and onboarding process take?',
    answer: 'Initial application review is completed within 3 to 5 business days. Once supporting insurance certificates, trade tickets, and commercial bank details are verified, your supplier profile is activated for work order allocation.',
  },
  {
    category: 'commercial',
    question: 'Can equipment manufacturers (OEMs) and technology companies partner with EntireFM?',
    answer: 'Yes. We actively collaborate with OEMs, IoT sensor manufacturers, drone survey companies, AI predictive maintenance platforms, and energy technology providers to deploy innovations across our managed estate portfolio.',
  },
  {
    category: 'delivery',
    question: 'How are suppliers selected and allocated work orders?',
    answer: 'Work orders are matched using four parameters: trade discipline, geographic proximity, live SLA availability, and verified compliance status. High-performing suppliers in our Preferred Partner tier receive priority allocation.',
  },
  {
    category: 'delivery',
    question: 'How are work orders and site instructions issued?',
    answer: 'Work instructions are issued digitally through EntireCAFM. Orders include asset metadata, SFG20 task schedules, access permits, site contact details, SLA response windows, and required evidence checklists.',
  },
  {
    category: 'delivery',
    question: 'What evidence is required upon job completion?',
    answer: 'Depending on task type, completion requires time-stamped photographs (before/after), calibrated instrument readings, asset condition grading, and signed technical service sheets or statutory certificates uploaded directly via our digital mobile workflow.',
  },
  {
    category: 'commercial',
    question: 'How are supplier invoices processed and paid?',
    answer: 'Invoices are matched against pre-authorised work orders and validated task completions. We operate clear commercial credit terms with transparent electronic payment runs upon completion sign-off.',
  },
  {
    category: 'commercial',
    question: 'How does a contractor become a Preferred or Strategic Partner?',
    answer: 'Suppliers maintaining consistent SLA compliance, high first-time fix rates, transparent communication, and flawless compliance records are reviewed quarterly for elevation to Preferred Partner status, unlocking multi-site frameworks and regional exclusivity.',
  },
  {
    category: 'compliance',
    question: 'Can subcontractors be used by EntireFM suppliers?',
    answer: 'Second-tier subcontracting is only permitted with prior written approval from EntireFM. Any secondary subcontractor must undergo the identical assurance and vetting process as our direct suppliers.',
  },
  {
    category: 'compliance',
    question: 'Can suppliers update expiring insurance and compliance documents?',
    answer: 'Yes. Our supply chain desk tracks policy expiry dates and requests updated renewals prior to lapse to ensure zero disruption in work order eligibility.',
  },
];

export interface DisciplineCategory {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  trades: string[];
  standards: string[];
  href: string;
}

export const CAPABILITY_DISCIPLINES: DisciplineCategory[] = [
  {
    id: 'engineering',
    title: 'Hard FM & Engineering',
    eyebrow: 'M&E // CRITICAL SYSTEMS',
    description: 'Precision mechanical, electrical, HVAC and building management systems maintenance for high-load commercial and industrial property.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM electrical engineer conducting switchgear testing in commercial switchroom',
    trades: ['Electrical Systems (NICEIC)', 'Mechanical & Heating (Gas Safe)', 'HVAC & Chillers (F-Gas / REFCOM)', 'BMS Controls & Telemetry', 'Standby Generators & UPS', 'Pumps & Pressurisation'],
    standards: ['BS 7671 Fixed Wire', 'SFG20 Maintenance Standards', 'Gas Safety Regulations', 'F-Gas Containment Register'],
    href: '/mechanical-electrical',
  },
  {
    id: 'fabric',
    title: 'Building Fabric & Envelope',
    eyebrow: 'STRUCTURAL // FABRIC MAINTENANCE',
    description: 'Structural integrity, weatherproofing, industrial roofing, commercial glazing, and proactive building fabric asset preservation.',
    imageSrc: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    imageAlt: 'EntireFM building surveyors inspecting commercial rooftop and envelope structure',
    trades: ['Commercial Roofing & Membrane Repairs', 'Architectural Glazing & Curtain Walling', 'Industrial Doors & Dock Levellers', 'Specialist Flooring & Screeds', 'Drainage & Civils', 'General Building Remedials'],
    standards: ['Building Regulations Compliance', 'NFRC Roofing Standards', 'DDA / Accessibility Standards', 'BS EN 12604 Doors'],
    href: '/building-maintenance',
  },
  {
    id: 'access',
    title: 'Specialist Access & Height',
    eyebrow: 'IRATA // HIGH-LEVEL ACCESS',
    description: 'Controlled high-level maintenance, façade inspections, BMU cradle operations, and rope access engineering across complex structures.',
    imageSrc: '/images/services/working-at-height/hero-rope-access.png',
    imageAlt: 'IRATA rope access specialist conducting high-level commercial façade maintenance',
    trades: ['IRATA Industrial Rope Access', 'Building Maintenance Units (BMU)', 'MEWP & Spider Boom Access (IPAF)', 'Fall Arrest & Latchway Certification', 'Confined Space Engineering', 'Specialist High-Level Façade Remedials'],
    standards: ['Work at Height Regulations 2005', 'BS 7985 Rope Access Code', 'LOLER 1998 Lifting Operations', 'IRATA International Framework'],
    href: '/working-at-height-rope-access-bmu',
  },
  {
    id: 'fire-life-safety',
    title: 'Fire & Life Safety Systems',
    eyebrow: 'STATUTORY // LIFE SAFETY',
    description: 'Fully accredited fire detection, emergency lighting, automated suppression, smoke ventilation, and certified fire door maintenance.',
    imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
    imageAlt: 'EntireFM safety technician inspecting commercial fire and life safety interface panel',
    trades: ['Addressable Fire Alarms (BAFE / FIA)', 'Emergency Lighting BS 5266', 'Sprinkler & Water Mist Systems', 'Gaseous Fire Suppression', 'Fire Door Inspection & Remedials', 'Dry & Wet Riser Statutory Testing'],
    standards: ['Regulatory Reform (Fire Safety) Order 2005', 'BS 5839 Fire Detection', 'BS 9999 Code of Practice', 'FIRAS / BM TRADA Fire Doors'],
    href: '/fire-emergency-systems',
  },
  {
    id: 'security',
    title: 'Security & Access Control',
    eyebrow: 'PROTECTION // ACCESS INTELLIGENCE',
    description: 'Enterprise access systems, IP CCTV networks, perimeter intruder detection, automated barrier controls, and SIA security presence.',
    imageSrc: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    imageAlt: 'EntireFM corporate security access point and identity control system',
    trades: ['Enterprise IP CCTV & Video Analytics', 'Biometric & RFID Access Control', 'Intruder Detection & Monitored Alarms', 'Automated Gates & Security Turnstiles', 'SIA Manned Guarding & Mobile Patrols', 'Keyholding & Alarm Response'],
    standards: ['SIA Approved Contractor Scheme', 'NSI Gold / SSAIB Standards', 'BS 7858 Security Screening', 'Data Protection Act / GDPR Video'],
    href: '/security-services',
  },
  {
    id: 'cleaning-environmental',
    title: 'Cleaning & Environmental',
    eyebrow: 'HYGIENE // ENVIRONMENTAL MANAGEMENT',
    description: 'Commercial contract cleaning, industrial decontamination, high-level sanitisation, grounds maintenance, and sustainable waste streams.',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM commercial hygiene and corporate facility presentation',
    trades: ['Commercial Contract Office Cleaning', 'Industrial & Process Plant Cleaning', 'High-Level Specialist Decontamination', 'Grounds & Winter Gritting', 'Commercial Waste & Recycling', 'Washroom & Hygiene Services'],
    standards: ['BICSc Cleaning Standards', 'COSHH Safety Governance', 'ISO 14001 Environmental Management', 'Duty of Care Waste Regulations'],
    href: '/cleaning-services',
  },
  {
    id: 'compliance-inspection',
    title: 'Compliance & Statutory Inspection',
    eyebrow: 'STATUTORY // AUDITABLE ASSURANCE',
    description: 'Independent statutory inspections, water hygiene Legionella monitoring, asbestos surveying, pressure systems, and digital compliance archiving.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM statutory compliance technician conducting periodic technical inspection',
    trades: ['Fixed Wire Testing (EICR) & PAT', 'Water Hygiene & Legionella ACOP L8', 'Asbestos Management Surveys', 'Pressure Systems PSSR 2000', 'LEV Statutory Examination', 'F-Gas Containment & Audit'],
    standards: ['HSE Approved Codes of Practice', 'ACOP L8 / HSG274 Water Safety', 'Control of Asbestos Regs 2012', 'PSSR 2000 Statutory Regs'],
    href: '/compliance',
  },
  {
    id: 'technology-innovation',
    title: 'Technology & Asset Intelligence',
    eyebrow: 'CONNECTED // IOT & SENSORS',
    description: 'Integrating IoT vibration sensors, thermal drone surveys, energy telemetry, CAFM integrations, and predictive maintenance algorithms.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM engineering directors reviewing live building telemetry and sensor diagnostics',
    trades: ['IoT Vibration & Temp Sensors', 'Thermal Aerial Drone Surveys', 'Sub-metering & Energy Monitoring', 'CAFM API & Sensor Integrations', 'Predictive Maintenance Failure Models', 'Digital Reality Capture & 3D Twins'],
    standards: ['ISO 27001 Information Security', 'SFG20 Dynamic Frequencies', 'Open BEMS Protocol Standards', 'Cyber Essentials Plus'],
    href: '/services/drone-services',
  },
];
