/**
 * SITE NAVIGATION
 * ===============
 * One definition of the primary navigation, shared by the header mega-menu,
 * the mobile drawer and the footer, so the three cannot drift apart.
 *
 * Every path here is checked against the route registry by
 * `npm run validate:routes` — navigation may only point at routes that exist.
 *
 * Ordering within each column is by commercial priority, not alphabetically:
 * the pages Search Console shows carrying demand come first.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Short supporting line, revealed on hover in the mega-menu. */
  detail?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavSection {
  label: string;
  href: string;
  columns: NavColumn[];
  /** Promoted image panel shown alongside the columns. */
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    secondaryHref?: string;
    secondaryCta?: string;
    /** Key into the editorial image manifest. */
    imageKey: string;
  };
}

export const PRIMARY_NAV: NavSection[] = [
  {
    label: 'Services',
    href: '/services',
    columns: [
      {
        heading: 'Hard FM & Engineering',
        links: [
          { label: 'Mechanical & Electrical', href: '/mechanical-electrical', detail: 'M&E design, installation and maintenance' },
          { label: 'Planned Maintenance (PPM)', href: '/ppm', detail: 'Schedules built from a real asset survey' },
          { label: 'HVAC & Air Conditioning', href: '/hvac-contractor', detail: 'Chillers, AHUs, split systems and controls' },
          { label: 'Plumbing & Gas', href: '/plumbing-gas', detail: 'Commercial plumbing, drainage and gas safety' },
          { label: 'Fire & Emergency Systems', href: '/fire-emergency-systems', detail: 'Detection, alarms and emergency lighting' },
          { label: 'Building Maintenance', href: '/building-maintenance', detail: 'Fabric, roofing and structural repair' },
          { label: 'Electrical Testing & Compliance', href: '/compliance/fixed-wire-testing-eicr', detail: 'EICR, PAT, emergency lighting & fixed-wire testing' },
          { label: 'Water Hygiene & Legionella', href: '/compliance/legionella-water-hygiene', detail: 'Risk assessments, monitoring, sampling & compliance' },
          { label: 'BMS & Building Controls', href: '/mechanical-electrical', detail: 'Controls, optimisation, monitoring & energy performance' },
        ],
      },
      {
        heading: 'Soft FM & Specialist',
        links: [
          { label: 'Working at Height & Rope Access', href: '/working-at-height-rope-access-bmu', detail: 'Rope access, BMU & façade maintenance' },
          { label: 'Commercial Cleaning', href: '/cleaning-services', detail: 'Office, retail and contract cleaning' },
          { label: 'Industrial Cleaning', href: '/industrial-cleaning', detail: 'Process, plant and high-level cleaning' },
          { label: 'Security Services', href: '/security-services', detail: 'Guarding, CCTV and access control' },
          { label: 'Grounds Maintenance', href: '/grounds-maintenance', detail: 'External estates and landscaping' },
          { label: 'Crane Hire & Lifting', href: '/mobile-crane-hire', detail: 'Contract lifts and plant replacement' },
          { label: 'Waste Management', href: '/soft-services', detail: 'Commercial waste, recycling & environmental compliance' },
          { label: 'Pest Control', href: '/soft-services', detail: 'Prevention, monitoring & responsive pest management' },
          { label: 'Washroom & Hygiene', href: '/washroom-management', detail: 'Washroom services, consumables & hygiene management' },
        ],
      },
      {
        heading: 'Drone Services',
        links: [
          { label: 'Drone Inspections', href: '/services/drone-services/drone-inspections', detail: 'High-level visual surveys & defect identification' },
          { label: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', detail: 'Flat, pitched & membrane condition surveys' },
          { label: 'Façade & Building Envelope', href: '/services/drone-services/building-envelope-inspections', detail: 'Cladding, glazing & rain-screen assessment' },
          { label: 'Thermal Drone Surveys', href: '/services/drone-services/thermal-imaging', detail: 'Heat loss, moisture & thermal anomalies' },
          { label: 'Solar PV Inspections', href: '/services/drone-services/solar-pv-inspections', detail: 'Panel condition & hotspot detection' },
          { label: 'Surveying & Mapping', href: '/services/drone-services/surveying-mapping', detail: 'Orthomosaics, photogrammetry & terrain models' },
          { label: 'Construction Monitoring', href: '/services/drone-services/construction-monitoring', detail: 'Repeat milestone capture & project records' },
          { label: 'Digital Twin & 3D Capture', href: '/services/drone-services/digital-twin-3d-capture', detail: 'Reality mesh models & asset visualisation' },
          { label: 'View All Drone Services →', href: '/services/drone-services', detail: 'Complete aerial inspection & asset intelligence suite' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Total FM',
      title: 'One contract, one accountability',
      body: 'Hard and soft services under a single provider, so responsibility never moves between suppliers while a building sits unusable.',
      href: '/hard-services',
      cta: 'How it works',
      imageKey: 'switchgear-inspection',
    },
  },
  {
    label: 'Sectors',
    href: '/sectors',
    columns: [
      {
        heading: 'Industrial & Logistics',
        links: [
          { label: 'Industrial & Manufacturing', href: '/industrial-facilities-management', detail: 'Process plant, LEV and high-load power' },
          { label: 'Logistics & Distribution', href: '/logistics-facilities-management', detail: 'Dock levellers, shutters and yard lighting' },
          { label: 'Warehousing', href: '/warehouse-facilities-management', detail: 'Large-format sites on continuous operation' },
          { label: 'Construction', href: '/construction-facilities-management', detail: 'Site and development facilities' },
        ],
      },
      {
        heading: 'Commercial & Public',
        links: [
          { label: 'Commercial Offices', href: '/commercial-facilities-management', detail: 'Multi-tenant estates and managing agents' },
          { label: 'Retail & Shopping Centres', href: '/retail-facilities-management', detail: 'Public realm and long trading hours' },
          { label: 'Healthcare', href: '/healthcare-facilities-management', detail: 'Clinical environments and infection control' },
          { label: 'Education', href: '/education-facilities-management', detail: 'Campus estates and vacation turnaround' },
          { label: 'Hotels & Hospitality', href: '/hotel-facilities-management', detail: 'Guest experience and out-of-hours working' },
          { label: 'Arenas & Venues', href: '/arena-facilities-management', detail: 'Event-day standby and dark-period works' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Sector fit',
      title: 'The compliance profile changes',
      body: 'A two-hour outage is a nuisance in a warehouse and an incident in a clinical building. Sector experience is what tells the two apart.',
      href: '/sectors',
      cta: 'All sectors',
      imageKey: 'rooftop-plant-night',
    },
  },
  {
    label: 'Resources',
    href: '/resources',
    columns: [
      {
        heading: 'FM Tools',
        links: [
          { label: 'FM Compliance Checker', href: '/tools/compliance-checker', detail: 'Statutory compliance screening across 10 UK regimes' },
          { label: 'FM Building Health Check', href: '/tools/fm-health-check', detail: 'Interactive estate compliance diagnostic' },
          { label: 'PPM Schedule Builder', href: '/tools/ppm-schedule-builder', detail: 'Asset-led planned maintenance matrix' },
          { label: 'PPM Cost Estimator', href: '/tools/ppm-estimator', detail: 'Indicative budget ranges by building scope' },
          { label: 'FM ROI / TCO Calculator', href: '/tools/fm-roi-calculator', detail: 'Compare reactive vs planned maintenance' },
          { label: 'Tender Brief Generator', href: '/tools/tender-brief', detail: 'Structured FM RFP specification builder' },
          { label: 'Compliance Calendar', href: '/tools/compliance-calendar', detail: 'Statutory inspection schedule & ICS export' },
          { label: 'View All Tools', href: '/tools', detail: 'Interactive FM engineering and planning suite' },
        ],
      },
      {
        heading: 'Guides & Knowledge',
        links: [
          { label: 'FM Guides Library', href: '/resources/guides', detail: 'Authoritative evergreen facilities management guides' },
          { label: 'Resource Hub', href: '/resources', detail: 'Central knowledge, guides and practical FM tools' },
          { label: 'AI in Facilities Management', href: '/resources/ai-in-facilities-management', detail: 'Comprehensive operational & technical guide' },
          { label: 'Predictive Maintenance', href: '/resources/ai-in-facilities-management/predictive-maintenance', detail: 'IoT condition monitoring & failure models' },
          { label: 'AI + CAFM Software', href: '/resources/ai-in-facilities-management/ai-cafm', detail: 'Next-generation facilities software architecture' },
          { label: 'FM Glossary', href: '/facilities-management-glossary', detail: 'Plain-English terminology from PPM to EICR' },
          { label: 'FM Intelligence', href: '/fm-intelligence', detail: '2026 market trends, benchmarks and analysis' },
          { label: 'The FM Briefing', href: '/fm-briefing', detail: 'Weekly facilities management intelligence publication' },
          { label: 'EntireFM Academy', href: '/academy', detail: 'Practical operational learning and FM fundamentals' },
        ],
      },
      {
        heading: 'Compliance & Safety',
        links: [
          { label: 'Compliance Centre', href: '/compliance', detail: 'Statutory testing and legal obligations authority' },
          { label: 'Fire Risk Assessment', href: '/compliance/fire-risk-assessment', detail: 'RRO 2005 duties and review triggers' },
          { label: 'Fixed Wire Testing (EICR)', href: '/compliance/fixed-wire-testing-eicr', detail: 'BS 7671 periodic inspection intervals' },
          { label: 'Emergency Lighting', href: '/compliance/emergency-lighting-testing', detail: 'BS 5266 monthly and annual testing' },
          { label: 'Water Hygiene & Legionella', href: '/compliance/legionella-water-hygiene', detail: 'ACOP L8 written scheme of control' },
          { label: 'Commercial Gas Safety', href: '/compliance/commercial-gas-safety', detail: 'Non-domestic gas installation duties' },
          { label: 'View All Compliance', href: '/compliance', detail: 'Complete statutory duties and evidence guides' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Interactive Planning',
      title: 'Build your PPM schedule',
      body: 'Generate an asset-led planned preventative maintenance matrix with verified statutory and standard classifications.',
      href: '/tools/ppm-schedule-builder',
      cta: 'Launch schedule builder',
      imageKey: 'client-review',
    },
  },
  {
    label: 'Suppliers',
    href: '/suppliers',
    columns: [
      {
        heading: 'Work with EntireFM',
        links: [
          { label: 'Become a Supplier', href: '/suppliers/partner-with-entirefm', detail: 'Join our trusted UK supplier & contractor network' },
          { label: 'Start Supplier Application', href: '/suppliers/apply', detail: 'Online pre-qualification & onboarding submission' },
          { label: 'How We Work', href: '/suppliers/how-we-work', detail: 'Procurement ethics, prompt payment and work allocation' },
          { label: 'Supplier Standards', href: '/suppliers/standards', detail: 'H&S, environmental, quality and insurance benchmarks' },
        ],
      },
      {
        heading: 'Assurance & Compliance',
        links: [
          { label: 'Supplier Vetting', href: '/suppliers/vetting', detail: 'Rigorous 6-pillar compliance & competence auditing' },
          { label: 'Onboarding', href: '/suppliers/onboarding', detail: 'Structured 4-phase onboarding and induction process' },
          { label: 'Compliance', href: '/suppliers/compliance', detail: 'Insurance, RAMS, competence cards and certification' },
          { label: 'Membership & Fees', href: '/suppliers/membership', detail: 'Partner Network tiers, annual vetting and benefits' },
        ],
      },
      {
        heading: 'Partner Network',
        links: [
          { label: 'Partner Network', href: '/suppliers/partner-network', detail: 'Collaborative ecosystem of specialists and OEMs' },
          { label: 'Events & Forums', href: '/suppliers/events', detail: 'Technical breakfasts, manufacturer sessions and roundtables' },
          { label: 'Industry & OEM Partners', href: '/suppliers/industry-partners', detail: 'Factory-backed technical and equipment partnerships' },
          { label: 'Innovation', href: '/suppliers/innovation', detail: 'PropTech, IoT, AI, telemetry and sustainability partners' },
        ],
      },
      {
        heading: 'Existing Suppliers',
        links: [
          { label: 'Supplier Portal', href: '/supplier-portal/sign-in', detail: 'Secure portal for job tickets, compliance & invoicing' },
          { label: 'Supplier FAQ', href: '/suppliers/faq', detail: 'Frequently asked questions on vetting, payment & operations' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Supplier Events & Partner Network',
      title: 'Supplier Events & Partner Network',
      body: 'Technical breakfasts, supplier forums, manufacturer sessions, training days and industry engagement.',
      href: '/suppliers/events',
      cta: 'Explore Events & Forums',
      secondaryHref: '/suppliers/partner-network',
      secondaryCta: 'Explore the Partner Network',
      imageKey: 'client-review',
    },
  },
];

/**
 * Flat links alongside the mega-menu sections.
 */
export const SECONDARY_NAV: NavLink[] = [
  { label: 'Client Portal', href: '/client-portal' },
  { label: 'About', href: '/about-entire-facilities-management' },
  { label: 'Contact', href: '/contact-us' },
];

export const FOOTER_NAV: NavColumn[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Total FM', href: '/hard-services' },
      { label: 'Mechanical & Electrical', href: '/mechanical-electrical' },
      { label: 'Planned Maintenance', href: '/ppm' },
      { label: 'HVAC', href: '/hvac-contractor' },
      { label: 'Working at Height', href: '/working-at-height-rope-access-bmu' },
      { label: 'Commercial Cleaning', href: '/commercial-cleaning-services' },
      { label: 'Building Fabric', href: '/building-maintenance' },
      { label: 'Drone Services', href: '/services/drone-services' },
      { label: 'Compliance Management', href: '/compliance' },
      { label: 'View All Services', href: '/services' },
    ],
  },
  {
    heading: 'Sectors',
    links: [
      { label: 'Commercial Offices', href: '/commercial-facilities-management' },
      { label: 'Industrial', href: '/industrial-facilities-management' },
      { label: 'Logistics', href: '/logistics-facilities-management' },
      { label: 'Retail', href: '/retail-facilities-management' },
      { label: 'Healthcare', href: '/healthcare-facilities-management' },
      { label: 'All sectors', href: '/sectors' },
    ],
  },
  {
    heading: 'Locations',
    links: [
      { label: 'London', href: '/facilities-management-london' },
      { label: 'Manchester', href: '/facilities-management-manchester' },
      { label: 'Sheffield', href: '/facilities-management-sheffield' },
      { label: 'Leeds', href: '/facilities-management-leeds' },
      { label: 'Birmingham', href: '/facilities-management-birmingham' },
      { label: 'All locations', href: '/locations' },
    ],
  },
  {
    heading: 'Resources & Supply Chain',
    links: [
      { label: 'EntireCAFM Portal', href: '/client-portal' },
      { label: 'Supplier & Partner Hub', href: '/suppliers' },
      { label: 'Partner Network', href: '/suppliers/partner-network' },
      { label: 'Supplier Membership & Fees', href: '/suppliers/membership' },
      { label: 'Events & Forums', href: '/suppliers/events' },
      { label: 'Industry & OEM Partners', href: '/suppliers/industry-partners' },
      { label: 'Supplier Vetting & Standards', href: '/suppliers/vetting' },
      { label: 'Supplier Application', href: '/suppliers/apply' },
      { label: 'Supplier Portal', href: '/supplier-portal' },
      { label: 'Resource Hub', href: '/resources' },
      { label: 'FM Tools & Calculators', href: '/tools' },
      { label: 'Compliance Centre', href: '/compliance' },
      { label: 'Legal & Governance', href: '/legal' },
      { label: 'FM Intelligence', href: '/fm-intelligence' },
      { label: 'The FM Briefing', href: '/fm-briefing' },
      { label: 'EntireFM Academy', href: '/academy' },
      { label: 'About EntireFM', href: '/about-entire-facilities-management' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { label: 'Legal Centre', href: '/legal' },
  { label: 'Privacy Notice', href: '/legal/privacy' },
  { label: 'Terms of Business', href: '/legal/terms-of-business' },
  { label: 'Responsible AI', href: '/legal/ai' },
  { label: 'Contractor Terms', href: '/legal/contractor-terms' },
  { label: 'Cookies Policy', href: '/legal/cookies' },
  { label: 'Accessibility', href: '/legal/accessibility' },
  { label: 'Sitemap', href: '/html-sitemap' },
];

