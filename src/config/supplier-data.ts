/**
 * CANONICAL PURE DATA MODULE FOR SUPPLIERS & PARTNERS
 * ===================================================
 * Single source of truth for public supplier pricing, capability disciplines,
 * and commercial transparency FAQ dataset.
 */

export interface FAQEntry {
  id?: string;
  category: string;
  question: string;
  answer: string;
}

export type SupplierFaqItem = FAQEntry;

export interface CanonicalPublicProduct {
  id: string;
  name: string;
  priceGbp: number;
  vatRate: number;
  billingFrequency: 'ANNUAL' | 'ONE_OFF';
  displayPrice: string;
  description: string;
}

export const CANONICAL_PUBLIC_PRICING: Record<string, CanonicalPublicProduct> = {
  REGISTERED: {
    id: 'prod-mem-reg',
    name: 'Registered Supplier',
    priceGbp: 0,
    vatRate: 0.20,
    billingFrequency: 'ANNUAL',
    displayPrice: '£0',
    description: 'Initial supplier registration and application profile.',
  },
  SUPPLIER_NETWORK_MEMBER: {
    id: 'prod-mem-verified',
    name: 'Supplier Network Membership',
    priceGbp: 495,
    vatRate: 0.20,
    billingFrequency: 'ANNUAL',
    displayPrice: '£495 + VAT/year',
    description: 'Commercial network membership and digital portal services.',
  },
  NETWORK_PARTNER: {
    id: 'prod-mem-partner',
    name: 'Network Partner Membership',
    priceGbp: 1250,
    vatRate: 0.20,
    billingFrequency: 'ANNUAL',
    displayPrice: '£1,250 + VAT/year',
    description: 'Expanded commercial network participation and technical forum benefits.',
  },
  INITIAL_ASSURANCE_REVIEW: {
    id: 'prod-fee-assurance',
    name: 'Initial Supplier Assurance Review',
    priceGbp: 350,
    vatRate: 0.20,
    billingFrequency: 'ONE_OFF',
    displayPrice: '£350 + VAT one-off',
    description: 'Administration and independent review of applicable company, H&S, and trade qualifications.',
  },
};

export interface DisciplineCategory {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  trades: string[];
  standards: string[];
}

export const CAPABILITY_DISCIPLINES: DisciplineCategory[] = [
  {
    id: 'engineering',
    slug: 'engineering',
    title: 'Mechanical & Electrical Engineering',
    eyebrow: 'CORE HARD FM',
    description: 'Statutory compliance, planned preventative maintenance, and emergency response for critical building services, plant rooms, and life-safety systems.',
    imageSrc: '/editorial/03-the-spine-liverpool.webp',
    imageAlt: 'Mechanical and electrical plant room engineering',
    trades: [
      'Commercial Gas & Heating (Gas Safe)',
      'HVAC, Chillers & VRV Systems (REFCOM / F-Gas)',
      'Electrical Distribution & Periodic Inspection (NICEIC / ECA)',
      'Water Hygiene, Chlorination & Legionella Control (L8)',
      'Fire Alarm, Suppression & Life Safety (BAFE)',
      'Standby Generators, UPS & Critical Power'
    ],
    standards: [
      'SFG20 Maintenance Specifications',
      'BS 7671 IET Wiring Regulations (18th Edition)',
      'HSE ACoP L8 & HSG274 Compliance',
      'Gas Safety (Installation and Use) Regulations 1998'
    ]
  },
  {
    id: 'fabric',
    slug: 'fabric',
    title: 'Building Fabric & Specialist Access',
    eyebrow: 'FABRIC & ENVELOPE',
    description: 'External envelope maintenance, architectural repairs, roof integrity, and working-at-height solutions across complex commercial buildings.',
    imageSrc: '/editorial/05-manchester-civil-justice-centre.webp',
    imageAlt: 'Commercial building facade and fabric maintenance',
    trades: [
      'Industrial Rope Access (IRATA Certified)',
      'Building Maintenance Units (BMU) & Cradle Testing',
      'Commercial Glazing & High-Level Curtain Walling',
      'Roofing, Waterproofing & Membrane Inspections',
      'Joinery, Fire Door Maintenance & Compartmentation',
      'Grounds Maintenance, Landscaping & Winter Gritting'
    ],
    standards: [
      'IRATA International Code of Practice (ICOP)',
      'BS EN 1808 (Safety Requirements for Suspended Access Equipment)',
      'Working at Height Regulations 2005',
      'BM TRADA Q-Mark Fire Door Maintenance'
    ]
  },
  {
    id: 'soft-services',
    slug: 'soft-services',
    title: 'Commercial Cleaning & Soft Services',
    eyebrow: 'FACILITY HYGIENE',
    description: 'High-standard workplace hygiene, specialized industrial cleaning, and waste management delivering safe, presentable environments.',
    imageSrc: '/editorial/01-albert-bridge-house-manchester.webp',
    imageAlt: 'Commercial office and industrial cleaning operations',
    trades: [
      'Daily Commercial Office & Industrial Cleaning',
      'High-Level Factory & Warehouse Deep Cleans',
      'Kitchen Extract & Ductwork Grease Cleaning (TR19)',
      'Window Cleaning (Reach & Wash and Abseil)',
      'Waste Management, Confidential Shredding & Recycling',
      'Hygiene Services, Washrooms & Consumables'
    ],
    standards: [
      'BICSc (British Institute of Cleaning Science) Standards',
      'BESA TR19 Specification for Kitchen Extract Systems',
      'COSHH Assessment & Chemical Safety Guidelines',
      'ISO 14001 Environmental Management Systems'
    ]
  },
  {
    id: 'technology',
    slug: 'technology',
    title: 'Technology, IoT & Smart Building Systems',
    eyebrow: 'DIGITAL FM & ASSET TELEMETRY',
    description: 'Integration of IoT telemetry, AI anomaly detection, drone surveying, and building analytics into live managed property portfolios.',
    imageSrc: '/editorial/02-st-peters-square-manchester.webp',
    imageAlt: 'Smart building telemetry and IoT sensors',
    trades: [
      'BMS & Building Controls Optimisation',
      'IoT Environmental, IAQ & Energy Sub-metering Feeds',
      'Drone Aerial Surveying & Thermal Imaging (CAA Certified)',
      'CAFM Integration & Real-Time Open Data Connectors',
      'Automated Asset Telemetry & Predictive Maintenance'
    ],
    standards: [
      'ISO 27001 Information Security Management',
      'CAA Operational Authorisation for Drone Operations',
      'Cyber Essentials Plus Certified Partner Standards',
      'BACnet & Open Protocol Telemetry Compatibility'
    ]
  }
];

export const SUPPLIER_FAQS: SupplierFaqItem[] = [
  // 1. GENERAL
  {
    id: 'faq-01',
    category: 'onboarding',
    question: 'Who can join the EntireFM Supplier Network?',
    answer: 'We welcome capable local SMEs, regional contractors, national service providers, specialist engineering firms, equipment manufacturers, OEMs, and technology businesses who share our commitment to safety, competence, responsiveness, and operational transparency.',
  },
  {
    id: 'faq-02',
    category: 'onboarding',
    question: 'Do you work with SMEs?',
    answer: 'Yes, extensively. High-quality local and regional SMEs form a vital part of EntireFM’s service delivery across the UK. We do not design our network exclusively for giant national contractors.',
  },
  {
    id: 'faq-03',
    category: 'onboarding',
    question: 'Do I need national coverage to apply?',
    answer: 'No. EntireFM operates on a scoped approval model. If you are an exceptional commercial contractor covering a single city, postcode cluster, or county, we value and approve your regional expertise.',
  },
  {
    id: 'faq-04',
    category: 'onboarding',
    question: 'Can a sole trader or small specialist company apply?',
    answer: 'Yes. Specialist sole practitioners and boutique contractors (e.g. niche controls, water treatment, specialist access) can apply provided they hold the necessary insurances, technical competency qualifications, and safe working practices for their trade.',
  },
  {
    id: 'faq-05',
    category: 'onboarding',
    question: 'What is the EntireFM Partner Network?',
    answer: 'The EntireFM Partner Network is a professionally managed facilities management ecosystem that connects verified contractors, specialists, OEMs, and technology companies with structured commercial opportunities, digital job management tools, and collaborative industry events.',
  },

  // 2. ASSURANCE & SCOPED APPROVALS
  {
    id: 'faq-06',
    category: 'compliance',
    question: 'What is an Approved or Verified Supplier?',
    answer: 'A Verified or Approved Supplier is an organisation that has successfully completed the applicable EntireFM supplier assurance process for defined services and, where relevant, defined geographies. Verification is an assurance outcome and cannot be purchased.',
  },
  {
    id: 'faq-07',
    category: 'compliance',
    question: 'What is scoped supplier approval?',
    answer: 'Approval at EntireFM is specific, not blanket. A supplier is approved for defined service disciplines (e.g. HVAC & Chillers) and defined geographic areas (e.g. Greater Manchester) where their competency and capacity are verified, rather than an unverified open pass.',
  },
  {
    id: 'faq-08',
    category: 'compliance',
    question: 'Can I be approved for only one service or one region?',
    answer: 'Yes. Scoped approvals ensure that you are only asked to deliver work within your proven technical capabilities and geographic boundaries.',
  },
  {
    id: 'faq-09',
    category: 'compliance',
    question: 'What insurance do I need?',
    answer: 'Requirements are risk-proportionate. Standard commercial requirements typically include Public Liability (minimum £5m for high/medium risk engineering, £2m for selected soft services), Employers Liability (£10m where staff are employed), and Professional Indemnity where design or technical consulting applies.',
  },
  {
    id: 'faq-10',
    category: 'compliance',
    question: 'Which accreditations are required?',
    answer: 'Accreditations are trade-specific. For example, gas engineers require Gas Safe; HVAC technicians require F-Gas/REFCOM; electrical contractors require NICEIC/ECA; rope access teams require IRATA. Soft services require BICSc, and health & safety is supported by SSIP accreditation (CHAS, SafeContractor, Constructionline).',
  },
  {
    id: 'faq-11',
    category: 'compliance',
    question: 'Do I need every accreditation listed on the website?',
    answer: 'No. Requirements are strictly tailored to your specific service discipline, operational risk level, and work environment.',
  },
  {
    id: 'faq-12',
    category: 'compliance',
    question: 'How long does onboarding take?',
    answer: 'Once all required compliance documents, insurances, and competency evidence are submitted via the Supplier Portal, technical review is typically completed within 3 to 5 business days.',
  },
  {
    id: 'faq-13',
    category: 'compliance',
    question: 'How will I know what information is required?',
    answer: 'Upon registration, our assurance engine automatically generates a dynamic, tailored requirement checklist in your Supplier Portal based on your specific trade and operating profile.',
  },
  {
    id: 'faq-14',
    category: 'compliance',
    question: 'What happens if one of my documents expires?',
    answer: 'Our automated radar notifies you 90, 60, 30, and 7 days prior to document expiry. If a critical document (such as Public Liability insurance) expires without renewal, a temporary compliance hold automatically applies to prevent unsafe dispatch until the renewed certificate is uploaded.',
  },
  {
    id: 'faq-15',
    category: 'compliance',
    question: 'Can I subcontract work?',
    answer: 'Second-tier subcontracting is restricted unless explicitly declared and approved during technical assurance. EntireFM enforces strict supply chain traceability for client security and health & safety.',
  },

  // 3. MEMBERSHIP & FEES
  {
    id: 'faq-16',
    category: 'commercial',
    question: 'Is supplier registration free?',
    answer: 'Yes. Registering your company interest, creating an initial supplier profile, and exploring network requirements is completely free (£0). Registration does not constitute supplier approval.',
  },
  {
    id: 'faq-17',
    category: 'commercial',
    question: 'What is Supplier Network Membership?',
    answer: 'Supplier Network Membership (£495 + VAT/year) is a commercial Partner Network product that supports applicable digital portal services, compliance administration, document vault storage, and network communications. Holding membership does not itself make an organisation an Approved Supplier.',
  },
  {
    id: 'faq-18',
    category: 'commercial',
    question: 'Why is there an annual membership fee?',
    answer: 'Maintaining a secure, auditable, and continuously monitored supply chain requires ongoing administration, digital compliance infrastructure, dedicated technical review desks, and automated notification systems. Applicable fees directly support these operational systems.',
  },
  {
    id: 'faq-19',
    category: 'commercial',
    question: 'What is the Initial Supplier Assurance Review fee (£350 + VAT)?',
    answer: 'The Initial Supplier Assurance Review fee contributes towards the administration and review of the applicable supplier-assurance requirements generated for your organisation. Requirements vary according to services, risk, capability and client needs. Payment does not guarantee successful approval.',
  },
  {
    id: 'faq-20',
    category: 'commercial',
    question: 'What does the supplier fee pay for?',
    answer: 'Fees pay for digital supplier portal infrastructure, dedicated compliance review officers, automated document verification, insurance renewal tracking, secure bank detail verification, and partner communications.',
  },
  {
    id: 'faq-21',
    category: 'commercial',
    question: 'Does paying a fee guarantee supplier approval?',
    answer: 'No. Supplier approval is strictly based on technical competence, verified accreditation, valid insurance, and safe working practices. Paying a fee does not bypass technical scrutiny.',
  },
  {
    id: 'faq-22',
    category: 'commercial',
    question: 'Does paying guarantee work?',
    answer: 'No. Registration, membership, assurance fees, event attendance, and sponsorship do NOT guarantee work allocation. Work opportunities are awarded based on technical capability, operational SLA performance, geographical proximity, client requirements, and competitive commercial pricing.',
  },
  {
    id: 'faq-23',
    category: 'commercial',
    question: 'Does paying more mean I receive more work?',
    answer: 'No. EntireFM operates a non-negotiable procurement firewall. Commercial membership tiers (e.g. £1,250 Network Partner) provide enhanced networking, public profile listings, and additional user seats, but provide ZERO advantage in operational work allocation algorithms.',
  },
  {
    id: 'faq-24',
    category: 'commercial',
    question: 'Can I pay to become a Preferred Supplier?',
    answer: 'No. Preferred Supplier status cannot be purchased. It is earned through sustained high operational performance, first-time fix excellence, SLA adherence, and reliable evidence submission.',
  },
  {
    id: 'faq-25',
    category: 'commercial',
    question: 'Can I pay to become a Strategic Partner?',
    answer: 'No. Strategic Partner status is an invitation-only executive relationship based on significant national scale, deep technical integration, or critical OEM support.',
  },
  {
    id: 'faq-26',
    category: 'commercial',
    question: 'What is the difference between membership and approval?',
    answer: 'Approval is a technical, safety, and compliance gate (authorising you to perform work safely). Membership is a commercial subscription supporting digital portal services, profile maintenance, and network participation.',
  },

  // 4. PAYMENTS & COMMERCIAL SEPARATION
  {
    id: 'faq-27',
    category: 'commercial',
    question: 'How are suppliers paid for completed operational work?',
    answer: 'Work completed for EntireFM is managed through the applicable work order, purchase order, approval and invoicing process. Partner Network fees and supplier operational payments are accounted for separately under agreed commercial payment terms.',
  },
  {
    id: 'faq-28',
    category: 'commercial',
    question: 'Are Partner Network fees deducted from money EntireFM owes me for operational work?',
    answer: 'No. EntireFM maintains complete separation between payables (what we pay you for operational work) and receivables (membership/event fees). Unrelated balances are not netted without explicit written agreement.',
  },
  {
    id: 'faq-29',
    category: 'commercial',
    question: 'Can I pay the assurance review fee by card or invoice?',
    answer: 'Yes. The Initial Supplier Assurance Review fee can be paid securely by card (via Stripe) or by VAT invoice/BACS bank transfer. Both options require payment before your application is formally submitted for EntireFM assurance review. Invoices are due immediately — this is not a credit facility. Applications are formally submitted for review once payment has been received and confirmed.',
  },
  {
    id: 'faq-30',
    category: 'commercial',
    question: 'Where can I see my commercial invoices and membership status?',
    answer: 'All commercial subscriptions, invoices, payment receipts, and renewal dates are clearly visible in the Billing section of your Supplier Portal.',
  },

  // 5. OPERATIONS & PERFORMANCE
  {
    id: 'faq-31',
    category: 'delivery',
    question: 'How are suppliers considered for work once approved?',
    answer: 'When a work order arises, our allocation engine evaluates hard compliance gates (scoped service, region, active status) and calculates suitability based on performance history, engineer availability, and travel distance. Authorised EntireFM controllers review candidates and make the award decision.',
  },
  {
    id: 'faq-32',
    category: 'delivery',
    question: 'Are suppliers performance monitored?',
    answer: 'Yes. We track objective operational metrics: on-time SLA attendance, first-time fix rate, service report accuracy, invoice matching, and client feedback. These are transparently visible in your portal.',
  },
  {
    id: 'faq-33',
    category: 'delivery',
    question: 'What is the Supplier Academy?',
    answer: 'The Supplier Academy provides practical guidance, portal onboarding modules, RAMS standards, and technical briefings to help our supply chain deliver exemplary facilities management.',
  },

  // 6. EVENTS & INDUSTRY PARTNERS
  {
    id: 'faq-34',
    category: 'delivery',
    question: 'Can equipment manufacturers and OEMs join?',
    answer: 'Yes. Equipment manufacturers and OEMs partner with EntireFM for technical training, warranty-backed maintenance ecosystems, product demonstrations, and asset intelligence collaboration.',
  },
  {
    id: 'faq-35',
    category: 'delivery',
    question: 'Can technology companies participate in live property pilots?',
    answer: 'EntireFM may explore appropriate technology trials or pilots with industry partners where there is a genuine operational use case and the required technical, contractual, and client approvals are in place. Participation in the Industry Partner programme does not guarantee a pilot.',
  },
  {
    id: 'faq-36',
    category: 'commercial',
    question: 'Can I sponsor an EntireFM supplier event?',
    answer: 'Yes. We offer commercial sponsorship packages for Meet the Manufacturer sessions, technical roundtables, and regional supplier forums.',
  },
  {
    id: 'faq-37',
    category: 'onboarding',
    question: 'What are "Meet the Buyer" sessions?',
    answer: 'Meet the Buyer events allow suppliers to understand EntireFM’s upcoming procurement themes, client property challenges, and standards in a transparent forum. Attendance does not constitute an automatic contract award.',
  }
];

export interface CanonicalAccreditationScheme {
  name: string;
  category: 'SSIP' | 'ISO' | 'TRADE' | 'SPECIALIST';
  requiresIdentifier: boolean;
  identifierLabel: string;
  placeholder: string;
}

export const CANONICAL_ACCREDITATIONS: CanonicalAccreditationScheme[] = [
  {
    name: 'SafeContractor (SSIP)',
    category: 'SSIP',
    requiresIdentifier: true,
    identifierLabel: 'SafeContractor Membership / Supplier Number',
    placeholder: 'e.g. SC-009882',
  },
  {
    name: 'CHAS Accredited',
    category: 'SSIP',
    requiresIdentifier: true,
    identifierLabel: 'CHAS Membership / Supplier Number',
    placeholder: 'e.g. CHAS-889921',
  },
  {
    name: 'Constructionline (Gold / Silver)',
    category: 'SSIP',
    requiresIdentifier: true,
    identifierLabel: 'Constructionline Membership Number',
    placeholder: 'e.g. CL-104928',
  },
  {
    name: 'SMAS Worksafe',
    category: 'SSIP',
    requiresIdentifier: true,
    identifierLabel: 'SMAS Certificate / Membership Number',
    placeholder: 'e.g. SMAS-55421',
  },
  {
    name: 'Altius Assured',
    category: 'SSIP',
    requiresIdentifier: true,
    identifierLabel: 'Altius Supplier Number',
    placeholder: 'e.g. ALT-99214',
  },
  {
    name: 'ISO 9001 Quality Management',
    category: 'ISO',
    requiresIdentifier: true,
    identifierLabel: 'ISO 9001 Certificate Number',
    placeholder: 'e.g. CERT-9001-2024',
  },
  {
    name: 'ISO 14001 Environmental',
    category: 'ISO',
    requiresIdentifier: true,
    identifierLabel: 'ISO 14001 Certificate Number',
    placeholder: 'e.g. CERT-14001-2024',
  },
  {
    name: 'ISO 45001 Health & Safety',
    category: 'ISO',
    requiresIdentifier: true,
    identifierLabel: 'ISO 45001 Certificate Number',
    placeholder: 'e.g. CERT-45001-2024',
  },
  {
    name: 'Gas Safe Register',
    category: 'TRADE',
    requiresIdentifier: true,
    identifierLabel: 'Gas Safe Registration Number',
    placeholder: 'e.g. 654321',
  },
  {
    name: 'NICEIC Approved Contractor',
    category: 'TRADE',
    requiresIdentifier: true,
    identifierLabel: 'NICEIC Registration Number',
    placeholder: 'e.g. 045678',
  },
  {
    name: 'REFCOM / F-Gas Company Certified',
    category: 'TRADE',
    requiresIdentifier: true,
    identifierLabel: 'REFCOM / F-Gas Company Number',
    placeholder: 'e.g. REF101234',
  },
  {
    name: 'IRATA Member Company',
    category: 'SPECIALIST',
    requiresIdentifier: true,
    identifierLabel: 'IRATA Membership Number',
    placeholder: 'e.g. IRATA-7788',
  },
  {
    name: 'BAFE Registered',
    category: 'TRADE',
    requiresIdentifier: true,
    identifierLabel: 'BAFE Registration Number',
    placeholder: 'e.g. SP203-10023',
  },
  {
    name: 'SIA Approved Contractor Scheme',
    category: 'SPECIALIST',
    requiresIdentifier: true,
    identifierLabel: 'SIA ACS Registration Number',
    placeholder: 'e.g. SIA-ACS-4491',
  },
  {
    name: 'BICSc Corporate Member',
    category: 'TRADE',
    requiresIdentifier: true,
    identifierLabel: 'BICSc Membership Number',
    placeholder: 'e.g. BICSC-99882',
  },
];


// ============================================================================
// HIERARCHICAL SUPPLIER SERVICE TAXONOMY
// ============================================================================

export interface TaxonomyTradeItem {
  id: string;
  name: string;
  category: string;
  requiresAccreditation?: string;
  suggestedQualifications?: string[];
  highRisk?: boolean;
}

export interface TaxonomyCategory {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  trades: TaxonomyTradeItem[];
}

export const SUPPLIER_SERVICE_TAXONOMY: TaxonomyCategory[] = [
  {
    id: "hard-fm",
    title: "Hard FM / Engineering",
    eyebrow: "CORE ENGINEERING & COMPLIANCE",
    description: "Planned and reactive engineering for electrical, HVAC, gas, heating, fire safety, and life-critical plant systems.",
    trades: [
      { id: "electrical", name: "Electrical", category: "hard-fm", requiresAccreditation: "NICEIC / ECA", suggestedQualifications: ["ECS", "18th Edition"] },
      { id: "mechanical", name: "Mechanical", category: "hard-fm" },
      { id: "hvac", name: "HVAC", category: "hard-fm", requiresAccreditation: "REFCOM / F-Gas", suggestedQualifications: ["F-Gas Cat 1"] },
      { id: "air-conditioning", name: "Air Conditioning", category: "hard-fm", requiresAccreditation: "REFCOM / F-Gas" },
      { id: "heating", name: "Heating", category: "hard-fm" },
      { id: "boilers", name: "Boilers", category: "hard-fm", requiresAccreditation: "Gas Safe Register" },
      { id: "plumbing", name: "Plumbing", category: "hard-fm" },
      { id: "drainage", name: "Drainage", category: "hard-fm" },
      { id: "pumps", name: "Pumps & Pumping Stations", category: "hard-fm" },
      { id: "water-hygiene", name: "Water Hygiene", category: "hard-fm", requiresAccreditation: "LCA (Legionella Control Association)" },
      { id: "legionella-services", name: "Legionella Services", category: "hard-fm", requiresAccreditation: "LCA" },
      { id: "bms-controls", name: "BMS / Controls", category: "hard-fm" },
      { id: "building-management-systems", name: "Building Management Systems", category: "hard-fm" },
      { id: "gas-services", name: "Gas Services", category: "hard-fm", requiresAccreditation: "Gas Safe Register" },
      { id: "commercial-gas", name: "Commercial Gas", category: "hard-fm", requiresAccreditation: "Gas Safe Register (Commercial)" },
      { id: "refrigeration", name: "Refrigeration", category: "hard-fm", requiresAccreditation: "REFCOM / F-Gas" },
      { id: "fire-alarm-systems", name: "Fire Alarm Systems", category: "hard-fm", requiresAccreditation: "BAFE / FIA" },
      { id: "fire-extinguishers", name: "Fire Extinguishers", category: "hard-fm", requiresAccreditation: "BAFE SP101" },
      { id: "sprinklers", name: "Sprinklers", category: "hard-fm", requiresAccreditation: "BAFE / FIRAS" },
      { id: "dry-wet-risers", name: "Dry Risers / Wet Risers", category: "hard-fm" },
      { id: "emergency-lighting", name: "Emergency Lighting", category: "hard-fm", requiresAccreditation: "NICEIC / ECA / BAFE" },
      { id: "lightning-protection", name: "Lightning Protection", category: "hard-fm", requiresAccreditation: "ATLAS" },
      { id: "pat-testing", name: "PAT Testing", category: "hard-fm" },
      { id: "fixed-wire-testing", name: "Fixed Wire Testing / EICR", category: "hard-fm", requiresAccreditation: "NICEIC Approved / ECA" },
      { id: "generators", name: "Generators & Critical Power", category: "hard-fm" },
      { id: "ups-systems", name: "UPS Systems", category: "hard-fm" },
      { id: "lift-maintenance", name: "Lift Maintenance", category: "hard-fm", requiresAccreditation: "LEIA Member" },
      { id: "automatic-doors", name: "Automatic Doors", category: "hard-fm", requiresAccreditation: "ADSA Certified" },
      { id: "roller-shutters", name: "Roller Shutters", category: "hard-fm", requiresAccreditation: "DHF Member" },
      { id: "dock-levellers", name: "Dock Levellers", category: "hard-fm" },
      { id: "access-control", name: "Access Control", category: "hard-fm", requiresAccreditation: "NSI / SSAIB" },
      { id: "cctv", name: "CCTV", category: "hard-fm", requiresAccreditation: "NSI / SSAIB" },
      { id: "intruder-alarms", name: "Intruder Alarms", category: "hard-fm", requiresAccreditation: "NSI / SSAIB" },
    ],
  },
  {
    id: "fabric",
    title: "Fabric / Building Services",
    eyebrow: "BUILDING INTEGRITY & FABRIC",
    description: "Internal and external building fabric repairs, structural envelope maintenance, roofing, glazing, and fit-out trades.",
    trades: [
      { id: "general-building", name: "General Building", category: "fabric" },
      { id: "carpentry-joinery", name: "Carpentry / Joinery", category: "fabric" },
      { id: "roofing", name: "Roofing", category: "fabric", requiresAccreditation: "NFRC Member", highRisk: true },
      { id: "flat-roofing", name: "Flat Roofing", category: "fabric", highRisk: true },
      { id: "cladding", name: "Cladding", category: "fabric", highRisk: true },
      { id: "glazing", name: "Glazing", category: "fabric" },
      { id: "doors", name: "Doors & Fire Doors", category: "fabric", requiresAccreditation: "BM TRADA Q-Mark / FIRAS" },
      { id: "locksmiths", name: "Locksmiths", category: "fabric", requiresAccreditation: "MLA (Master Locksmiths)" },
      { id: "flooring", name: "Flooring", category: "fabric" },
      { id: "decorating", name: "Decorating", category: "fabric" },
      { id: "plastering", name: "Plastering", category: "fabric" },
      { id: "brickwork", name: "Brickwork", category: "fabric" },
      { id: "groundworks", name: "Groundworks", category: "fabric" },
      { id: "concrete-repairs", name: "Concrete Repairs", category: "fabric" },
      { id: "fencing", name: "Fencing", category: "fabric" },
      { id: "gates", name: "Gates & Automation", category: "fabric", requiresAccreditation: "DHF Gate Safety" },
      { id: "barriers", name: "Barriers & Turnstiles", category: "fabric" },
      { id: "surfacing", name: "Surfacing", category: "fabric" },
      { id: "line-marking", name: "Line Marking", category: "fabric" },
      { id: "signage", name: "Signage", category: "fabric" },
      { id: "handyman-services", name: "Handyman Services", category: "fabric" },
    ],
  },
  {
    id: "soft-fm",
    title: "Soft FM",
    eyebrow: "FACILITIES HYGIENE & WORKPLACE SERVICES",
    description: "Daily and periodic commercial cleaning, specialist decontamination, grounds maintenance, and manned security services.",
    trades: [
      { id: "commercial-cleaning", name: "Commercial Cleaning", category: "soft-fm", requiresAccreditation: "BICSc Corporate" },
      { id: "deep-cleaning", name: "Deep Cleaning", category: "soft-fm", requiresAccreditation: "BICSc" },
      { id: "specialist-cleaning", name: "Specialist Cleaning (TR19 / Kitchen)", category: "soft-fm", requiresAccreditation: "BESA TR19" },
      { id: "window-cleaning", name: "Window Cleaning", category: "soft-fm", requiresAccreditation: "FWC (Federation of Window Cleaners)" },
      { id: "high-level-cleaning", name: "High-Level Cleaning", category: "soft-fm", highRisk: true },
      { id: "washroom-services", name: "Washroom Services", category: "soft-fm" },
      { id: "waste-management", name: "Waste Management", category: "soft-fm", requiresAccreditation: "Environment Agency Upper Tier Carrier" },
      { id: "pest-control", name: "Pest Control", category: "soft-fm", requiresAccreditation: "BPCA / NPTA Member" },
      { id: "grounds-maintenance", name: "Grounds Maintenance", category: "soft-fm", requiresAccreditation: "BALI Member" },
      { id: "landscaping", name: "Landscaping", category: "soft-fm" },
      { id: "gritting-snow-clearance", name: "Gritting / Snow Clearance", category: "soft-fm" },
      { id: "security-guarding", name: "Security Guarding", category: "soft-fm", requiresAccreditation: "SIA ACS Approved" },
      { id: "manned-guarding", name: "Manned Guarding", category: "soft-fm", requiresAccreditation: "SIA ACS Approved" },
      { id: "reception", name: "Reception", category: "soft-fm" },
      { id: "concierge", name: "Concierge", category: "soft-fm" },
      { id: "porterage", name: "Porterage", category: "soft-fm" },
      { id: "janitorial-services", name: "Janitorial Services", category: "soft-fm" },
    ],
  },
  {
    id: "specialist-access",
    title: "Specialist Access",
    eyebrow: "WORKING AT HEIGHT & ROPE ACCESS",
    description: "Industrial rope access, BMU suspended access equipment, mobile towers, scaffolding, and fall protection certification.",
    trades: [
      { id: "rope-access", name: "Rope Access", category: "specialist-access", requiresAccreditation: "IRATA Member Company", highRisk: true },
      { id: "abseiling", name: "Abseiling", category: "specialist-access", requiresAccreditation: "IRATA Certified", highRisk: true },
      { id: "bmu-services", name: "BMU Services", category: "specialist-access", requiresAccreditation: "BS EN 1808 Specialist", highRisk: true },
      { id: "mewp-services", name: "MEWP Services", category: "specialist-access", requiresAccreditation: "IPAF Rental+ / Member", highRisk: true },
      { id: "scaffolding", name: "Scaffolding", category: "specialist-access", requiresAccreditation: "NASC Member", highRisk: true },
      { id: "mobile-towers", name: "Mobile Towers", category: "specialist-access", requiresAccreditation: "PASMA Certified" },
      { id: "fall-protection", name: "Fall Protection", category: "specialist-access" },
      { id: "mansafe-systems", name: "Mansafe Systems (Testing & Recertification)", category: "specialist-access" },
      { id: "roof-access-systems", name: "Roof Access Systems", category: "specialist-access" },
    ],
  },
  {
    id: "compliance-testing",
    title: "Compliance & Specialist Testing",
    eyebrow: "STATUTORY RISK & ASSURANCE SURVEYS",
    description: "Independent statutory risk assessments, environmental air quality testing, energy certification, and mechanical inspection.",
    trades: [
      { id: "fire-risk-assessments", name: "Fire Risk Assessments", category: "compliance-testing", requiresAccreditation: "IFE / BAFE SP205" },
      { id: "water-risk-assessments", name: "Water Risk Assessments", category: "compliance-testing", requiresAccreditation: "LCA Registered" },
      { id: "asbestos-surveys", name: "Asbestos Surveys", category: "compliance-testing", requiresAccreditation: "UKAS Accredited (ISO 17020)" },
      { id: "air-quality-testing", name: "Air Quality Testing", category: "compliance-testing" },
      { id: "electrical-testing", name: "Electrical Testing", category: "compliance-testing", requiresAccreditation: "NICEIC / ECA" },
      { id: "thermographic-surveys", name: "Thermographic Surveys", category: "compliance-testing", requiresAccreditation: "PCN Level 2 / ITC Certified" },
      { id: "energy-assessments", name: "Energy Assessments (EPC / DEC / TM44)", category: "compliance-testing", requiresAccreditation: "CIBSE Accredited Assessor" },
      { id: "pressure-systems", name: "Pressure Systems (PSSR 2000)", category: "compliance-testing", requiresAccreditation: "Competent Person (PSSR)" },
      { id: "lev-testing", name: "LEV Testing (COSHH Reg 9)", category: "compliance-testing", requiresAccreditation: "BOHS P601" },
      { id: "loler-inspection", name: "LOLER Inspection", category: "compliance-testing", requiresAccreditation: "Competent Person (LOLER)" },
      { id: "puwer-inspection", name: "PUWER Inspection", category: "compliance-testing" },
      { id: "gas-safety", name: "Gas Safety Inspections (CP12 / CP15)", category: "compliance-testing", requiresAccreditation: "Gas Safe Register" },
      { id: "tm44-assessments", name: "TM44 Assessments", category: "compliance-testing", requiresAccreditation: "CIBSE / Energy Assessor" },
    ],
  },
  {
    id: "drainage-environmental",
    title: "Drainage & Environmental",
    eyebrow: "CIVIL DRAINAGE & EMERGENCY SPILL",
    description: "High-pressure water jetting, CCTV structural surveys, tanker waste disposal, sewage management, and flood response.",
    trades: [
      { id: "drain-unblocking", name: "Drain Unblocking", category: "drainage-environmental" },
      { id: "cctv-drain-surveys", name: "CCTV Drain Surveys", category: "drainage-environmental", requiresAccreditation: "NADC / WRc Certified" },
      { id: "jetting", name: "High-Pressure Water Jetting", category: "drainage-environmental", requiresAccreditation: "WJA (Water Jetting Assoc)" },
      { id: "tankering", name: "Tankering & Vacuum Extraction", category: "drainage-environmental", requiresAccreditation: "EA Waste Carrier" },
      { id: "sewage", name: "Sewage Treatment & Pump Stations", category: "drainage-environmental" },
      { id: "grease-traps", name: "Grease Traps Maintenance", category: "drainage-environmental" },
      { id: "interceptors", name: "Interceptors & Separators (PPG3)", category: "drainage-environmental" },
      { id: "flood-response", name: "Flood Response & Dewatering", category: "drainage-environmental" },
      { id: "environmental-services", name: "Environmental Remediation", category: "drainage-environmental" },
      { id: "spill-response", name: "Spill Response & Chemical Containment", category: "drainage-environmental" },
    ],
  },
  {
    id: "external-civils",
    title: "External & Civils",
    eyebrow: "CIVIL ENGINEERING & INFRASTRUCTURE",
    description: "Hard landscaping, tarmac roadway repairs, external lighting, perimeter security barriers, bollards, and civil groundwork.",
    trades: [
      { id: "grounds-works", name: "Grounds Works", category: "external-civils" },
      { id: "excavation", name: "Excavation", category: "external-civils", highRisk: true },
      { id: "car-parks", name: "Car Parks Maintenance", category: "external-civils" },
      { id: "roads", name: "Roads & Tarmacadam", category: "external-civils" },
      { id: "paving", name: "Paving & Kerbing", category: "external-civils" },
      { id: "kerbing", name: "Kerbing", category: "external-civils" },
      { id: "civils-drainage", name: "Civil Drainage", category: "external-civils" },
      { id: "civils-fencing", name: "Fencing & Security Hoarding", category: "external-civils" },
      { id: "civils-gates", name: "Gates & Turnstiles", category: "external-civils" },
      { id: "bollards", name: "Bollards & Traffic Calming", category: "external-civils" },
      { id: "street-furniture", name: "Street Furniture & Shelters", category: "external-civils" },
      { id: "external-lighting", name: "External & Car Park Lighting", category: "external-civils", requiresAccreditation: "NICEIC / HEA" },
    ],
  },
  {
    id: "specialist-services",
    title: "Specialist Services",
    eyebrow: "INNOVATION & SPECIALIST RECOVERY",
    description: "Drone asset thermography, non-destructive leak detection, disaster recovery drying, and temporary site services.",
    trades: [
      { id: "drone-inspections", name: "Drone Inspections & Aerial Photogrammetry", category: "specialist-services", requiresAccreditation: "CAA Operational Authorisation" },
      { id: "thermal-imaging", name: "Thermal Imaging & Enclosure Integrity", category: "specialist-services" },
      { id: "roof-surveys", name: "Roof Surveys & Electronic Leak Detection", category: "specialist-services" },
      { id: "facade-surveys", name: "Façade Surveys & Material Testing", category: "specialist-services" },
      { id: "leak-detection", name: "Acoustic & Tracer Gas Leak Detection", category: "specialist-services" },
      { id: "emergency-response", name: "24/7 Disaster Emergency Response", category: "specialist-services" },
      { id: "disaster-recovery", name: "Disaster Recovery & Flood Drying (BDMA)", category: "specialist-services", requiresAccreditation: "BDMA Corporate" },
      { id: "temporary-power", name: "Temporary Power & Generator Hire", category: "specialist-services" },
      { id: "temporary-heating", name: "Temporary Heating & Chilling Solutions", category: "specialist-services" },
      { id: "specialist-surveys", name: "Specialist Engineering Surveys", category: "specialist-services" },
    ],
  },
];

// ============================================================================
// ENTIREFM SUPPLIER CODE OF CONDUCT (v2026.1)
// ============================================================================

export interface CodeOfConductSection {
  title: string;
  points: string[];
}

export const SUPPLIER_CODE_OF_CONDUCT_V2026_1: CodeOfConductSection[] = [
  {
    title: "1. Professional Conduct & Business Ethics",
    points: [
      "All suppliers and their personnel must act with the highest standards of integrity, professionalism, and honesty at all times.",
      "Suppliers must strictly comply with all applicable UK and local laws, regulations, statutory instruments, and British/European standards.",
      "Fraudulent, misleading, or deceptive business conduct, including falsifying worksheets, time records, or material invoices, is strictly prohibited and results in immediate termination.",
    ],
  },
  {
    title: "2. Health, Safety & Environmental Protection",
    points: [
      "The health, safety, and welfare of building occupants, client personnel, the public, and our workforce is paramount.",
      "Suppliers must produce site-specific and task-specific Risk Assessments and Method Statements (RAMS) before commencing work on any EntireFM managed site.",
      "Operatives must be fully briefed on and formally sign onto RAMS before starting work.",
      "All work at height, hot works, electrical isolation (LOTO), confined space entry, and asbestos disturbance must be governed by authorized permits-to-work.",
      "Suppliers must maintain a zero-tolerance approach to unsafe work practices. Any operative or supervisor has the absolute right and obligation to stop unsafe work immediately.",
      "Environmental regulations, COSHH guidelines, waste duty-of-care, and F-Gas stewardship must be strictly upheld.",
    ],
  },
  {
    title: "3. Workforce Competence & Subcontractor Responsibility",
    points: [
      "All engineers and operatives deployed on EntireFM work must hold relevant, verified statutory trade qualifications (e.g. Gas Safe, F-Gas, NICEIC, ECS/CSCS, IRATA).",
      "Suppliers must ensure regular toolbox talks, site inductions, and ongoing competency refreshers are conducted and recorded in an auditable matrix.",
      "Second-tier subcontracting without prior written authorization from EntireFM is prohibited.",
      "Where authorized subcontractors are used, the primary supplier accepts full legal, technical, and operational liability for ensuring the subcontractor meets all EntireFM standards.",
    ],
  },
  {
    title: "4. Anti-Bribery, Gifts & Conflicts of Interest",
    points: [
      "EntireFM enforces a strict zero-tolerance policy towards bribery, corruption, extortion, and facilitation payments in accordance with the Bribery Act 2010.",
      "Suppliers must never offer, promise, give, or accept gifts, hospitality, or commercial inducements to EntireFM staff, clients, or agents to gain an unfair business advantage.",
      "Any actual, potential, or perceived conflicts of interest must be disclosed in writing to the EntireFM compliance desk immediately.",
    ],
  },
  {
    title: "5. Modern Slavery & Worker Welfare",
    points: [
      "Suppliers must actively eliminate modern slavery, human trafficking, forced labor, and child labor from their business and supply chains, in compliance with the Modern Slavery Act 2015.",
      "All workers must be verified for right-to-work in the UK and paid at or above statutory national minimum and living wages.",
      "Suppliers must uphold fair employment practices, non-discrimination, equality, diversity, and worker welfare standards.",
      "A confidential whistleblowing channel must be maintained to allow workers to report ethical or safety concerns without fear of retaliation.",
    ],
  },
  {
    title: "6. Information Security, Privacy & Confidentiality",
    points: [
      "Suppliers must protect confidential client property information, access credentials, building layouts, and security telemetry.",
      "Personal data must be processed in strict compliance with the UK GDPR, Data Protection Act 2018, and Data (Use and Access) Act 2025.",
      "Multi-factor authentication (MFA), endpoint encryption, and regular software patching must be enforced on systems processing EntireFM data.",
      "Any material cyber security incident or personal data breach must be notified to EntireFM within 24 hours of discovery.",
    ],
  },
  {
    title: "7. Client Premises Standards & Site Conduct",
    points: [
      "Suppliers must display company photographic identification at all times while on client property.",
      "Clean, professional, branded workwear and appropriate PPE must be worn by all attending personnel.",
      "Substance misuse, including alcohol and illegal drugs, is strictly prohibited. EntireFM and our clients operate random drug and alcohol testing policies.",
      "Smoking and vaping are prohibited on all client premises except within designated external zones.",
      "Suppliers must treat building occupants, clients, and fellow contractors with dignity, courtesy, and respect at all times.",
    ],
  },
  {
    title: "8. Digital Job Management & Evidence Quality",
    points: [
      "Suppliers must utilize EntireCAFM or designated digital portals to receive job dispatches, log arrival times, capture photographic proof of work, obtain client digital sign-offs, and submit worksheets.",
      "Clear before-and-after photographic evidence must accompany all completion reports for maintenance and reactive work orders.",
      "Accurate, transparent asset condition notes and statutory certification documents must be uploaded within 24 hours of job completion.",
    ],
  },
  {
    title: "9. Regulatory Disclosures & Material Changes",
    points: [
      "Suppliers have an ongoing affirmative duty to notify EntireFM within 5 business days of any material change in business status, loss of trade accreditation, insurance cancellation/lapse, HSE enforcement notice, RIDDOR prosecution, or regulatory sanction.",
      "Failure to maintain mandatory insurances or qualifications will result in an immediate automated hold on work allocation.",
    ],
  },
  {
    title: "10. Compliance Audits & Breach Termination",
    points: [
      "EntireFM reserves the right to conduct announced and unannounced safety and quality audits of supplier operations, paperwork, vehicles, and active site works.",
      "Suppliers must cooperate fully with all EntireFM quality assurance officers and audit requests.",
      "Material or persistent breach of this Supplier Code of Conduct will result in immediate suspension or permanent removal from the EntireFM Supplier Network.",
    ],
  },
];
