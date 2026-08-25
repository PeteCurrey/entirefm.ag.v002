/**
 * CANONICAL PURE DATA MODULE FOR SUPPLIERS & PARTNERS
 * ===================================================
 * Safe for Next.js static prerendering (SSG) & client hydration.
 */

export interface FAQEntry {
  id?: string;
  category: string;
  question: string;
  answer: string;
}

export type SupplierFaqItem = FAQEntry;

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
  {
    id: 'faq-06',
    category: 'compliance',
    question: 'What is scoped supplier approval?',
    answer: 'Approval at EntireFM is specific, not blanket. A supplier is approved for defined service disciplines (e.g. HVAC & Chillers) and defined geographic areas (e.g. Greater Manchester) where their competency and capacity are verified, rather than an unverified open pass.',
  },
  {
    id: 'faq-07',
    category: 'compliance',
    question: 'Can I be approved for only one service or one region?',
    answer: 'Yes. Scoped approvals ensure that you are only asked to deliver work within your proven technical capabilities and geographic boundaries.',
  },
  {
    id: 'faq-08',
    category: 'compliance',
    question: 'What insurance do I need?',
    answer: 'Requirements are risk-proportionate. Standard commercial requirements typically include Public Liability (minimum £5m for high/medium risk engineering, £2m for selected soft services), Employers Liability (£10m where staff are employed), and Professional Indemnity where design or technical consulting applies.',
  },
  {
    id: 'faq-09',
    category: 'compliance',
    question: 'Which accreditations are required?',
    answer: 'Accreditations are trade-specific. For example, gas engineers require Gas Safe; HVAC technicians require F-Gas/REFCOM; electrical contractors require NICEIC/ECA; rope access teams require IRATA. Soft services require BICSc, and health & safety is supported by SSIP accreditation (CHAS, SafeContractor, Constructionline).',
  },
  {
    id: 'faq-10',
    category: 'compliance',
    question: 'Do I need every accreditation listed on the website?',
    answer: 'No. Requirements are strictly tailored to your specific service discipline, operational risk level, and work environment.',
  },
  {
    id: 'faq-11',
    category: 'compliance',
    question: 'How long does onboarding take?',
    answer: 'Once all required compliance documents, insurances, and competency evidence are submitted via the Supplier Portal, technical review is typically completed within 3 to 5 business days.',
  },
  {
    id: 'faq-12',
    category: 'compliance',
    question: 'How will I know what information is required?',
    answer: 'Upon registration, our assurance engine automatically generates a dynamic, tailored requirement checklist in your Supplier Portal based on your specific trade and operating profile.',
  },
  {
    id: 'faq-13',
    category: 'compliance',
    question: 'What happens if one of my documents expires?',
    answer: 'Our automated radar notifies you 90, 60, 30, and 7 days prior to document expiry. If a critical document (such as Public Liability insurance) expires without renewal, a temporary compliance hold automatically applies to prevent unsafe dispatch until the renewed certificate is uploaded.',
  },
  {
    id: 'faq-14',
    category: 'compliance',
    question: 'Can I subcontract work?',
    answer: 'Second-tier subcontracting is restricted unless explicitly declared and approved during technical assurance. EntireFM enforces strict supply chain traceability for client security and health & safety.',
  },
  {
    id: 'faq-15',
    category: 'commercial',
    question: 'Is supplier registration free?',
    answer: 'Yes. Registering your company interest, creating an initial supplier profile, and exploring network requirements is completely free (£0).',
  },
  {
    id: 'faq-16',
    category: 'commercial',
    question: 'What is the Verified Supplier Network Membership?',
    answer: 'Verified Supplier Membership (£495 + VAT/year) is a commercial network tier that supports ongoing digital compliance maintenance, supplier portal tools, document vault storage, expiry monitoring, and eligibility for operational work consideration once technically approved.',
  },
  {
    id: 'faq-17',
    category: 'commercial',
    question: 'Why is there an annual membership fee?',
    answer: 'Maintaining a secure, auditable, and continuously monitored supply chain requires substantial ongoing administration, digital compliance infrastructure, dedicated technical review desks, and automated notification systems. Applicable fees directly support these operational systems.',
  },
  {
    id: 'faq-18',
    category: 'commercial',
    question: 'Is there an onboarding or assurance fee?',
    answer: 'Certain complex or high-risk technical assurance reviews (such as comprehensive multi-discipline H&S and technical audits) carry a one-off administration fee (currently £350 + VAT), which is confirmed prior to the review commencing.',
  },
  {
    id: 'faq-19',
    category: 'commercial',
    question: 'What does the supplier fee pay for?',
    answer: 'Fees pay for digital supplier portal infrastructure, dedicated compliance review officers, automated document verification, insurance renewal tracking, secure bank detail verification, and partner communications.',
  },
  {
    id: 'faq-20',
    category: 'commercial',
    question: 'Does paying a fee guarantee supplier approval?',
    answer: 'No. Supplier approval is strictly based on technical competence, verified accreditation, valid insurance, and safe working practices. Paying a fee does not bypass technical scrutiny.',
  },
  {
    id: 'faq-21',
    category: 'commercial',
    question: 'Does paying guarantee work?',
    answer: 'No. Registration, membership, assurance fees, event attendance, and sponsorship do NOT guarantee work allocation. Work opportunities are awarded based on technical capability, operational SLA performance, geographical proximity, client requirements, and competitive commercial pricing.',
  },
  {
    id: 'faq-22',
    category: 'commercial',
    question: 'Does paying more mean I receive more work?',
    answer: 'No. EntireFM operates a non-negotiable procurement firewall. Commercial membership tiers (e.g. £1,250 Network Partner) provide enhanced networking, public profile listings, and additional user seats, but provide ZERO advantage in operational work allocation algorithms.',
  },
  {
    id: 'faq-23',
    category: 'commercial',
    question: 'Can I pay to become a Preferred Supplier?',
    answer: 'No. Preferred Supplier status cannot be purchased. It is earned through sustained high operational performance, first-time fix excellence, SLA adherence, and reliable evidence submission.',
  },
  {
    id: 'faq-24',
    category: 'commercial',
    question: 'Can I pay to become a Strategic Partner?',
    answer: 'No. Strategic Partner status is an invitation-only executive relationship based on significant national scale, deep technical integration, or critical OEM support.',
  },
  {
    id: 'faq-25',
    category: 'commercial',
    question: 'What is the difference between membership and approval?',
    answer: 'Approval is a technical, safety, and compliance gate (authorising you to perform work safely). Membership is a commercial subscription supporting digital portal services, profile maintenance, and network participation.',
  },
  {
    id: 'faq-26',
    category: 'commercial',
    question: 'How are suppliers paid for completed operational work?',
    answer: 'Operational work completed for EntireFM is paid against verified purchase orders and approved digital service reports, processed under agreed commercial payment terms.',
  },
  {
    id: 'faq-27',
    category: 'commercial',
    question: 'Are Partner Network fees deducted from money EntireFM owes me for operational work?',
    answer: 'No. EntireFM maintains complete separation between payables (what we pay you for operational work) and receivables (membership/event fees). Unrelated balances are not netted without explicit written agreement.',
  },
  {
    id: 'faq-28',
    category: 'commercial',
    question: 'Can I pay fees by card or invoice?',
    answer: 'Yes. Fees can be paid securely via credit/debit card (Stripe) or via invoice for established partner accounts.',
  },
  {
    id: 'faq-29',
    category: 'commercial',
    question: 'Where can I see my commercial invoices and membership status?',
    answer: 'All commercial subscriptions, invoices, payment receipts, and renewal dates are clearly visible in the Billing section of your Supplier Portal.',
  },
  {
    id: 'faq-30',
    category: 'delivery',
    question: 'How are suppliers considered for work once approved?',
    answer: 'When a work order arises, our allocation engine evaluates hard compliance gates (scoped service, region, active status) and calculates suitability based on performance history, engineer availability, and travel distance. Authorised EntireFM controllers review candidates and make the award decision.',
  },
  {
    id: 'faq-31',
    category: 'delivery',
    question: 'Are suppliers performance monitored?',
    answer: 'Yes. We track objective operational metrics: on-time SLA attendance, first-time fix rate, service report accuracy, invoice matching, and client feedback. These are transparently visible in your portal.',
  },
  {
    id: 'faq-32',
    category: 'delivery',
    question: 'What is the Supplier Academy?',
    answer: 'The Supplier Academy provides practical guidance, portal onboarding modules, RAMS standards, and technical briefings to help our supply chain deliver exemplary facilities management.',
  },
  {
    id: 'faq-33',
    category: 'delivery',
    question: 'Can manufacturers and OEMs join?',
    answer: 'Yes. Equipment manufacturers and OEMs partner with EntireFM for technical training, warranty-backed maintenance ecosystems, product demonstrations, and asset intelligence collaboration.',
  },
  {
    id: 'faq-34',
    category: 'delivery',
    question: 'Can technology companies join?',
    answer: 'Yes. We collaborate with IoT sensor developers, smart building software providers, drone inspection innovators, and energy analytics platforms through our Industry Partner programme.',
  },
  {
    id: 'faq-35',
    category: 'commercial',
    question: 'Can I sponsor an EntireFM supplier event?',
    answer: 'Yes. We offer commercial sponsorship packages for Meet the Manufacturer sessions, technical roundtables, and regional supplier forums.',
  },
  {
    id: 'faq-36',
    category: 'commercial',
    question: 'Does event sponsorship improve procurement status?',
    answer: 'No. Event sponsorship provides high-visibility industry branding and networking, but has zero influence on technical approval or work order allocation.',
  },
  {
    id: 'faq-37',
    category: 'onboarding',
    question: 'What are "Meet the Buyer" sessions?',
    answer: 'Meet the Buyer events allow suppliers to understand EntireFM’s upcoming procurement themes, client property challenges, and standards in a transparent forum. Attendance does not constitute an automatic contract award.',
  }
];
