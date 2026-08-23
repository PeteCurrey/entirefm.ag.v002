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
  /** Promoted panel shown alongside the columns. */
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
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
        ],
      },
      {
        heading: 'Soft FM & Specialist',
        links: [
          { label: 'Commercial Cleaning', href: '/cleaning-services', detail: 'Office, retail and contract cleaning' },
          { label: 'Industrial Cleaning', href: '/industrial-cleaning', detail: 'Process, plant and high-level cleaning' },
          { label: 'Security Services', href: '/security-services', detail: 'Guarding, CCTV and access control' },
          { label: 'Grounds Maintenance', href: '/grounds-maintenance', detail: 'External estates and landscaping' },
          { label: 'Drone Inspections', href: '/aerial-drone-building-inspection', detail: 'Roof and façade survey without access equipment' },
          { label: 'Crane Hire & Lifting', href: '/mobile-crane-hire', detail: 'Contract lifts and plant replacement' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Total FM',
      title: 'One contract, one accountability',
      body: 'Hard and soft services under a single provider, so responsibility never moves between suppliers while a building sits unusable.',
      href: '/hard-services',
      cta: 'How it works',
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
    },
  },
  {
    label: 'Locations',
    href: '/locations',
    columns: [
      {
        heading: 'Primary markets',
        links: [
          { label: 'London', href: '/facilities-management-london', detail: 'ULEZ, permits and tall-building water systems' },
          { label: 'Manchester', href: '/facilities-management-manchester', detail: 'Mill conversions and Trafford Park' },
          { label: 'Sheffield', href: '/facilities-management-sheffield', detail: 'Heavy industrial and advanced manufacturing' },
          { label: 'Leeds', href: '/facilities-management-leeds', detail: 'Multi-tenant offices and the Aire Valley' },
          { label: 'Birmingham', href: '/facilities-management-birmingham', detail: 'Clean Air Zone and listed city-centre stock' },
        ],
      },
      {
        heading: 'Midlands & regions',
        links: [
          { label: 'Nottingham', href: '/facilities-management-nottingham', detail: 'Workplace Parking Levy and Lace Market stock' },
          { label: 'Derby', href: '/facilities-management-derby', detail: 'Aerospace and advanced engineering' },
          { label: 'Lincoln', href: '/facilities-management-lincoln', detail: 'County-wide coverage and food production' },
          { label: 'Liverpool', href: '/facilities-management-liverpool', detail: 'Salt-air exposure and waterfront fabric' },
          { label: 'All locations', href: '/locations', detail: 'Full UK coverage map' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Coverage',
      title: 'Mobile teams, not a branch network',
      body: 'We do not claim a depot in every city. Response times are agreed per site from genuine travel capability.',
      href: '/locations',
      cta: 'How coverage works',
    },
  },
];

/** Flat links that sit alongside the mega-menu sections. */
export const SECONDARY_NAV: NavLink[] = [
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Resources', href: '/resources' },
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
      { label: 'Fire & Emergency', href: '/fire-emergency-systems' },
      { label: 'Cleaning', href: '/cleaning-services' },
      { label: 'All services', href: '/services' },
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
    heading: 'Company',
    links: [
      { label: 'About EntireFM', href: '/about-entire-facilities-management' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Resources', href: '/resources' },
      { label: 'Careers', href: '/job-board' },
      { label: 'Supply Chain', href: '/fm-supply-chain' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Accessibility', href: '/accessibility-statement' },
  { label: 'Sitemap', href: '/sitemap' },
];
