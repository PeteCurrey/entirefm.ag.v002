/**
 * ENTIREFM SERVICE TAXONOMY & DIRECTORY REGISTRY
 * ===============================================
 * Curated commercial taxonomy for the flagship /services overview.
 * Decouples the primary service discovery experience from raw page registries,
 * preventing location landing pages, duplicate/copy pages, and generic posts
 * from polluting the commercial service catalog.
 */

export type ServiceFamilyId = 
  | 'hard-fm'
  | 'compliance'
  | 'soft-fm'
  | 'specialist'
  | 'drone';

export interface ServiceFamily {
  id: ServiceFamilyId;
  number: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  statLabel: string;
  statValue: string;
  primaryHref: string;
  featuredCapabilities: string[];
}

export interface CuratedService {
  id: string;
  number: string;
  title: string;
  shortTitle?: string;
  slug: string;
  family: ServiceFamilyId;
  categoryLabel: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  imageAlt: string;
  capabilities: string[];
  complianceTags: string[];
  sectors: string[];
  deliveryModel: string;
  featuredInExplorer?: boolean;
  priority: number;
}

export interface EstateSectorOption {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export interface EstateRequirementOption {
  id: string;
  label: string;
  discipline: string;
  description: string;
}

export interface NavigatorRecommendation {
  primaryServiceId: string;
  supportingServiceIds: string[];
  deliveryModel: string;
  complianceFocus: string[];
  summaryNote: string;
}

/**
 * The Five Substantial Service Families
 */
export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    id: 'hard-fm',
    number: '01',
    name: 'Hard FM & Engineering',
    shortName: 'Hard FM',
    tagline: 'Critical plant, mechanical & electrical engineering, and fabric care.',
    description: 'Technical asset stewardship and planned engineering delivered by mobile certified technicians. We maintain HVAC, main switchgear, gas systems, plumbing, and building controls to prevent downtime and preserve capital value.',
    heroImage: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    heroAlt: 'EntireFM certified engineer carrying out statutory diagnostics on commercial LV distribution switchgear',
    statLabel: 'Direct Engineering Fleet',
    statValue: '100% Certified',
    primaryHref: '/mechanical-electrical',
    featuredCapabilities: [
      'Mechanical & Electrical (M&E)',
      'HVAC & Commercial Air Conditioning',
      'HV/LV Distribution & Switchgear',
      'Commercial Plumbing & Gas Safety',
      'Building Fabric & Envelope Maintenance',
      'BMS & Energy Control Optimisation',
    ],
  },
  {
    id: 'compliance',
    number: '02',
    name: 'Planned Maintenance & Compliance',
    shortName: 'Compliance & PPM',
    tagline: 'SFG20 maintenance regimes, statutory inspections, and digital evidence.',
    description: 'Protecting dutyholders and property owners through disciplined 52-week maintenance calendars. Every statutory certificate, test sheet, and remedial action is captured in the EntireCAFM digital asset vault.',
    heroImage: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    heroAlt: 'EntireFM engineer conducting periodic fixed wire electrical testing (EICR) on commercial distribution board',
    statLabel: 'Statutory Regime Coverage',
    statValue: '10 Statutory Disciplines',
    primaryHref: '/ppm',
    featuredCapabilities: [
      'Planned Preventative Maintenance (PPM)',
      'Fixed Wire Testing & EICR Periodic Inspection',
      'Fire Detection & Life Safety Alarms',
      'Emergency Lighting Duration Testing',
      'Legionella Risk Assessments & Water Hygiene',
      'Gas Safety & Boiler Plant Certification',
    ],
  },
  {
    id: 'soft-fm',
    number: '03',
    name: 'Soft FM & Workplace Services',
    shortName: 'Soft FM',
    tagline: 'Commercial workplace hygiene, guarding, grounds, and estate presentation.',
    description: 'High-standard workplace support keeping commercial buildings clean, secure, welcoming, and productive. Coordinated alongside technical engineering to eliminate contractor friction across occupied sites.',
    heroImage: '/images/editorial/entirefm-reception-2000w.webp',
    heroAlt: 'EntireFM pristine commercial reception and managed corporate workplace environment',
    statLabel: 'Occupied Estate Management',
    statValue: '24/7 Operations',
    primaryHref: '/cleaning-services',
    featuredCapabilities: [
      'Commercial & Corporate Office Cleaning',
      'Manned Guarding, Concierge & Front-of-House',
      'External Grounds Maintenance & Landscaping',
      'Washroom Hygiene & Consumable Management',
      'Environmental Waste & Recycling Solutions',
      'Responsive Commercial Pest Management',
    ],
  },
  {
    id: 'specialist',
    number: '04',
    name: 'Specialist Engineering & High-Level Access',
    shortName: 'Specialist Access',
    tagline: 'IRATA rope access, BMU cradles, mobile crane lifts, and industrial works.',
    description: 'Eliminating scaffolding delays and excessive costs through certified rope access technicians, BMU cradle specialists, mobile crane operators, and heavy industrial decontamination crews.',
    heroImage: '/images/services/working-at-height/hero-rope-access.png',
    heroAlt: 'EntireFM IRATA-certified rope access technician performing high-level building maintenance on commercial façade',
    statLabel: 'High-Level Access Capability',
    statValue: 'IRATA / BMU Certified',
    primaryHref: '/working-at-height-rope-access-bmu',
    featuredCapabilities: [
      'IRATA Rope Access Building Maintenance',
      'Building Maintenance Unit (BMU) Operations',
      'Contract Mobile Crane Hire & Plant Lifts',
      'High-Level Façade Glazing & Structural Repairs',
      'Heavy Industrial Deep Cleaning & Decontamination',
      'Confined Space & Inaccessible Plant Surveys',
    ],
  },
  {
    id: 'drone',
    number: '05',
    name: 'Drone & Aerial Asset Intelligence',
    shortName: 'Drone Services',
    tagline: 'UAV roof inspections, thermal imaging, 3D reality capture, and solar surveys.',
    description: 'Sub-millimeter aerial inspection and thermal analysis without scaffolding or MEWPs. Converting high-resolution visual data directly into EntireCAFM maintenance work orders and structural reports.',
    heroImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    heroAlt: 'EntireFM commercial drone aerial building survey surveying commercial rooftop infrastructure',
    statLabel: 'High-Res Optical & Thermal',
    statValue: 'CAA Certified UAV Fleet',
    primaryHref: '/services/drone-services',
    featuredCapabilities: [
      'High-Level Drone Building Fabric Inspections',
      'Roof & Gutter Defect Condition Surveys',
      'Thermal Imaging & Heat Loss Diagnostics',
      'Commercial Solar PV Array Thermography',
      'Façade Cladding & Envelope Surveys',
      'Digital Twin 3D Reality Mesh Capture',
    ],
  },
];

/**
 * Curated Core Commercial Services
 * Fully valid routes with direct delivery capabilities.
 */
export const CURATED_SERVICES: CuratedService[] = [
  // ── Hard FM & Engineering ──────────────────────────────────────────
  {
    id: 'mechanical-electrical',
    number: '01',
    title: 'Mechanical & Electrical (M&E)',
    shortTitle: 'M&E Engineering',
    slug: '/mechanical-electrical',
    family: 'hard-fm',
    categoryLabel: 'Hard FM',
    shortDescription: 'Planned and reactive engineering for critical plant, power distribution, pumps, and switchrooms.',
    longDescription: 'Comprehensive M&E services delivering planned preventative maintenance, statutory testing, and 24/7 reactive fault resolution for commercial power, mechanical plant, and controls.',
    image: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineer conducting maintenance diagnostics on commercial switchgear',
    capabilities: ['LV/HV Distribution Boards', 'Substation & Transformer Care', 'Booster Pumps & Pressurisation', 'BMS Controls Integration'],
    complianceTags: ['BS 7671', 'Electricity at Work Regs 1989', 'SFG20'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'healthcare', 'education'],
    deliveryModel: 'Direct mobile engineering fleet + 24/7 emergency dispatch',
    featuredInExplorer: true,
    priority: 100,
  },
  {
    id: 'hvac-contractor',
    number: '02',
    title: 'HVAC & Commercial Air Conditioning',
    shortTitle: 'HVAC & Air Con',
    slug: '/hvac-contractor',
    family: 'hard-fm',
    categoryLabel: 'Hard FM',
    shortDescription: 'Plant performance, occupant comfort, chiller servicing, and statutory F-Gas compliance.',
    longDescription: 'Commercial chillers, rooftop condensers, air handling units (AHUs), VRF/VRV systems, and ventilation serviced by Refcom-certified HVAC engineers.',
    image: '/images/editorial/entirefm-hvac-rooftop-condensers-1920w.webp',
    imageAlt: 'EntireFM HVAC engineers inspecting commercial rooftop condenser banks at sunset',
    capabilities: ['Commercial Chiller Maintenance', 'AHU Filter & Belt Replacement', 'VRF / Split System Servicing', 'TM44 Energy Assessments'],
    complianceTags: ['F-Gas (EC 517/2014)', 'EPBD / TM44', 'BS EN 378'],
    sectors: ['commercial', 'industrial', 'retail', 'hospitality', 'healthcare', 'education'],
    deliveryModel: 'Dedicated HVAC mobile technicians with remote monitoring integration',
    featuredInExplorer: true,
    priority: 95,
  },
  {
    id: 'ppm',
    number: '03',
    title: 'Planned Preventative Maintenance (PPM)',
    shortTitle: 'PPM Programmes',
    slug: '/ppm',
    family: 'compliance',
    categoryLabel: 'Compliance',
    shortDescription: 'SFG20-aligned 52-week asset maintenance calendars formulated from physical barcoded audits.',
    longDescription: 'Proactive asset maintenance structured around manufacturer baselines and SFG20 standards to eliminate unexpected breakdowns and preserve capital asset longevity.',
    image: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    imageAlt: 'EntireFM technician barcoding physical assets for 52-week planned maintenance schedule',
    capabilities: ['52-Week Maintenance Scheduling', 'Barcoded Digital Asset Registers', 'SFG20 Task Alignment', 'Lifecycle Replacement Planning'],
    complianceTags: ['SFG20 Standard', 'ISO 55001 Asset Management', 'Statutory Baselines'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential', 'healthcare', 'education', 'hospitality'],
    deliveryModel: 'Centrally coordinated 52-week maintenance planner via EntireCAFM',
    featuredInExplorer: true,
    priority: 98,
  },
  {
    id: 'electrical-compliance',
    number: '04',
    title: 'Electrical Testing & Fixed Wire (EICR)',
    shortTitle: 'Electrical & EICR',
    slug: '/compliance/fixed-wire-testing-eicr',
    family: 'compliance',
    categoryLabel: 'Compliance',
    shortDescription: 'Periodic statutory inspection, thermal imaging, and remedial works across HV/LV installations.',
    longDescription: 'NICEIC-approved periodic electrical inspections (EICR), portable appliance testing (PAT), thermal thermography, and reactive electrical engineering.',
    image: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM qualified electrician testing circuit breakers during commercial EICR inspection',
    capabilities: ['Fixed Wire Inspection (EICR)', 'Thermal Imaging Thermography', 'PAT Portable Appliance Testing', 'Load Balancing & Remedials'],
    complianceTags: ['BS 7671 (18th Edition)', 'Electricity at Work 1989', 'NICEIC'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential', 'education'],
    deliveryModel: 'Qualified 18th Edition test & inspection engineers',
    featuredInExplorer: true,
    priority: 92,
  },
  {
    id: 'plumbing-gas',
    number: '05',
    title: 'Commercial Plumbing & Gas Safety',
    shortTitle: 'Plumbing & Gas',
    slug: '/plumbing-gas',
    family: 'hard-fm',
    categoryLabel: 'Hard FM',
    shortDescription: 'Booster sets, commercial boiler rooms, pipework integrity, and Gas Safe certification.',
    longDescription: 'Complete commercial plumbing and Gas Safe registered heating services, maintaining primary heating circuits, calorifiers, booster pumps, and drainage systems.',
    image: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    imageAlt: 'EntireFM gas engineer carrying out combustion analysis on commercial heating boiler',
    capabilities: ['Commercial Boiler Servicing', 'Gas Safety CP12/CP17 Certification', 'Water Booster Sets & Pumps', 'Underground Leak Detection'],
    complianceTags: ['Gas Safety (Installation & Use) 1998', 'Water Supply Regs 1999', 'Gas Safe Register'],
    sectors: ['commercial', 'industrial', 'hospitality', 'healthcare', 'education', 'residential'],
    deliveryModel: 'Gas Safe registered commercial heating & plumbing specialists',
    featuredInExplorer: true,
    priority: 88,
  },
  {
    id: 'fire-emergency-systems',
    number: '06',
    title: 'Fire & Life Safety Systems',
    shortTitle: 'Fire & Life Safety',
    slug: '/fire-emergency-systems',
    family: 'compliance',
    categoryLabel: 'Compliance',
    shortDescription: 'Fire alarm testing, emergency lighting 3-hour duration tests, smoke dampers, and suppression.',
    longDescription: 'Comprehensive statutory life safety maintenance ensuring full compliance with the Regulatory Reform (Fire Safety) Order and British Standards.',
    image: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'EntireFM fire safety engineer verifying optical smoke detection and panel interface',
    capabilities: ['Addressable Fire Alarm Testing', 'Emergency Lighting Duration Testing', 'Fire Damper Drop Testing', 'Dry Riser & Hydrant Testing'],
    complianceTags: ['BS 5839 (Fire Alarms)', 'BS 5266 (Emergency Light)', 'Regulatory Reform Order 2005'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential', 'hospitality', 'healthcare', 'education'],
    deliveryModel: 'BAFE-aligned statutory life safety engineering team',
    featuredInExplorer: true,
    priority: 90,
  },
  {
    id: 'water-hygiene',
    number: '07',
    title: 'Water Hygiene & Legionella Control',
    shortTitle: 'Water Hygiene',
    slug: '/compliance/legionella-water-hygiene',
    family: 'compliance',
    categoryLabel: 'Compliance',
    shortDescription: 'Legionella risk assessments, temperature profiling, tank chlorination, and UKAS sampling.',
    longDescription: 'Statutory water hygiene management compliant with ACOP L8 and HSG274, protecting occupant health across domestic water services and cooling towers.',
    image: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
    imageAlt: 'EntireFM water hygiene technician taking water temperature logging in commercial building',
    capabilities: ['ACOP L8 Risk Assessments', 'Monthly Temperature Logging', 'Cold Water Storage Tank Chlorination', 'UKAS Microbiological Sampling'],
    complianceTags: ['ACOP L8', 'HSG274 Parts 1-3', 'Water Supply (Water Fittings) 1999'],
    sectors: ['commercial', 'healthcare', 'hospitality', 'education', 'residential', 'industrial'],
    deliveryModel: 'Dedicated water hygiene sampling technicians & LCA compliance team',
    featuredInExplorer: true,
    priority: 87,
  },
  {
    id: 'building-maintenance',
    number: '08',
    title: 'Building Fabric & Structural Care',
    shortTitle: 'Building Fabric',
    slug: '/building-maintenance',
    family: 'hard-fm',
    categoryLabel: 'Hard FM',
    shortDescription: 'Internal and external envelope upkeep, glazing, roofing repairs, joinery, and planned refurbishments.',
    longDescription: 'Preserving commercial building fabric through planned inspections, structural repairs, waterproofing, flooring, acoustic partitioning, and carpentry.',
    image: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    imageAlt: 'Modern commercial office interior maintained by EntireFM fabric team',
    capabilities: ['Roofing & Gutter Remedials', 'Doors, Windows & Fire Door Checks', 'Internal Partitioning & Ceilings', 'Flooring & Painting Works'],
    complianceTags: ['Building Regulations 2010', 'Fire Door Safety Standards', 'BS 8213'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential', 'education'],
    deliveryModel: 'Multi-trade fabric technicians and mobile carpentry/glazing squads',
    featuredInExplorer: true,
    priority: 84,
  },

  // ── Soft FM & Workplace ───────────────────────────────────────────
  {
    id: 'cleaning-services',
    number: '09',
    title: 'Commercial & Office Cleaning',
    shortTitle: 'Commercial Cleaning',
    slug: '/cleaning-services',
    family: 'soft-fm',
    categoryLabel: 'Soft FM',
    shortDescription: 'Daily contract office cleaning, daytime janitorial support, and hygienic sanitisation.',
    longDescription: 'High-standard workplace cleaning programs tailored to corporate headquarters, multi-tenant offices, educational sites, and public amenities.',
    image: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM commercial cleaning team maintaining modern corporate workplace',
    capabilities: ['Daily Contract Office Cleaning', 'Daytime Janitorial & Housekeeping', 'Carpet & Upholstery Deep Clean', 'Touchpoint Sanitisation'],
    complianceTags: ['COSHH Regulations 2002', 'BICSc Standards', 'ISO 9001 / 14001'],
    sectors: ['commercial', 'retail', 'education', 'healthcare', 'hospitality'],
    deliveryModel: 'Vetted, uniformed cleaning teams managed with digital time-and-attendance',
    featuredInExplorer: false,
    priority: 85,
  },
  {
    id: 'industrial-cleaning',
    number: '10',
    title: 'Industrial & High-Level Cleaning',
    shortTitle: 'Industrial Cleaning',
    slug: '/industrial-cleaning',
    family: 'soft-fm',
    categoryLabel: 'Soft FM',
    shortDescription: 'Machinery degreasing, warehouse slab scrubbing, silo cleaning, and factory turnarounds.',
    longDescription: 'Specialist industrial decontamination, high-level structural beam vacuuming, factory floor scrubbing, and production line deep cleaning.',
    image: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    imageAlt: 'EntireFM industrial team performing heavy-duty decontamination in logistics facility',
    capabilities: ['Warehouse Floor Scrubbing', 'High-Level Truss & Duct Vacuuming', 'Machinery & Line Decontamination', 'Post-Construction Sparkle Cleans'],
    complianceTags: ['IPAF Certified', 'PASMA', 'Confined Spaces Regs 1997'],
    sectors: ['industrial', 'logistics', 'manufacturing', 'warehouse'],
    deliveryModel: 'Specialist industrial operators equipped with ride-on scrubber-dryers & MEWPs',
    featuredInExplorer: false,
    priority: 82,
  },
  {
    id: 'security-services',
    number: '11',
    title: 'Security, Guarding & Access Control',
    shortTitle: 'Security & Access',
    slug: '/security-services',
    family: 'soft-fm',
    categoryLabel: 'Soft FM',
    shortDescription: 'SIA-licensed guarding, mobile patrols, electronic access control, CCTV, and barrier systems.',
    longDescription: 'Protecting premises, occupants, and physical assets through licensed static guarding, keyholding, biometric door access, and perimeter security.',
    image: '/images/editorial/entirefm-access-control-install-2000w.webp',
    imageAlt: 'EntireFM technician commissioning commercial electronic access control system',
    capabilities: ['SIA Licensed Security Guarding', 'Mobile Keyholding & Alarm Response', 'Biometric & Card Access Control', 'Automated Gates & Turnstiles'],
    complianceTags: ['SIA Approved Contractor', 'BS 7858 Vetting', 'BS 7960 Static Guarding'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential'],
    deliveryModel: 'SIA-licensed personnel backed by 24/7 central monitoring desk',
    featuredInExplorer: false,
    priority: 80,
  },
  {
    id: 'grounds-maintenance',
    number: '12',
    title: 'Grounds Maintenance & Landscaping',
    shortTitle: 'Grounds & Landscaping',
    slug: '/grounds-maintenance',
    family: 'soft-fm',
    categoryLabel: 'Soft FM',
    shortDescription: 'External estate landscaping, grass cutting, hedge management, gritting, and weed control.',
    longDescription: 'Maintaining pristine curb appeal and safe outdoor environments across business parks, distribution centers, and corporate facilities.',
    image: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    imageAlt: 'Well-maintained business park grounds and commercial estate perimeter',
    capabilities: ['Grass Cutting & Lawn Care', 'Shrub & Tree Management', 'Winter Gritting & Snow Clearance', 'Hard Surface Weed Control'],
    complianceTags: ['PA1/PA6 Pesticide Certified', 'NPTC Tree Surgery', 'Environmental Protection Act'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'education', 'healthcare'],
    deliveryModel: 'Seasonal grounds care schedules + automated winter gritting triggers',
    featuredInExplorer: false,
    priority: 78,
  },
  {
    id: 'washroom-management',
    number: '13',
    title: 'Washroom & Hygiene Management',
    shortTitle: 'Washroom Services',
    slug: '/washroom-management',
    family: 'soft-fm',
    categoryLabel: 'Soft FM',
    shortDescription: 'Sanitary disposal, air care units, soap dispensing systems, and consumable restocking.',
    longDescription: 'Hygienic, compliant washroom management with regular scheduled service visits and duty-of-care waste transfer documentation.',
    image: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM managed commercial washroom and hygiene installation',
    capabilities: ['Sanitary Bin Collection & Disposal', 'Automated Air Care & Sanitisation', 'Soap & Paper Consumables Supply', 'Hand Dryer Servicing'],
    complianceTags: ['Environmental Protection Act 1990', 'Workplace (Health, Safety and Welfare) Regs 1992'],
    sectors: ['commercial', 'retail', 'education', 'hospitality', 'healthcare'],
    deliveryModel: 'Scheduled replenishment and certified hazardous waste disposal',
    featuredInExplorer: false,
    priority: 70,
  },

  // ── Specialist Engineering & Access ───────────────────────────────
  {
    id: 'working-at-height-rope-access-bmu',
    number: '14',
    title: 'Working at Height, Rope Access & BMU',
    shortTitle: 'Rope Access & BMU',
    slug: '/working-at-height-rope-access-bmu',
    family: 'specialist',
    categoryLabel: 'Specialist',
    shortDescription: 'IRATA rope access, BMU cradle maintenance, eye bolt testing, and high-level façade repairs.',
    longDescription: 'Specialist high-level building maintenance, glazing replacement, seal renewals, and high-rise façade cleaning without costly scaffolding.',
    image: '/images/services/working-at-height/hero-rope-access.png',
    imageAlt: 'EntireFM IRATA certified rope access technician suspended on commercial high-rise façade',
    capabilities: ['IRATA Rope Access Maintenance', 'BMU Cradle Operations & Testing', 'Façade Inspection & Glazing Repair', 'Safety Eyebolt & Fall Arrest Testing'],
    complianceTags: ['Work at Height Regulations 2005', 'BS 7985 (Rope Access)', 'BS EN 795 (Fall Protection)'],
    sectors: ['commercial', 'residential', 'industrial', 'hospitality'],
    deliveryModel: 'IRATA Level 1–3 certified technicians and LOLER-tested access equipment',
    featuredInExplorer: false,
    priority: 90,
  },
  {
    id: 'mobile-crane-hire',
    number: '15',
    title: 'Contract Crane Hire & Plant Lifting',
    shortTitle: 'Crane Hire & Lifting',
    slug: '/mobile-crane-hire',
    family: 'specialist',
    categoryLabel: 'Specialist',
    shortDescription: 'Contract lift planning, Böcker truck cranes, rooftop plant swaps, and LOLER-compliant lifts.',
    longDescription: 'Turnkey contract lifting operations managing complex chiller swaps, AHU installations, transformer positioning, and architectural glass lifts.',
    image: '/images/services/working-at-height/bmu-cradle-access.png',
    imageAlt: 'Mobile crane lifting heavy commercial plant onto commercial rooftop',
    capabilities: ['CPA Contract Lift Management', 'Rooftop Chiller & AHU Replacements', 'Appointed Persons & Slinger Signallers', 'Local Authority Road Closure Permits'],
    complianceTags: ['LOLER Regulations 1998', 'BS 7121 (Code of Practice for Cranes)', 'CPA Terms'],
    sectors: ['commercial', 'industrial', 'logistics', 'hospitality', 'retail'],
    deliveryModel: 'Certified Appointed Persons and dedicated mobile crane fleet',
    featuredInExplorer: false,
    priority: 75,
  },

  // ── Drone & Aerial Asset Intelligence ───────────────────────────────
  {
    id: 'drone-services-hub',
    number: '16',
    title: 'Commercial Drone Inspections & Surveys',
    shortTitle: 'Drone Inspections',
    slug: '/services/drone-services/drone-inspections',
    family: 'drone',
    categoryLabel: 'Drone Services',
    shortDescription: 'High-resolution optical UAV surveys of inaccessible roofs, façades, chimneys, and towers.',
    longDescription: 'CAA-authorised commercial drone surveys capturing high-detail 4K/8K imagery and defect mapping without scaffolding or rope access.',
    image: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    imageAlt: 'EntireFM commercial drone conducting high-resolution building survey over commercial roof',
    capabilities: ['High-Level Optical Defect Triage', 'Roof Membrane & Flashing Audits', 'Gutter Blockage & Drainage Surveys', 'Orthomosaic 2D Site Mapping'],
    complianceTags: ['CAA Operational Authorisation (GVC)', 'CAP 722 Drone Regulations', 'Air Navigation Order'],
    sectors: ['commercial', 'industrial', 'logistics', 'retail', 'residential', 'education'],
    deliveryModel: 'CAA-licensed UAV pilots with direct CAFM work order export',
    featuredInExplorer: false,
    priority: 89,
  },
  {
    id: 'drone-roof-inspections',
    number: '17',
    title: 'Drone Roof & Gutter Condition Surveys',
    shortTitle: 'Drone Roof Surveys',
    slug: '/services/drone-services/roof-inspections',
    family: 'drone',
    categoryLabel: 'Drone Services',
    shortDescription: 'Rapid condition auditing for flat, pitched, composite, and standing seam commercial roofs.',
    longDescription: 'Comprehensive condition reporting pinpointing roof punctures, ponding water, failing flashing, deteriorated rooflights, and blocked internal gutters.',
    image: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'Aerial view of commercial roof plant deck inspected by EntireFM drone team',
    capabilities: ['Rooflight & Skylight Inspection', 'Standing Seam & Composite Panel Audits', 'Parapet & Coping Stone Checks', 'Storm Damage Insurance Reports'],
    complianceTags: ['CAA Authorised', 'Work at Height Risk Elimination'],
    sectors: ['logistics', 'industrial', 'commercial', 'retail'],
    deliveryModel: 'Rapid drone deployment with annotated CAD/PDF defect reports',
    featuredInExplorer: false,
    priority: 83,
  },
  {
    id: 'drone-thermal-imaging',
    number: '18',
    title: 'Thermal Drone Imaging & Heat Loss',
    shortTitle: 'Thermal Drone Surveys',
    slug: '/services/drone-services/thermal-imaging',
    family: 'drone',
    categoryLabel: 'Drone Services',
    shortDescription: 'Radiometric infrared surveys detecting trapped moisture, insulation gaps, and thermal bridges.',
    longDescription: 'Advanced thermographic UAV flights mapping sub-surface roof insulation moisture ingress, building envelope heat loss, and electrical anomalies.',
    image: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    imageAlt: 'Thermal radiometric imaging showing heat loss and insulation anomalies on building envelope',
    capabilities: ['Sub-Surface Moisture Ingress Mapping', 'Building Envelope Heat Loss Scans', 'HVAC Ductwork Heat Dispersion', 'BREEAM Energy Loss Audits'],
    complianceTags: ['ISO 18436 Thermography Baselines', 'CAA Regulations'],
    sectors: ['commercial', 'industrial', 'logistics', 'residential'],
    deliveryModel: 'Certified Category II thermographers and radiometric UAV sensors',
    featuredInExplorer: false,
    priority: 81,
  },
  {
    id: 'drone-solar-inspections',
    number: '19',
    title: 'Drone Solar PV Thermography',
    shortTitle: 'Solar PV Drone Surveys',
    slug: '/services/drone-services/solar-pv-inspections',
    family: 'drone',
    categoryLabel: 'Drone Services',
    shortDescription: 'IEC-compliant aerial thermography detecting diode failures, hot spots, and string faults.',
    longDescription: 'Fast radiometric screening of large commercial rooftop and ground-mounted solar installations, maximising yield and fulfilling warranty claims.',
    image: '/images/editorial/entirefm-ev-charging-2000w.webp',
    imageAlt: 'Commercial solar PV array thermal diagnostic inspection',
    capabilities: ['Hot Spot & Defective Cell Detection', 'Bypass Diode Failure Identification', 'Soiling & Shading Impact Analysis', 'IEC 62446-3 Compliant Reports'],
    complianceTags: ['IEC 62446-3 Standard', 'CAA Commercial Flight Permissions'],
    sectors: ['logistics', 'industrial', 'commercial', 'education'],
    deliveryModel: 'Automated waypoint drone flight with serial-level defect tagging',
    featuredInExplorer: false,
    priority: 79,
  },
  {
    id: 'drone-digital-twin',
    number: '20',
    title: 'Digital Twin & 3D Reality Capture',
    shortTitle: '3D Reality Capture',
    slug: '/services/drone-services/digital-twin-3d-capture',
    family: 'drone',
    categoryLabel: 'Drone Services',
    shortDescription: 'High-density photogrammetry point clouds, BIM mesh models, and interactive digital twins.',
    longDescription: 'Generating millimeter-accurate 3D digital replicas of commercial buildings and estates for asset management, spatial planning, and contractor coordination.',
    image: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    imageAlt: '3D digital twin reality model of commercial building estate',
    capabilities: ['Photogrammetry Point Clouds (.LAS/.XYZ)', '3D Textured Mesh Models (.OBJ/.FBX)', 'BIM Model Integration (Revit/IFC)', 'Browser-Based 3D Measurement Tool'],
    complianceTags: ['RICS Geomatics Guidelines', 'ISO 19650 BIM Standards'],
    sectors: ['commercial', 'industrial', 'logistics', 'construction', 'healthcare'],
    deliveryModel: 'Georeferenced RTK drone capture with cloud 3D viewing portal',
    featuredInExplorer: false,
    priority: 76,
  },
];

/**
 * Service Navigator Deterministic Decision Matrix
 */
export const NAVIGATOR_SECTORS: EstateSectorOption[] = [
  { id: 'commercial', label: 'Commercial Office / Portfolio', description: 'Multi-tenant Grade A offices, corporate headquarters & business parks', iconName: 'building' },
  { id: 'industrial', label: 'Industrial / Manufacturing', description: 'Heavy process facilities, manufacturing plants & engineering units', iconName: 'factory' },
  { id: 'logistics', label: 'Logistics / Warehouse', description: 'Distribution centres, fulfillment hubs & ambient/cold storage', iconName: 'truck' },
  { id: 'retail', label: 'Retail / Public-Facing Estate', description: 'Shopping centres, retail parks, supermarkets & leisure public realm', iconName: 'shopping' },
  { id: 'education', label: 'Education / Campus', description: 'Universities, multi-academy trusts, colleges & private schools', iconName: 'school' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences', description: 'Clinical facilities, laboratories, care homes & cleanrooms', iconName: 'activity' },
  { id: 'residential', label: 'Residential Portfolio (BTR/PBSA)', description: 'Build-to-Rent, student accommodation & prime multi-unit blocks', iconName: 'home' },
  { id: 'hospitality', label: 'Hospitality / Hotels & Venues', description: 'Hotels, event arenas, leisure clubs & restaurants', iconName: 'coffee' },
  { id: 'multi-site', label: 'Multi-Site National Estate', description: 'Dispersed national branches, retail footprints & regional estates', iconName: 'layers' },
];

export const NAVIGATOR_REQUIREMENTS: EstateRequirementOption[] = [
  { id: 'planned-ppm', label: 'Planned Preventative Maintenance', discipline: 'PPM & SFG20', description: '52-week asset maintenance calendar and scheduled servicing' },
  { id: 'hvac-cooling', label: 'Heating, Ventilation & Cooling', discipline: 'HVAC & Climate', description: 'Chillers, AHUs, boilers, F-Gas compliance and climate control' },
  { id: 'mechanical-electrical', label: 'Mechanical & Electrical (M&E)', discipline: 'M&E Infrastructure', description: 'Switchgear, power distribution, pumps and critical plant' },
  { id: 'compliance-statutory', label: 'Statutory Safety & Compliance', discipline: 'Statutory Testing', description: 'EICR fixed wire, fire alarms, water hygiene and gas safety' },
  { id: 'commercial-cleaning', label: 'Commercial & Workplace Cleaning', discipline: 'Soft FM', description: 'Daily contract office cleaning, janitorial and hygiene services' },
  { id: 'building-fabric', label: 'Building Fabric & Repairs', discipline: 'Fabric Maintenance', description: 'Roofing, glazing, joinery, waterproofing and refurbishment' },
  { id: 'fire-life-safety', label: 'Fire Alarms & Emergency Lighting', discipline: 'Life Safety', description: 'BS 5839 detection, BS 5266 emergency lighting and dampers' },
  { id: 'access-security', label: 'Access Control & Security', discipline: 'Premises Security', description: 'SIA guarding, electronic door access, barriers and CCTV' },
  { id: 'high-level-access', label: 'High-Level Access & Rope Work', discipline: 'Specialist Access', description: 'Rope access, BMU cradles, high-level glazing and façade repair' },
  { id: 'emergency-reactive', label: '24/7 Emergency & Reactive Helpdesk', discipline: 'Emergency Response', description: 'Urgent breakdown triage, rapid attendance and out-of-hours cover' },
  { id: 'aerial-drone', label: 'Aerial Drone Building Survey', discipline: 'Drone Intelligence', description: 'UAV roof surveys, thermal heat loss scans and façade audits' },
  { id: 'total-fm', label: 'Total FM (Single Contract)', discipline: 'Integrated FM', description: 'Full Hard & Soft FM consolidation with dedicated CAFM desk' },
];

/**
 * Deterministic Recommendation Engine
 */
export function getNavigatorRecommendation(
  sectorId: string,
  requirementId: string
): NavigatorRecommendation {
  // 1. Total FM / Full Contract
  if (requirementId === 'total-fm') {
    return {
      primaryServiceId: 'ppm',
      supportingServiceIds: ['mechanical-electrical', 'hvac-contractor', 'cleaning-services', 'security-services', 'fire-emergency-systems'],
      deliveryModel: 'Single unified national contract, dedicated account manager, and 24/7 EntireCAFM portal.',
      complianceFocus: ['SFG20 Asset Register', 'Fixed Wire EICR', 'ACOP L8 Water Hygiene', 'F-Gas Logbooks', 'Fire Safety Order'],
      summaryNote: `Full facilities management consolidation for ${getSectorLabel(sectorId)}, integrating engineering, compliance, and workplace hygiene under single-source accountability.`,
    };
  }

  // 2. HVAC & Climate
  if (requirementId === 'hvac-cooling') {
    return {
      primaryServiceId: 'hvac-contractor',
      supportingServiceIds: ['ppm', 'mechanical-electrical', 'drone-thermal-imaging'],
      deliveryModel: 'Refcom-certified mobile HVAC engineers with priority emergency callout response.',
      complianceFocus: ['F-Gas Regulation (EC 517/2014)', 'TM44 Air Con Energy Inspections', 'BS EN 378 Refrigerant Safety'],
      summaryNote: `Commercial chiller, AHU, and air conditioning maintenance structured around the occupancy and thermal demands of your ${getSectorLabel(sectorId)}.`,
    };
  }

  // 3. M&E Infrastructure
  if (requirementId === 'mechanical-electrical') {
    return {
      primaryServiceId: 'mechanical-electrical',
      supportingServiceIds: ['electrical-compliance', 'ppm', 'plumbing-gas', 'hvac-contractor'],
      deliveryModel: 'Certified multi-skilled mobile engineering fleet with 24/7 helpdesk dispatch.',
      complianceFocus: ['BS 7671 18th Edition', 'Electricity at Work Regulations 1989', 'SFG20 Standards'],
      summaryNote: `Critical plant and electrical distribution maintenance designed for high reliability across ${getSectorLabel(sectorId)} operations.`,
    };
  }

  // 4. Statutory Compliance
  if (requirementId === 'compliance-statutory' || requirementId === 'fire-life-safety') {
    return {
      primaryServiceId: requirementId === 'fire-life-safety' ? 'fire-emergency-systems' : 'electrical-compliance',
      supportingServiceIds: ['water-hygiene', 'plumbing-gas', 'ppm', 'fire-emergency-systems'],
      deliveryModel: 'Accredited test engineers with digital certificate archiving in EntireCAFM.',
      complianceFocus: ['Periodic EICR (5-Year / 1-Year)', 'BS 5839 Fire Alarms', 'BS 5266 Emergency Lighting', 'ACOP L8 Legionella'],
      summaryNote: `Statutory compliance audit and testing programme ensuring complete legal protection for dutyholders operating ${getSectorLabel(sectorId)}.`,
    };
  }

  // 5. Commercial Cleaning & Soft FM
  if (requirementId === 'commercial-cleaning') {
    return {
      primaryServiceId: sectorId === 'industrial' || sectorId === 'logistics' ? 'industrial-cleaning' : 'cleaning-services',
      supportingServiceIds: ['washroom-management', 'grounds-maintenance', 'security-services'],
      deliveryModel: 'Vetted, uniformed cleaning teams with electronic time & attendance tracking.',
      complianceFocus: ['COSHH Safety Sheets', 'BICSc Method Statements', 'Environmental Waste Transfer Notes'],
      summaryNote: `High-standard workplace and industrial hygiene programs tailored to the operational shifts of your ${getSectorLabel(sectorId)}.`,
    };
  }

  // 6. High Level & Specialist Access
  if (requirementId === 'high-level-access') {
    return {
      primaryServiceId: 'working-at-height-rope-access-bmu',
      supportingServiceIds: ['mobile-crane-hire', 'drone-services-hub', 'building-maintenance'],
      deliveryModel: 'IRATA Level 1–3 rope access technicians and LOLER-tested BMU cradle operators.',
      complianceFocus: ['Work at Height Regulations 2005', 'LOLER Examination (6-Monthly)', 'BS 7985 Rope Access Code'],
      summaryNote: `Scaffolding-free access solutions for high-level façade repairs, glazing, and structural maintenance across ${getSectorLabel(sectorId)}.`,
    };
  }

  // 7. Aerial Drone Inspection
  if (requirementId === 'aerial-drone') {
    return {
      primaryServiceId: 'drone-services-hub',
      supportingServiceIds: ['drone-roof-inspections', 'drone-thermal-imaging', 'drone-digital-twin', 'building-maintenance'],
      deliveryModel: 'CAA-licensed UAV pilots with high-resolution optical and radiometric thermal sensors.',
      complianceFocus: ['CAA Operational Authorisation', 'CAP 722 Drone Flight Safety', 'Work at Height Risk Elimination'],
      summaryNote: `High-resolution visual and thermal drone surveys delivering rapid defect triage for roofs and facades across ${getSectorLabel(sectorId)}.`,
    };
  }

  // 8. Emergency / Reactive
  if (requirementId === 'emergency-reactive') {
    return {
      primaryServiceId: 'mechanical-electrical',
      supportingServiceIds: ['hvac-contractor', 'plumbing-gas', 'ppm'],
      deliveryModel: 'Contracted SLA response bands (2hr/4hr/same-day) with 24/7 technical triage.',
      complianceFocus: ['SLA Triage Logging', 'Dynamic Risk Assessment', 'First-Time Fix Tracking'],
      summaryNote: `Round-the-clock emergency attendance and technical fault management for ${getSectorLabel(sectorId)} critical infrastructure.`,
    };
  }

  // 9. Default / Planned PPM
  return {
    primaryServiceId: 'ppm',
    supportingServiceIds: ['mechanical-electrical', 'hvac-contractor', 'electrical-compliance', 'building-maintenance'],
    deliveryModel: 'Structured 52-week maintenance calendar backed by barcoded asset audits.',
    complianceFocus: ['SFG20 Maintenance Tasks', 'Statutory Certificate Management', 'Lifecycle Asset Replacement'],
    summaryNote: `Preventative maintenance programme formulated from a comprehensive physical asset condition audit for ${getSectorLabel(sectorId)}.`,
  };
}

function getSectorLabel(sectorId: string): string {
  const match = NAVIGATOR_SECTORS.find(s => s.id === sectorId);
  return match ? match.label : 'commercial estate';
}

/**
 * Filtered directory list strictly excluding SEO/location routes
 */
export const DIRECTORY_SERVICES: CuratedService[] = CURATED_SERVICES;
