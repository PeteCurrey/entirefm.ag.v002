/**
 * ENTIREFM SECTOR ARCHETYPES REGISTRY
 * =====================================
 * Single source of truth for tailored sector operating priorities,
 * systems groupings, challenges, operational models, KPIs, and imagery.
 *
 * Ensures each of the 39 sector pages receives deeply authentic,
 * industry-tailored presentation without generic repetitive layouts.
 */

import { BrandIconKey } from '@/components/ui/BrandIcon';

export interface SectorPriority {
  title: string;
  subtitle: string;
  iconName: BrandIconKey;
}

export interface SectorChallenge {
  title: string;
  problem: string;
  solution: string;
  statutoryStandard?: string;
}

export interface SectorSystemGroup {
  category: string;
  headline: string;
  items: string[];
}

export interface SectorOperatingStep {
  step: string;
  title: string;
  desc: string;
}

export interface SectorOperationalRealityItem {
  number?: string;
  title: string;
  description: string;
  detail?: string;
}

export interface SectorAnatomyCallout {
  area: string;
  title: string;
  description: string;
}

export interface SectorAnatomy {
  headline: string;
  subline: string;
  imageSrc: string;
  imageAlt: string;
  callouts: SectorAnatomyCallout[];
}

export interface SectorArchetype {
  id: string;
  name: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubline: string;
  heroImage: string;
  heroImageAlt: string;
  heroHighlightedTitle?: string;
  heroFacts: Array<{ label: string; value: string }>;
  operationalStatement: string;
  operationalLead: string;
  realityImage: string;
  realityImageAlt: string;
  realityImageCaption?: string;
  operationalRealities: SectorOperationalRealityItem[];
  anatomy?: SectorAnatomy;
  snapshotLead: string;
  snapshotPriorities: SectorPriority[];
  challengesHeadline: string;
  challengesSubline: string;
  challenges: SectorChallenge[];
  systemsHeadline: string;
  systemsSubline: string;
  systemGroups: SectorSystemGroup[];
  operatingModelHeadline: string;
  operatingModelSubline: string;
  operatingSteps: SectorOperatingStep[];
  technologyFocus: {
    badge: string;
    title: string;
    description: string;
    features: Array<{ title: string; desc: string }>;
  };
  metrics: Array<{ figure: string; label: string; detail: string }>;
  conversionCta: {
    headline: string;
    subheadline: string;
    badgeText: string;
  };
  relatedServiceSlugs: Array<{ name: string; href: string; tag: string }>;
}

export const SECTOR_ARCHETYPES: Record<string, SectorArchetype> = {
  // ── 1. INDUSTRIAL & MANUFACTURING ──────────────────────────────────────────
  industrial: {
    id: 'industrial',
    name: 'Industrial & Manufacturing',
    heroBadge: 'INDUSTRIAL & HEAVY PLANT FM',
    heroHeadline: 'Plant reliability where unplanned downtime is never an option.',
    heroSubline: 'Engineering-led facilities management built around factory shift patterns, statutory HSE governance, and high-voltage electrical resilience.',
    heroImage: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    heroImageAlt: 'EntireFM certified engineer conducting industrial switchroom survey in heavy manufacturing plant',
    heroHighlightedTitle: 'Plant Reliability & Uptime',
    heroFacts: [
      { label: 'PPM Discipline', value: 'Shift-Aligned PPM' },
      { label: 'Engineering Scope', value: 'HV/LV & Process Plant' },
      { label: 'Safety Governance', value: 'Strict LOTO & Permits' },
    ],
    operationalStatement: "A production plant doesn't stop because maintenance is due.",
    operationalLead: 'Industrial environments operate under continuous commercial and safety pressure. Plant availability directly dictates revenue.',
    realityImage: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    realityImageAlt: 'Industrial main switchgear inspection and thermographic testing',
    realityImageCaption: 'High-voltage panelboard maintenance executed during planned factory changeover window',
    operationalRealities: [
      {
        number: '01',
        title: 'Continuous Shift-Pattern Demands',
        description: 'Stopping active assembly lines for routine servicing incurs immediate throughput losses. Maintenance must be synchronised with tooling changeovers and planned night shutdowns.',
        detail: 'Pre-planned 52-week SFG20 routines scheduled around production calendars.',
      },
      {
        number: '02',
        title: 'High-Voltage Switchgear & Thermal Hot-Spots',
        description: 'Heavy continuous electrical load creates thermal stress and oxidation across main busbars. Calibrated infrared thermography identifies resistive hot-spots before breakers trip.',
        detail: 'Periodic EICR testing and full-load thermal imaging under active factory demand.',
      },
      {
        number: '03',
        title: 'Statutory LEV & Hazardous Fume Extraction',
        description: 'Welding fumes, chemical vapours, and dust extraction systems require strict 14-month thorough examination under COSHH Regulation 9 to protect operator health.',
        detail: 'Differential pressure logging and certified ductwork degreasing to TR19 standards.',
      },
      {
        number: '04',
        title: 'Rigorous LOTO & Permit-to-Work Administration',
        description: 'Uncontrolled contractor access in heavy mechanical environments introduces catastrophic safety liability. Every intervention requires formal Lock-Out / Tag-Out isolation.',
        detail: 'Digital permit authorization and RAMS verification in EntireCAFM before site access.',
      },
    ],
    anatomy: {
      headline: 'The Physical Anatomy of an Industrial Facility',
      subline: 'Critical plant zones and building services engineered for continuous manufacturing uptime:',
      imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      imageAlt: 'Industrial plant deck and process cooling infrastructure',
      callouts: [
        { area: 'High-Voltage Plant', title: 'Main HV/LV Switchrooms', description: 'Transformers, panelboards, power factor correction, and harmonic filtration banks.' },
        { area: 'Process Thermal', title: 'Boilers & Steam Plant', description: 'Commercial gas/oil boilers, PSSR written schemes, and expansion pump skids.' },
        { area: 'Air & Extraction', title: 'Local Exhaust Ventilation (LEV)', description: 'Fume extraction hoods, industrial ductwork, and ATEX-rated fan assemblies.' },
        { area: 'Building Envelope', title: 'High-Bay Lighting & Access', description: 'Overhead crane girder inspection, fast-action doors, and industrial floor maintenance.' },
      ],
    },
    snapshotLead: 'Engineering-led facilities management for heavy manufacturing plants, process facilities, and industrial estates where unplanned downtime costs thousands per hour.',
    snapshotPriorities: [
      { title: 'Production Line Uptime', subtitle: 'PPM scheduled around shift patterns and tooling shutdowns', iconName: 'operationalExcellence' },
      { title: 'Heavy HV/LV Distribution', subtitle: 'Main switchgear, transformers, busbars & power factor correction', iconName: 'powerElectrical' },
      { title: 'Statutory Safety & LEV', subtitle: 'Local exhaust ventilation, pressure vessels & DSEAR compliance', iconName: 'riskCompliance' },
      { title: 'Strict LOTO Governance', subtitle: 'Formal Lock-Out / Tag-Out and hot work permit administration', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Where industrial plant maintenance usually fails.',
    challengesSubline: 'Industrial environments operate under intense commercial pressure. Here is how EntireFM engineers resolve core plant vulnerabilities:',
    challenges: [
      {
        title: 'Production Schedule Clashes with Statutory Servicing',
        problem: 'Stopping active assembly or processing lines for routine mechanical/electrical maintenance incurs heavy throughput losses.',
        solution: 'EntireFM structures all major plant overhauls, boiler servicing, and distribution board tests into planned night-shift windows or bank holiday tooling shutdowns.',
        statutoryStandard: 'SFG20 Industrial Task Frequency & Machinery Directives',
      },
      {
        title: 'High-Load Switchgear & Thermal Hot-Spot Failures',
        problem: 'Continuous high electrical demand induces thermal stress, component oxidation, and breaker trips.',
        solution: 'Our mobile certified engineers deploy calibrated infrared thermography surveys during full production load to detect resistive hot spots before failures occur.',
        statutoryStandard: 'BS 7671 Wiring Regs & Electricity at Work Regulations 1989',
      },
      {
        title: 'Hazardous Airborne Contaminants & Fume Extraction',
        problem: 'Welding fumes, chemical vapours, and dust build-up trigger COSHH non-compliance and health hazards.',
        solution: 'Routine 14-month statutory LEV thorough examination and testing, ductwork degreasing, and filter differential pressure monitoring.',
        statutoryStandard: 'COSHH Regulation 9 & HSG258 LEV Engineering Guidance',
      },
      {
        title: 'Complex Multi-Contractor Permit-to-Work Oversight',
        problem: 'Uncontrolled contractor access in hazardous areas creates severe liability and plant safety risks.',
        solution: 'EntireCAFM enforces digital permit-to-work verification, RAMS pre-authorisation, and contractor competence checks before site access.',
        statutoryStandard: 'Health & Safety at Work etc. Act 1974 & CDM Regulations 2015',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Industrial Plants',
    systemsSubline: 'Complete self-delivered Hard FM, plantroom engineering, and specialist industrial maintenance scopes:',
    systemGroups: [
      {
        category: 'Heavy Electrical & Power',
        headline: 'High-load electrical infrastructure and distribution resilience',
        items: [
          'Main LV switchboard and panelboard servicing',
          'Periodic EICR fixed wire testing & thermal imaging',
          'Power factor correction (PFC) & harmonic filtration',
          'Emergency lighting 3-hour battery discharge testing',
          'Standby generator & UPS backup maintenance',
        ],
      },
      {
        category: 'Mechanical, Steam & Process Heating',
        headline: 'Industrial thermal plant and pressure systems',
        items: [
          'Commercial gas/oil boilers & steam generator servicing',
          'Pressure Systems Safety Regulations (PSSR) written schemes',
          'Process cooling chillers & cooling tower hygiene',
          'Circulation pumps, expansion vessels & booster sets',
          'Gas safety CP12 certification & solenoid interlocks',
        ],
      },
      {
        category: 'Ventilation, LEV & Environmental',
        headline: 'Industrial air quality, exhaust and temperature management',
        items: [
          'Local Exhaust Ventilation (LEV) 14-month statutory tests',
          'Industrial air handling units (AHUs) & filter exchanges',
          'Ductwork cleaning to TR19 industrial standards',
          'Destratification fan arrays & high-bay heating',
          'F-Gas refrigerant leak inspections and digital logs',
        ],
      },
      {
        category: 'Plant Fabric & Specialist Industrial Care',
        headline: 'Physical plant integrity and heavy environment maintenance',
        items: [
          'High-bay lighting & industrial luminaire maintenance',
          'Overhead crane track cleaning & structural girder vacuuming',
          'Heavy industrial floor scrubber-drying & chemical degreasing',
          'Roller shutter, fast-action door & loading bay repairs',
          'Spill response stations & hazardous waste coordination',
        ],
      },
    ],
    operatingModelHeadline: 'Industrial Facilities Operating Framework',
    operatingModelSubline: 'How EntireFM delivers structured, audit-ready engineering across high-stakes industrial facilities:',
    operatingSteps: [
      { step: '01', title: 'Asset Tagging & Baseline Survey', desc: 'Every switchboard, AHU, boiler, and pump is barcoded and logged with condition grading and SFG20 maintenance routines.' },
      { step: '02', title: 'Shutdown & Access Alignment', desc: 'Maintenance frequencies are synchronized with factory shift patterns and planned retooling shutdown periods.' },
      { step: '03', title: 'LOTO & Safe Systems of Work', desc: 'Engineers execute strict Lock-Out / Tag-Out isolation and digital permit-to-work protocols prior to touching plant.' },
      { step: '04', title: 'Digital CAFM Certification', desc: 'Test data, thermal scans, and statutory certificates upload immediately into your compliance portal in real-time.' },
      { step: '05', title: 'Lifecycle & Asset Health Reporting', desc: 'Quarterly executive reviews detailing plant degradation curves, forward capital planning, and energy efficiency.' },
    ],
    technologyFocus: {
      badge: 'CAFM & INDUSTRIAL TELEMETRY',
      title: 'Digital Plant Asset Tracking & Instant Statutory Evidence',
      description: 'Our Computer-Aided Facilities Management platform provides plant directors with live visibility over every maintenance task, asset health rating, and compliance certificate.',
      features: [
        { title: 'Barcode/QR Asset Registers', desc: 'Scan-verified engineer attendance at every distribution board and plant item.' },
        { title: 'Live Permit-to-Work Tracking', desc: 'Digital authorisation for hot works, confined spaces, and high-voltage isolations.' },
        { title: 'Real-Time Certificate Vault', desc: 'Instant search and export for EICRs, CP12s, LEV reports, and PSSR records.' },
        { title: 'Critical Spares Inventory', desc: 'Track essential replacement motors, belts, and contactors to ensure rapid MTTR.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Tasks', detail: 'Maintenance aligned strictly with engineering guidelines' },
      { figure: '24/7', label: 'Priority Emergency Response Desk', detail: 'Dedicated technical triage for critical plant stoppages' },
      { figure: 'Audit-Ready', label: 'Digital Compliance Vault', detail: 'Certificates timestamped and archived on job completion' },
    ],
    conversionCta: {
      headline: 'Need a More Reliable FM & Engineering Model for Your Plant?',
      subheadline: 'Consult directly with EntireFM technical directors. We develop custom PPM schedules and engineering support structured around your production shift patterns.',
      badgeText: 'INDUSTRIAL CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Core Hard FM' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'SFG20 Regimes' },
      { name: 'Commercial HVAC & Process Cooling', href: '/hvac-contractor', tag: 'Climate & Chillers' },
      { name: 'Specialist Industrial Cleaning', href: '/industrial-cleaning', tag: 'Deep Hygiene' },
      { name: 'Plumbing & Commercial Gas', href: '/plumbing-gas', tag: 'Boilers & Pipework' },
    ],
  },

  // ── 2. LOGISTICS & WAREHOUSING ─────────────────────────────────────────────
  'logistics-warehousing': {
    id: 'logistics-warehousing',
    name: 'Logistics & Warehousing Hubs',
    heroBadge: 'LOGISTICS & DISTRIBUTION FM',
    heroHeadline: 'Keep every loading bay moving and every vehicle turning.',
    heroSubline: 'Full-estate facilities management for high-throughput distribution centres, freight hubs, and multi-acre logistics parks.',
    heroImage: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    heroImageAlt: 'Large modern distribution centre at dusk with illuminated loading bays and heavy transport activity',
    heroHighlightedTitle: 'High-Throughput Distribution Logistics',
    heroFacts: [
      { label: 'Throughput Protection', value: 'Dock Leveller & Shutter Priority' },
      { label: 'Estate Scope', value: 'Internal M&E + External Yard' },
      { label: 'Coverage Model', value: '24/7 UK Mobile Support' },
    ],
    operationalStatement: 'A logistics hub is more than a shed.',
    operationalLead: 'When a single dock leveller or fast-action shutter fails, an entire loading lane halts. Logistics FM requires instantaneous technical response and total estate resilience.',
    realityImage: '/images/editorial/entirefm-site-arrival-2000w.webp',
    realityImageAlt: 'EntireFM engineering response vehicle arriving at major UK logistics park',
    realityImageCaption: 'Rapid engineer attendance across multi-bay distribution centre',
    operationalRealities: [
      {
        number: '01',
        title: '24/7 Vehicle Throughput & Turnaround',
        description: 'Freight turnaround cannot tolerate stuck roller shutters, misaligned dock seals, or hydraulic pump failures. Emergency repairs require contracted rapid attendance SLAs.',
        detail: 'Immediate dock leveller and fast-action industrial door triage.',
      },
      {
        number: '02',
        title: 'High-Bay Lighting & 15m Working-at-Height',
        description: 'Warehouse illumination directly governs picker safety and picking accuracy. Relamping, driver replacement, and sensor maintenance at 15 metres require IPAF-certified access.',
        detail: 'Planned access equipment and scheduled high-level luminaire PPM.',
      },
      {
        number: '03',
        title: 'MHE Battery Charging & Heavy 3-Phase Power',
        description: 'Forklift and automated guided vehicle (AGV) charging bays demand continuous high-current electrical stability, thermal imaging, and fire suppression testing.',
        detail: 'Dedicated distribution board thermal surveys and RCD trip testing.',
      },
      {
        number: '04',
        title: 'External Yard, Barriers & Winter Drainage',
        description: 'Multi-acre concrete yards, storm interceptors, security gatehouse barriers, and proactive winter gritting matter just as much as internal building fabric.',
        detail: 'Interceptor sampling, surface drainage clearing, and weather-triggered gritting.',
      },
    ],
    anatomy: {
      headline: 'The Operational Anatomy of a Modern Logistics Hub',
      subline: 'Comprehensive asset and infrastructure care across the internal facility and external yard:',
      imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
      imageAlt: 'Logistics facility loading bays and perimeter yard',
      callouts: [
        { area: 'Loading Operations', title: 'Hydraulic Dock Levellers', description: 'Pinch-point servicing, hydraulic fluid tests, dock shelters, and vehicle wheel guides.' },
        { area: 'High-Level Assets', title: '15m High-Bay LED Lighting', description: 'Occupancy sensors, emergency lighting batteries, and high-level busbar distribution.' },
        { area: 'MHE Infrastructure', title: 'Forklift Charging Bays', description: 'Dedicated charging sockets, eyewash stations, and heavy 3-phase switchgear protection.' },
        { area: 'External Realm', title: 'Yard Drainage & Security Gates', description: 'Stormwater interceptors, perimeter barrier motors, ANPR cameras, and winter gritting.' },
      ],
    },
    snapshotLead: 'Hard FM and estate maintenance engineered for distribution centres, cross-dock freight hubs, and high-volume logistics campuses.',
    snapshotPriorities: [
      { title: 'Dock Leveller & Shutter Uptime', subtitle: 'Priority mechanical servicing for loading bay equipment', iconName: 'operationalExcellence' },
      { title: 'High-Bay Lighting & Power', subtitle: 'IPAF-certified high-level electrical maintenance at 15m+', iconName: 'powerElectrical' },
      { title: 'External Yard & Interceptors', subtitle: 'Gully clearance, fuel interceptors & security gate automation', iconName: 'commercialBuildings' },
      { title: 'Winter Gritting & Resilience', subtitle: 'Weather-triggered salt gritting keeping vehicle lanes clear', iconName: 'twentyFourSevenOps' },
    ],
    challengesHeadline: 'Where logistics estate maintenance usually fails.',
    challengesSubline: 'High-velocity freight environments cannot afford maintenance bottlenecks. Here is how EntireFM engineers protect logistics throughput:',
    challenges: [
      {
        title: 'Dock Leveller Hydraulic Stoppages During Peak Cross-Docking',
        problem: 'A jammed hydraulic ram or worn dock seal takes an entire vehicle bay out of action, backing up HGV delivery queues.',
        solution: 'Quarterly hydraulic pressure tests, mechanical hinge lubrication, and rapid-response spares provisioning for fast-action doors.',
        statutoryStandard: 'PUWER 1998 & BS EN 1398 Dock Leveller Safety Standards',
      },
      {
        title: 'High-Level Lighting Outages Above Active Forklift Aisles',
        problem: 'Replacing failed luminaires at 15m height disrupts forklift routes and creates serious falling-object hazards.',
        solution: 'IPAF-certified engineers execute coordinated out-of-hours high-bay relamping and LED driver replacements using dedicated scissor lifts.',
        statutoryStandard: 'Work at Height Regulations 2005 & CIBSE SLL Lighting Guide 1',
      },
      {
        title: 'Yard Surface Ponding & Silted Fuel Interceptors',
        problem: 'Blocked stormwater drainage and unserviced interceptors trigger environmental EA fines and icy winter loading yards.',
        solution: 'Scheduled vacuum tanker jetting, oil-water separator sampling, and automated winter gritting triggered by Met Office temperature forecasts.',
        statutoryStandard: 'Environmental Protection Act 1990 & PPG3 Pollution Prevention',
      },
      {
        title: 'Heavy Vehicle Automated Barrier & Gate Failures',
        problem: 'Failed access control barriers trap delivery HGVs at the gatehouse, causing road congestion and delivery SLA penalties.',
        solution: 'Preventative motor servicing, loop detector testing, and manual override protocol training for on-site logistics security teams.',
        statutoryStandard: 'BS EN 12453 Safety in Use of Power Operated Doors',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Warehousing & Logistics',
    systemsSubline: 'Comprehensive Hard FM and external estate maintenance for national distribution networks:',
    systemGroups: [
      {
        category: 'Loading Bay & Industrial Doors',
        headline: 'Hydraulic dock levellers and fast-action door resilience',
        items: [
          'Hydraulic dock leveller PPM & cylinder inspection',
          'Fast-action rapid roll doors & roller shutter repairs',
          'Inflatable dock shelters, seals & wheel guide alignments',
          'Vehicle restraint interlocks & loading traffic lights',
          'Scissor lift tables & dock edge safety barrier testing',
        ],
      },
      {
        category: 'High-Bay Electrical & Power',
        headline: 'High-level lighting, MHE charging and distribution',
        items: [
          'High-bay LED luminaire maintenance & occupancy sensors',
          'Forklift MHE battery charging room electrical distribution',
          'Emergency lighting central battery and 3-hour tests',
          'Distribution board fixed-wire EICRs and thermal imaging',
          'External yard high-mast floodlight maintenance',
        ],
      },
      {
        category: 'HVAC, Destratification & Air',
        headline: 'Warehouse thermal balance, destratification and gas heating',
        items: [
          'Gas-fired radiant tube heaters & warm air blowers',
          'Ceiling destratification fan servicing & control balancing',
          'Office mezzanine VRV/VRF air conditioning maintenance',
          'Warehouse roof smoke vents (AOV) & extract louvres',
          'F-Gas compliant refrigerant inspections and leak logs',
        ],
      },
      {
        category: 'External Estate & Yard Infrastructure',
        headline: 'Heavy vehicle yards, drainage and perimeter security',
        items: [
          'Automated security barriers, sliding gates & ANPR',
          'Stormwater interceptor pumping & silt trap vacuuming',
          'Proactive winter gritting and snow clearance contracts',
          'Yard concrete joint sealing and barrier impact remedials',
          'Perimeter fencing integrity and external CCTV lighting',
        ],
      },
    ],
    operatingModelHeadline: 'Logistics Operating Model',
    operatingModelSubline: 'How EntireFM protects warehouse throughput through structured, proactive engineering:',
    operatingSteps: [
      { step: '01', title: 'Estate Asset Condition Survey', desc: 'Barcode-tagging every dock leveller, fast-action door, high-bay panel, and interceptor into EntireCAFM.' },
      { step: '02', title: 'Shift-Window Scheduling', desc: 'PPM tasks aligned strictly with freight intake peaks, dispatch waves, and quiet turnaround windows.' },
      { step: '03', title: 'Dedicated Spares Staging', desc: 'Pre-stocking critical dock fuses, door drive belts, and hydraulic valves on-site for rapid MTTR.' },
      { step: '04', title: 'Real-Time Compliance Vault', desc: 'PUWER certificates, EICR reports, and interceptor waste transfer notes archived digitally.' },
      { step: '05', title: 'Quarterly Estate Strategy Review', desc: 'Executive analysis of equipment downtime, energy consumption trends, and capital renewal priorities.' },
    ],
    technologyFocus: {
      badge: 'CAFM & LOGISTICS TELEMETRY',
      title: 'Digital Loading Bay Tracking & Instant Compliance Access',
      description: 'Our CAFM system provides logistics directors with real-time insight into equipment availability, reactive fault progress, and statutory certification.',
      features: [
        { title: 'Barcode Asset Verification', desc: 'Scan-verified attendance logging every engineer visit at the physical asset.' },
        { title: 'Fast Reactive Dispatch', desc: 'Direct operations desk dispatch for urgent dock leveller or security barrier outages.' },
        { title: 'Digital PUWER Compliance Vault', desc: 'Instant access to lifting equipment, door inspection, and electrical certificates.' },
        { title: 'Multi-Site Fleet View', desc: 'Consolidated performance reporting across regional distribution networks.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised Maintenance Routine', detail: 'Manufacturer-aligned task schedules preserving asset warranty' },
      { figure: '24/7', label: 'UK Priority Operations Desk', detail: 'Round-the-clock emergency engineer dispatch for bay stoppages' },
      { figure: 'Audit-Ready', label: 'Digital Compliance Vault', detail: 'Instant retrieval of PUWER, EICR, and statutory certificates' },
    ],
    conversionCta: {
      headline: 'Need More Reliable Facilities Management Across Your Logistics Estate?',
      subheadline: 'Connect with EntireFM logistics operations leads. We provide comprehensive Hard FM, dock maintenance, and yard infrastructure management built around your distribution schedule.',
      badgeText: 'LOGISTICS ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'SFG20 Regimes' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'High-Bay Power' },
      { name: 'Commercial HVAC & Air Quality', href: '/hvac-contractor', tag: 'Destratification' },
      { name: 'Building Fabric Maintenance', href: '/building-maintenance', tag: 'Doors & Docks' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Yard & Floor Care' },
    ],
  },

  // ── 3. RETAIL & SHOPPING CENTRES ───────────────────────────────────────────
  retail: {
    id: 'retail',
    name: 'Retail Parks & Shopping Centres',
    heroBadge: 'RETAIL & SHOPPING CENTRE FM',
    heroHeadline: 'Keep every store trading and every customer comfortable.',
    heroSubline: 'Facilities management built around trading hours, high public footfall, brand presentation standards, and statutory compliance across UK retail estates.',
    heroImage: '/images/editorial/entirefm-access-control-install-2000w.webp',
    heroImageAlt: 'EntireFM engineer maintaining commercial retail access control and entrance infrastructure',
    heroHighlightedTitle: 'Store Presentation & Trading Hours',
    heroFacts: [
      { label: 'Trading Hours Priority', value: 'Zero Trading Disruption' },
      { label: 'Footfall Focus', value: 'Customer Comfort & HVAC' },
      { label: 'Portfolio Scale', value: 'Multi-Site National PPM' },
    ],
    operationalStatement: "Retail buildings don't operate like offices.",
    operationalLead: 'Customer dwell time, store sales, and brand equity depend directly on seamless entrance access, fresh indoor climate, and immaculate amenities.',
    realityImage: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    realityImageAlt: 'EntireFM commercial building facade and retail access infrastructure',
    realityImageCaption: 'Storefront and entrance engineering completed prior to opening hours',
    operationalRealities: [
      {
        number: '01',
        title: 'Trading-Hour Protection & Out-of-Hours Care',
        description: 'All disruptive engineering, heavy plant overhauls, ductwork cleaning, and noisy fabric repairs must conclude before trading commences.',
        detail: 'Scheduled pre-opening access windows and evening maintenance shifts.',
      },
      {
        number: '02',
        title: 'Store Climate, HVAC & Air Curtains',
        description: 'Overheated trading floors or cold entrance draughts immediately drive shoppers away. Commercial VRV/VRF heating, cooling, and over-door air curtains must perform continuously.',
        detail: 'Pre-season chiller servicing and air curtain velocity calibration.',
      },
      {
        number: '03',
        title: 'Customer Amenities & Executive Washrooms',
        description: 'High public footfall quickly depletes washrooms and risks plumbing blockages. Continuous janitorial attendance and rapid sanitary repair protect visitor satisfaction.',
        detail: 'Proactive booster pump testing, descaling, and daily presentation audits.',
      },
      {
        number: '04',
        title: 'Automatic Entrances & Security Shutters',
        description: 'A jammed automatic sliding door or stuck security grille halts customer ingress and compromises store security. Immediate priority attendance is critical.',
        detail: 'BS EN 16005 automatic door compliance and roller shutter servicing.',
      },
    ],
    anatomy: {
      headline: 'The Customer Experience Anatomy of a Retail Estate',
      subline: 'The invisible building services maintaining trading floor comfort and public realm safety:',
      imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
      imageAlt: 'Modern commercial reception and retail front-of-house environment',
      callouts: [
        { area: 'Store Entrances', title: 'Automatic Doors & Air Curtains', description: 'BS EN 16005 safety sensors, over-door heaters, and rapid security shutter motors.' },
        { area: 'Trading Floor', title: 'Zoned Commercial HVAC', description: 'Even temperature balancing, fresh air ventilation rates, and low-noise air distribution.' },
        { area: 'Customer Amenities', title: 'High-Capacity Washrooms', description: 'Water booster pumps, sensor taps, continuous restocking, and statutory water hygiene.' },
        { area: 'Public Realm', title: 'Car Park & External Lighting', description: 'Surface drainage, EV charging bays, exterior floodlighting, and bollard maintenance.' },
      ],
    },
    snapshotLead: 'Integrated facilities management tailored for retail parks, shopping centres, flagship high-street stores, and multi-unit retail portfolios.',
    snapshotPriorities: [
      { title: 'Trading Hours Integrity', subtitle: 'Disruptive works scheduled strictly outside retail opening windows', iconName: 'twentyFourSevenOps' },
      { title: 'Customer Comfort & HVAC', subtitle: 'Zoned temperature stability, air curtains & indoor air quality', iconName: 'commercialBuildings' },
      { title: 'High-Footfall Washrooms', subtitle: 'Reliable water pressure, sensor sanitisation & rapid leak repair', iconName: 'commercialCleaning' },
      { title: 'Multi-Site National Delivery', subtitle: 'Centrally coordinated mobile engineering teams across UK chains', iconName: 'operationalExcellence' },
    ],
    challengesHeadline: 'Where retail estate maintenance usually fails.',
    challengesSubline: 'Retail operators face intense footfall pressure and tight trading margins. Here is how EntireFM engineers protect store trading:',
    challenges: [
      {
        title: 'Peak-Day HVAC Failure & Overheated Trading Floors',
        problem: 'A failed chiller on a busy trading Saturday drives shoppers out of the store, directly reducing sales and customer dwell time.',
        solution: 'Pre-season cooling maintenance, condenser coil washing, compressor load testing, and priority reactive attendance SLAs.',
        statutoryStandard: 'CIBSE Guide A Comfort Criteria & F-Gas Regulations',
      },
      {
        title: 'Automatic Entrance Door Breakdowns at Main Ingress',
        problem: 'A stuck automatic sliding door forces customers through narrow manual exits, causing accessibility breaches and customer frustration.',
        solution: 'Bi-annual BS EN 16005 automatic door servicing, sensor calibration, drive belt replacements, and 24/7 priority callout cover.',
        statutoryStandard: 'BS EN 16005 Safety of Power Operated Pedestrian Doors',
      },
      {
        title: 'Customer Washroom Outages & Drainage Blockages',
        problem: 'High customer footfall overwhelms public toilets, resulting in closures, bad odours, and brand damage.',
        solution: 'High-frequency preventive descaling, booster set maintenance, sanitary seal checks, and emergency drainage jetting.',
        statutoryStandard: 'Workplace Regulations 1992 & L8 ACoP Legionella Compliance',
      },
      {
        title: 'Multi-Store Compliance Inconsistencies Across National Chains',
        problem: 'Fragmented local contractors create gaps in statutory EICR and fire alarm certification across regional store branches.',
        solution: 'EntireFM acts as the single-source national provider, standardising SFG20 PPM schedules and archiving certificates in EntireCAFM.',
        statutoryStandard: 'Regulatory Reform (Fire Safety) Order 2005 & Electricity at Work Regs',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Retail Environments',
    systemsSubline: 'Full-spectrum Hard FM, climate control, and building services for retail chains and shopping centres:',
    systemGroups: [
      {
        category: 'Climate, HVAC & Air Curtains',
        headline: 'Comfort cooling, warm air curtains and store ventilation',
        items: [
          'VRV/VRF air conditioning and comfort cooling PPM',
          'Over-door warm air curtain servicing & velocity checks',
          'Air handling unit (AHU) filter exchanges & belt checks',
          'F-Gas refrigerant leak tests and digital logbook archives',
          'BMS retail operating schedule and setpoint optimisation',
        ],
      },
      {
        category: 'Electrical, Lighting & Life Safety',
        headline: 'Display illumination, emergency power and fire systems',
        items: [
          'Store display LED lighting maintenance & emergency fittings',
          'Periodic EICR fixed-wire testing & thermal imaging',
          'Fire alarm system testing, call points & interface checks',
          'Emergency lighting 3-hour battery discharge testing',
          'Pat testing, point-of-sale supply & switchboard checks',
        ],
      },
      {
        category: 'Entrances, Security & Fabric',
        headline: 'Automatic sliding doors, security grilles and glass',
        items: [
          'BS EN 16005 automatic door safety maintenance',
          'Security roller shutters, grilles & access key switches',
          'Storefront glazing inspection and rapid repair triage',
          'Flooring transition strips, tile repairs & threshold care',
          'Locksmith services, panic hardware & emergency exits',
        ],
      },
      {
        category: 'Public Realm & Customer Amenities',
        headline: 'Washrooms, car parks and external store environments',
        items: [
          'High-traffic public washroom plumbing & booster sets',
          'Legionella water temperature logging & sampling (L8)',
          'Car park lighting, barrier maintenance & EV chargers',
          'Drainage gully clearance & sanitary waste coordination',
          'Storefront jet-washing, chewing gum removal & facade care',
        ],
      },
    ],
    operatingModelHeadline: 'Retail Operating Model',
    operatingModelSubline: 'How EntireFM delivers flawless facilities care around your trading hours:',
    operatingSteps: [
      { step: '01', title: 'Estate Asset Baseline Survey', desc: 'Cataloguing every retail unit HVAC asset, automatic door, and switchboard into EntireCAFM.' },
      { step: '02', title: 'Trading Window Harmonisation', desc: 'Scheduling all servicing before store opening or after customer closing to guarantee zero trading friction.' },
      { step: '03', title: 'Direct Mobile Engineering', desc: 'Qualified local mobile engineers dispatched with common retail spares on-van for high first-time fix rates.' },
      { step: '04', title: 'Unified Digital Certification', desc: 'Live compliance dashboard displaying audit-ready certificates for every store in the portfolio.' },
      { step: '05', title: 'Quarterly Commercial Review', desc: 'Account management reviews detailing SLA performance, first-time fix ratios, and capital renewal advice.' },
    ],
    technologyFocus: {
      badge: 'CAFM & RETAIL PORTFOLIO TELEMETRY',
      title: 'Centralised Retail Estate Visibility Across Every Store',
      description: 'Our CAFM system provides retail property managers with live transparency across multi-store maintenance, reactive tickets, and compliance certificates.',
      features: [
        { title: 'Multi-Store Dashboard', desc: 'Instant portfolio-wide view of PPM completion and open reactive tasks.' },
        { title: 'Fast Work Order Triage', desc: 'Priority routing for urgent HVAC, entrance door, or plumbing emergencies.' },
        { title: 'Digital Compliance Archive', desc: 'Instant download of EICRs, fire certs, and water hygiene records for landlord audits.' },
        { title: 'SLA Performance Tracking', desc: 'Transparent reporting of engineer arrival times and first-time fix rates.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Tasks', detail: 'Tailored maintenance routines aligned with retail trading windows' },
      { figure: '24/7', label: 'Central Operations Desk', detail: 'Round-the-clock emergency attendance across national store estates' },
      { figure: 'Audit-Ready', label: 'Single-Source Compliance Vault', detail: 'Centralised certification for landlords, insurers, and local authorities' },
    ],
    conversionCta: {
      headline: 'Looking for a Single-Source FM Partner for Your Retail Estate?',
      subheadline: 'Speak directly with EntireFM retail operations leads. We self-deliver comprehensive Hard FM, HVAC, electrical, and fabric maintenance designed around your store trading hours.',
      badgeText: 'RETAIL ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Trading-Hour Care' },
      { name: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', tag: 'Store Comfort' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Fixed Wire & Power' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Public Realm' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Washroom Services' },
    ],
  },

  // ── 4. COMMERCIAL OFFICES & CORPORATE ──────────────────────────────────────
  'commercial-offices': {
    id: 'commercial-offices',
    name: 'Commercial Offices & Corporate Estates',
    heroBadge: 'COMMERCIAL OFFICES & CORPORATE HQ',
    heroHeadline: 'Workplace environments engineered for performance and comfort.',
    heroSubline: 'Integrated facilities management engineered for prime corporate headquarters, multi-tenant commercial office towers, and high-spec co-working campuses.',
    heroImage: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    heroImageAlt: 'EntireFM commercial facilities management across modern multi-storey corporate office building',
    heroHighlightedTitle: 'Workplace Experience & Asset Performance',
    heroFacts: [
      { label: 'Occupier Focus', value: 'Zoned Indoor Comfort' },
      { label: 'Delivery Model', value: 'Out-of-Hours Servicing' },
      { label: 'Governance', value: 'Transparent Service Charge' },
    ],
    operationalStatement: 'Office FM must balance tenant comfort with landlord asset protection.',
    operationalLead: 'Modern commercial occupiers expect flawless climate control, pristine common areas, and rapid fault resolution without disruptive daytime noise.',
    realityImage: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    realityImageAlt: 'EntireFM engineers conducting electrical testing in corporate office suite',
    realityImageCaption: 'Scheduled office compliance testing executed outside standard core working hours',
    operationalRealities: [
      {
        number: '01',
        title: 'Thermal Comfort & Zoned VRV/VRF Balancing',
        description: 'Inconsistent temperatures between glazed facades and core meeting rooms trigger constant occupier friction. Active damper balancing and BMS setpoint tuning ensure uniform climate.',
        detail: 'CIBSE Guide A comfort criteria and seasonal HVAC recommissioning.',
      },
      {
        number: '02',
        title: 'Discreet Out-of-Hours Engineering',
        description: 'Noisy maintenance, plant room overhauls, and statutory emergency lighting discharge testing must occur when desks are empty to protect workplace productivity.',
        detail: 'Contracted out-of-hours access windows with zero disruption to office hours.',
      },
      {
        number: '03',
        title: 'Executive Amenities & Washroom Presentation',
        description: 'High-density desk occupancy strains washrooms and meeting suites. Daytime janitorial presence, automatic consumables replenishment, and instant leak triage keep presentation flawless.',
        detail: 'Daily quality audits and scheduled water booster pump testing.',
      },
      {
        number: '04',
        title: 'Transparent Service Charge Demarcation',
        description: 'Clear separation between landlord base-build plant and tenant demise assets prevents billing disputes and accelerates necessary repairs.',
        detail: 'CAFM asset registers mapped with demise tagging and auditable work records.',
      },
    ],
    anatomy: {
      headline: 'The Infrastructure Anatomy of a Prime Corporate Office',
      subline: 'The essential building services maintaining occupant comfort and statutory compliance:',
      imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1920w.webp',
      imageAlt: 'Corporate rooftop condenser bank and chiller installation',
      callouts: [
        { area: 'Plant Rooftop', title: 'Chillers & Rooftop Condensers', description: 'Central base-build cooling, primary pump skids, and TM44 energy inspections.' },
        { area: 'Occupied Floors', title: 'VRV/VRF Fan Coil Units (FCUs)', description: 'Zoned temperature sensors, secondary filters, and condensate drainage lines.' },
        { area: 'Core Electrical', title: 'Main Switchrooms & UPS', description: 'Periodic fixed-wire EICRs, power distribution panels, and standby power resilience.' },
        { area: 'Common Parts', title: 'Reception & Life Safety', description: 'Access control speed gates, passenger lift monitoring, and addressable fire alarms.' },
      ],
    },
    snapshotLead: 'Integrated facilities management engineered for prime corporate headquarters, multi-tenant commercial offices, and flexible co-working spaces.',
    snapshotPriorities: [
      { title: 'Indoor Air Quality & Comfort', subtitle: 'VRV/VRF temperature balance, fresh air ventilation & filtration', iconName: 'commercialBuildings' },
      { title: 'Immaculate Presentation', subtitle: 'High-frequency day janitors, executive washrooms & fabric care', iconName: 'commercialCleaning' },
      { title: 'Out-of-Hours Engineering', subtitle: 'Noisy maintenance and compliance testing scheduled when desks are empty', iconName: 'twentyFourSevenOps' },
      { title: 'Transparent Service Charge Audit', subtitle: 'Clear digital reporting partitioned by tenant and landlord demises', iconName: 'dataInsights' },
    ],
    challengesHeadline: 'Where commercial office maintenance usually fails.',
    challengesSubline: 'Modern office occupiers expect perfect climate control and rapid fault resolution. Here is how EntireFM manages corporate real estate:',
    challenges: [
      {
        title: 'Thermal Discomfort & HVAC Zoning Complaints',
        problem: 'Inconsistent temperatures between glazed facades and internal meeting rooms trigger constant tenant friction.',
        solution: 'Our HVAC technicians balance airflow dampers, service VRV/VRF fan coil units (FCUs), and optimize BMS setpoints for even comfort distribution.',
        statutoryStandard: 'CIBSE Guide A Comfort Criteria & TM44 Energy Auditing',
      },
      {
        title: 'Disruptive Daytime Maintenance in Occupied Floors',
        problem: 'Drilling, power shutdowns, or noisy vacuuming during working hours severely impacts productivity and calls.',
        solution: 'EntireFM schedules all heavy engineering, emergency lighting discharge tests, and deep extraction out-of-hours or over weekends.',
        statutoryStandard: 'Contracted Access Window Governance',
      },
      {
        title: 'Executive Washroom Hygiene & High-Traffic Presentation',
        problem: 'High-density desk occupancy strains washroom facilities, leading to consumable stockouts and odour complaints.',
        solution: 'Proactive daytime janitorial presence with digital consumable restocking schedules, sanitary testing, and immediate leak triage.',
        statutoryStandard: 'Workplace (Health, Safety and Welfare) Regulations 1992',
      },
      {
        title: 'Landlord vs Tenant Demise Demarcation',
        problem: 'Disputes over who pays for specific plant failures (e.g. tenant FCUs vs central base-build chillers) delay critical repairs.',
        solution: 'Our CAFM categorises asset ownership at initial survey, providing indisputable evidence packs for service charge reconciliations.',
        statutoryStandard: 'RICS Commercial Service Charges Code of Practice',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Corporate Offices',
    systemsSubline: 'Full Hard and Soft FM solutions engineered for Grade A offices and commercial headquarters:',
    systemGroups: [
      {
        category: 'HVAC, Climate & Indoor Air Quality',
        headline: 'Comfort cooling, heat recovery ventilation and air balance',
        items: [
          'VRV/VRF multi-split air conditioning servicing',
          'Fan coil unit (FCU) filter cleaning & condensate flushes',
          'Air Handling Units (AHUs) & heat recovery thermal wheels',
          'Chiller plant PPM, compressor oil tests & F-Gas logs',
          'BMS schedule optimization & CO2 air quality monitoring',
        ],
      },
      {
        category: 'Electrical, Lighting & Power Resilience',
        headline: 'Power continuity, architectural lighting and fixed wire',
        items: [
          'Periodic 5-year EICR fixed-wire electrical testing',
          'Architectural LED lighting controls & DALI ballast checks',
          'Emergency lighting 3-hour battery discharge testing',
          'Uninterruptible Power Supply (UPS) & generator testing',
          'Floor box power relocations & commercial PAT testing',
        ],
      },
      {
        category: 'Life Safety, Fire & Access Control',
        headline: 'Building security, speed lanes and life safety',
        items: [
          'Addressable fire alarm testing & optical detector cleans',
          'Access control speed gates, card readers & turnstiles',
          'CCTV surveillance systems & intruder alarm maintenance',
          'Automatic smoke damper drop testing & fire door audits',
          'Disabled refuge intercoms & panic alarm system servicing',
        ],
      },
      {
        category: 'Building Fabric & Executive Presentation',
        headline: 'Workplace cleanliness, washrooms and interior fabric',
        items: [
          'Daytime janitorial & evening contract office cleaning',
          'Executive washroom plumbing, sensor taps & hygiene',
          'Legionella water temperature sampling & shower descaling',
          'Raised access flooring tile adjustments & carpet cleaning',
          'Glazed partition care, acoustic seals & door closer checks',
        ],
      },
    ],
    operatingModelHeadline: 'Corporate Operating Model',
    operatingModelSubline: 'How EntireFM delivers five-star facilities management for corporate real estate:',
    operatingSteps: [
      { step: '01', title: 'Asset Demarcation & Survey', desc: 'Cataloguing base-build vs tenant demise equipment into EntireCAFM with clear service charge tagging.' },
      { step: '02', title: 'Occupancy-Aware Scheduling', desc: 'Executing all heavy plant servicing and statutory tests outside standard office working hours.' },
      { step: '03', title: 'Direct Engineer Deployment', desc: 'Assigned mobile technical engineers familiar with your building layout, BMS setpoints, and plant rooms.' },
      { step: '04', title: 'Live Compliance Transparency', desc: 'Online portal providing property managers with immediate certificate access and SLA performance.' },
      { step: '05', title: 'Service Charge Strategy', desc: 'Comprehensive monthly reporting supporting RICS service charge reconciliation and forward capex planning.' },
    ],
    technologyFocus: {
      badge: 'CAFM & CORPORATE ASSET INTELLIGENCE',
      title: 'Digital Workplace Governance & Service Charge Transparency',
      description: 'Our CAFM platform provides managing agents and occupiers with real-time visibility over asset status, reactive work orders, and statutory certification.',
      features: [
        { title: 'Demise Asset Tagging', desc: 'Clear digital segregation of tenant vs landlord maintainable plant items.' },
        { title: 'Occupant Helpdesk Logging', desc: 'Streamlined ticket submission for temperature adjustments or minor repairs.' },
        { title: 'Live Compliance Vault', desc: 'Searchable EICRs, TM44 reports, fire certificates, and water hygiene records.' },
        { title: 'Executive SLA Dashboards', desc: 'Transparent reporting of first-time fix rates and response times.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Routines', detail: 'Maintenance aligned with CIBSE and manufacturer specifications' },
      { figure: 'Out-of-Hours', label: 'Scheduled Service Windows', detail: 'Disruptive engineering executed when floors are unoccupied' },
      { figure: 'RICS', label: 'Service Charge Ready', detail: 'Clear asset demarcation supporting auditable expenditure' },
    ],
    conversionCta: {
      headline: 'Seeking a Higher Standard of Facilities Management for Your Office Estate?',
      subheadline: 'Speak directly with EntireFM commercial operations leaders. We provide comprehensive Hard & Soft FM designed to enhance workplace comfort and preserve building asset value.',
      badgeText: 'OFFICE ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial HVAC & Air Quality', href: '/hvac-contractor', tag: 'VRV/VRF Climate' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Fixed Wire & Power' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'SFG20 Schedules' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Office Hygiene' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Washroom Services' },
    ],
  },

  // ── 5. HEALTHCARE & CLINICAL FACILITIES ────────────────────────────────────
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Clinical Facilities',
    heroBadge: 'HEALTHCARE & CLINICAL FM',
    heroHeadline: 'Clinical continuity and air quality assurance.',
    heroSubline: 'Specialist facilities management engineered for private hospitals, outpatient clinics, diagnostic centres, and medical facilities.',
    heroImage: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
    heroImageAlt: 'EntireFM specialist technician servicing medical-grade air handling filtration in clinical healthcare facility',
    heroHighlightedTitle: 'Clinical Infection Control & Compliance',
    heroFacts: [
      { label: 'Compliance Standard', value: 'HTM & HBN Aligned' },
      { label: 'Water Hygiene', value: 'Strict L8 Legionella Care' },
      { label: 'Power Resilience', value: 'Dual-Source Supply' },
    ],
    operationalStatement: 'Healthcare facilities demand non-negotiable hygiene and plant continuity.',
    operationalLead: 'In clinical environments, air change rates, water temperature regimes, and standby power are directly tied to patient safety and CQC compliance.',
    realityImage: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    realityImageAlt: 'EntireFM clinical HVAC thermographic inspection and air filtration testing',
    realityImageCaption: 'Specialist ventilation and air filtration testing in medical facility',
    operationalRealities: [
      {
        number: '01',
        title: 'HTM 03-01 Specialist Ventilation Compliance',
        description: 'Surgical suites, cleanrooms, and consultation rooms require verified air change rates, HEPA filtration integrity, and positive/negative pressure cascades.',
        detail: 'Airflow velocity verification and certified HEPA filter replacements.',
      },
      {
        number: '02',
        title: 'HTM 04-01 Water Hygiene & Legionella Control',
        description: 'Vulnerable patient populations require rigorous water temperature monitoring, sentinel outlet testing, TMV failsafe audits, and periodic microbiological sampling.',
        detail: 'Weekly flushing protocols and monthly digital temperature logging.',
      },
      {
        number: '03',
        title: 'Uninterrupted Power Supply & Standby Generation',
        description: 'Diagnostic equipment, clean storage, and life safety systems rely on zero power interruptions. Essential electrical circuits must switch seamlessly under load.',
        detail: 'Periodic generator load bank testing and UPS battery impedance checks.',
      },
      {
        number: '04',
        title: 'Infection Control Cleaning & Medical Waste Protocol',
        description: 'High-touch clinical surfaces, decontamination suites, and patient waiting areas require medical-grade biocidal cleaning and strict hazardous waste segregation.',
        detail: 'Colour-coded microfiber systems and audited clinical waste chain of custody.',
      },
    ],
    anatomy: {
      headline: 'The Clinical Infrastructure of a Healthcare Facility',
      subline: 'Critical building services engineered to support medical operations and statutory hygiene:',
      imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
      imageAlt: 'Clinical water heating and pressure testing installation',
      callouts: [
        { area: 'Air Quality', title: 'Specialist AHU & HEPA Filtration', description: 'HEPA filter banks, pressure differential gauges, and UV-C sterilization.' },
        { area: 'Water Safety', title: 'Calorifiers & TMV Valves', description: 'Pasteurisation cycles, thermostatic mixing valves, and digital temperature sensors.' },
        { area: 'Power Resilience', title: 'Essential LV Switchboards & UPS', description: 'Isolated power supplies (IPS), medical-grade grounding, and generator changeover.' },
        { area: 'Clinical Environment', title: 'Medical Gas & Plant Fabric', description: 'Medical air manifold rooms, non-porous hygienic wall cladding, and sealed vinyl floors.' },
      ],
    },
    snapshotLead: 'Specialist Hard and Soft FM engineered for private healthcare clinics, dental surgeries, diagnostic imaging centres, and medical office buildings.',
    snapshotPriorities: [
      { title: 'HTM 03-01 Air Quality', subtitle: 'Specialist clinical ventilation, pressure regimes & HEPA filter changes', iconName: 'commercialBuildings' },
      { title: 'HTM 04-01 Water Hygiene', subtitle: 'Rigorous Legionella sampling, sentinel temp logs & TMV testing', iconName: 'riskCompliance' },
      { title: 'Standby Power & UPS', subtitle: 'Critical electrical distribution and generator changeover testing', iconName: 'powerElectrical' },
      { title: 'CQC Audit-Ready Records', subtitle: 'Timestamped digital certification for statutory health inspectors', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Where healthcare estate maintenance usually fails.',
    challengesSubline: 'Clinical environments cannot tolerate compliance gaps or temperature deviations. Here is how EntireFM delivers medical facilities support:',
    challenges: [
      {
        title: 'Inadequate Ventilation Rates in Clinical Treatment Rooms',
        problem: 'Blocked filters or slipping drive belts reduce fresh air changes below statutory HTM guidelines, risking airborne pathogen buildup.',
        solution: 'Scheduled quarterly airflow volume measurements, differential pressure transducer testing, and certified HEPA filter replacements.',
        statutoryStandard: 'Health Technical Memorandum (HTM) 03-01 Specialised Ventilation',
      },
      {
        title: 'Legionella Proliferation in Low-Use Water Outlets',
        problem: 'Dead legs and low-turnover sinks develop biofilm, risking microbiological contamination in healthcare environments.',
        solution: 'Weekly structured flushing schedules, monthly digital temperature logging at sentinel points, and annual TMV failsafe testing.',
        statutoryStandard: 'HTM 04-01 Safe Water in Healthcare Premises & HSE L8 ACoP',
      },
      {
        title: 'Mains Power Glitches Disrupting Medical Diagnostic Equipment',
        problem: 'Micro-interruptions on the electrical grid cause imaging scanners and laboratory chillers to shut down unexpectedly.',
        solution: 'Monthly no-break load transfer testing between mains and standby generators, coupled with UPS battery impedance checks.',
        statutoryStandard: 'HTM 06-01 Electrical Services Supply and Distribution',
      },
      {
        title: 'Dispersed Paper Records During CQC Regulatory Audits',
        problem: 'Missing hard-copy maintenance certificates during unannounced CQC or local authority inspections lead to warning notices.',
        solution: 'EntireCAFM centralises every water test, EICR, fire log, and ventilation report in a dedicated digital compliance vault.',
        statutoryStandard: 'Care Quality Commission (CQC) Regulation 15 Premises Governance',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Healthcare Estates',
    systemsSubline: 'HTM-compliant engineering and statutory building maintenance for healthcare providers:',
    systemGroups: [
      {
        category: 'Clinical Ventilation & Air Quality',
        headline: 'HTM 03-01 compliant specialized ventilation systems',
        items: [
          'Air Handling Units (AHUs) with multi-stage HEPA filtration',
          'Pressure cascade differential monitoring & validation',
          'Specialist cleanroom & treatment suite airflow velocity tests',
          'Ductwork sanitisation and microbiological swab testing',
          'Comfort cooling VRV/VRF servicing and F-Gas inspection',
        ],
      },
      {
        category: 'Water Hygiene & Legionella Control',
        headline: 'HTM 04-01 compliant water systems and plumbing',
        items: [
          'Monthly sentinel hot and cold water temperature logging',
          'Thermostatic Mixing Valve (TMV) servicing and failsafe audits',
          'Calorifier inspection, pasteurisation cycles & descaling',
          'UKAS-accredited laboratory Legionella & TVC water sampling',
          'Water softener servicing & backflow prevention testing',
        ],
      },
      {
        category: 'Electrical, Power Resilience & Lighting',
        headline: 'HTM 06-01 electrical resilience and clean power',
        items: [
          'Medical-grade isolated power supplies (IPS) and UPS testing',
          'Standby generator automated mains failure (AMF) testing',
          'Fixed wire EICR testing & thermographic switchboard surveys',
          'Emergency escape lighting 3-hour battery discharge testing',
          'Clinical luminaire maintenance & examination light testing',
        ],
      },
      {
        category: 'Infection Prevention & Clinical Fabric',
        headline: 'Clinical environmental hygiene and fabric integrity',
        items: [
          'Medical-grade biocidal contract cleaning & sanitisation',
          'Hygienic vinyl flooring welding and coving maintenance',
          'Non-porous hygienic wall cladding inspection and sealing',
          'Fire door integrity inspections and acoustic seal checks',
          'Clinical sharps & hazardous waste compliance coordination',
        ],
      },
    ],
    operatingModelHeadline: 'Healthcare Operating Model',
    operatingModelSubline: 'How EntireFM delivers audit-ready clinical engineering with zero patient disruption:',
    operatingSteps: [
      { step: '01', title: 'HTM Baseline Audit & Tagging', desc: 'Conducting a rigorous technical survey of all ventilation, water, and electrical assets against HTM standards.' },
      { step: '02', title: 'Clinical Window Scheduling', desc: 'Aligning plant servicing with clinic operating hours and diagnostic scheduling.' },
      { step: '03', title: 'Infection Control Protocol', desc: 'Engineers wear medical-grade PPE and execute formal dust-containment procedures during maintenance.' },
      { step: '04', title: 'Digital CQC Compliance Vault', desc: 'Uploading water temperatures, filter certificates, and EICR tests instantly into EntireCAFM.' },
      { step: '05', title: 'Quarterly Governance Review', desc: 'Presenting formal compliance evidence packs to clinical directors and health & safety committees.' },
    ],
    technologyFocus: {
      badge: 'CAFM & CLINICAL COMPLIANCE',
      title: 'Digital Health Compliance Vault & Audit Transparency',
      description: 'Our CAFM platform provides healthcare operators with instant access to statutory certificates, temperature logs, and PPM completion records.',
      features: [
        { title: 'HTM Compliance Logging', desc: 'Digital recording of every ventilation validation and water temperature test.' },
        { title: 'Audit-Ready Export', desc: 'Instant PDF export for CQC, landlord, and environmental health inspections.' },
        { title: 'Critical Plant Alerts', desc: 'Real-time notification for chiller, ventilation, or pump alarms.' },
        { title: 'Full Traceability', desc: 'Scan-verified engineer attendance logs for total accountability.' },
      ],
    },
    metrics: [
      { figure: 'HTM', label: 'Guideline Compliant', detail: 'Ventilation, water, and electrical systems maintained to health standards' },
      { figure: '24/7', label: 'Emergency Technical Triage', detail: 'Immediate response for critical healthcare plant faults' },
      { figure: 'CQC', label: 'Audit-Ready Platform', detail: 'Centralised digital records for regulatory premises inspections' },
    ],
    conversionCta: {
      headline: 'Require HTM-Compliant Facilities Management for Your Healthcare Estate?',
      subheadline: 'Speak directly with EntireFM healthcare engineering directors. We provide specialized Hard FM, clinical ventilation, water hygiene, and compliance management.',
      badgeText: 'HEALTHCARE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial HVAC & Air Filtration', href: '/hvac-contractor', tag: 'HTM 03-01 Air' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'HTM 04-01 Water' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Critical Power' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Statutory Care' },
      { name: 'Specialist Commercial Cleaning', href: '/commercial-cleaning', tag: 'Clinical Hygiene' },
    ],
  },

  // ── 6. EDUCATION & UNIVERSITIES ───────────────────────────────────────────
  education: {
    id: 'education',
    name: 'Education & Universities',
    heroBadge: 'EDUCATION & UNIVERSITY ESTATES',
    heroHeadline: 'Campus estates maintained around academic terms.',
    heroSubline: 'Full-spectrum facilities management engineered for universities, multi-academy trusts, independent colleges, and school campuses.',
    heroImage: '/images/editorial/entirefm-sheffield-rooftop-survey-1920w.webp',
    heroImageAlt: 'EntireFM facilities management across modern university campus and educational buildings',
    heroHighlightedTitle: 'Safeguarding & Term-Time Continuity',
    heroFacts: [
      { label: 'Security Vetting', value: 'Enhanced DBS Clearance' },
      { label: 'Scheduling Focus', value: 'Holiday Shutdown PPM' },
      { label: 'Statutory Care', value: 'DfE & HSE Compliant' },
    ],
    operationalStatement: "Campus estates must balance safeguarding with intense term-time demands.",
    operationalLead: 'Educational buildings require heightened safeguarding governance, term-time quiet periods, and rapid summer holiday overhaul execution.',
    realityImage: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    realityImageAlt: 'EntireFM engineer conducting campus distribution board testing during school holiday',
    realityImageCaption: 'Comprehensive electrical testing completed during scheduled half-term break',
    operationalRealities: [
      {
        number: '01',
        title: 'Enhanced DBS & Strict Safeguarding Governance',
        description: 'Every engineer and contractor working on educational premises must be fully DBS vetted, ID-badged, and trained on visitor control procedures.',
        detail: 'Mandatory background verification and signed safeguarding protocols.',
      },
      {
        number: '02',
        title: 'Holiday Shutdown Heavy Engineering Overhauls',
        description: 'Major heating boiler servicing, fixed-wire testing, floor resurfacing, and deep kitchen degreasing must be packed into school holiday windows.',
        detail: 'Structured 6-week summer maintenance sprints ensuring term-start readiness.',
      },
      {
        number: '03',
        title: 'Heating System Reliability in Winter Months',
        description: 'Classrooms and lecture halls must meet minimum statutory temperature thresholds. Reliable boiler plant and prompt heating repair prevent forced school closures.',
        detail: 'Pre-winter boiler overhauls and automated frost protection testing.',
      },
      {
        number: '04',
        title: 'Multi-Building Campus Compliance Management',
        description: 'Sprawling multi-academy trust estates feature buildings of varying ages. Centralising compliance records prevents statutory certification gaps.',
        detail: 'Single digital dashboard across all campus properties in EntireCAFM.',
      },
    ],
    anatomy: {
      headline: 'The Campus Anatomy of an Educational Estate',
      subline: 'Critical building systems supporting teaching, research, and campus life:',
      imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
      imageAlt: 'University campus boiler plant and central circulation pumps',
      callouts: [
        { area: 'Central Plant', title: 'Boiler Plantrooms & Heating', description: 'Commercial gas boilers, pressurisation units, and automated BMS climate scheduling.' },
        { area: 'Learning Spaces', title: 'Classroom Ventilation & Lighting', description: 'CO2-monitored fresh air dampers, acoustic baffles, and LED lighting controls.' },
        { area: 'Life Safety', title: 'Campus Fire & Emergency Systems', description: 'Integrated fire alarm networks, emergency lighting, and automated access gates.' },
        { area: 'Catering & Sports', title: 'Kitchen Extraction & Sports Halls', description: 'TR19 canopy degreasing, gas safety interlocks, and sports floor maintenance.' },
      ],
    },
    snapshotLead: 'Hard and Soft facilities management engineered for universities, multi-academy trusts (MATs), independent colleges, and school campuses.',
    snapshotPriorities: [
      { title: 'Enhanced DBS Vetting', subtitle: 'All mobile engineers security-vetted for educational environments', iconName: 'complianceAudit' },
      { title: 'Holiday Maintenance Sprints', subtitle: 'Heavy boiler servicing and fixed-wire tests scheduled during breaks', iconName: 'twentyFourSevenOps' },
      { title: 'Heating & Water Hygiene', subtitle: 'DfE temperature compliance, Legionella monitoring & boiler care', iconName: 'commercialBuildings' },
      { title: 'Multi-Site MAT Reporting', subtitle: 'Consolidated compliance oversight across all schools in the trust', iconName: 'dataInsights' },
    ],
    challengesHeadline: 'Where educational estate maintenance usually fails.',
    challengesSubline: 'School and university estates face intense regulatory scrutiny and strict term dates. Here is how EntireFM delivers education facilities care:',
    challenges: [
      {
        title: 'Winter Boiler Breakdowns Triggering School Closures',
        problem: 'A failed heating circulation pump on a sub-zero morning forces class cancellations and statutory notification to parents.',
        solution: 'Pre-winter commercial boiler servicing, pump changeover tests, remote BMS temperature telemetry, and 24/7 priority emergency cover.',
        statutoryStandard: 'DfE School Premises Regulations & Workplace Regs 1992',
      },
      {
        title: 'Safeguarding Breaches from Unvetted Subcontractors',
        problem: 'Unchecked trade contractors roaming school grounds create serious child protection and regulatory safeguarding breaches.',
        solution: 'EntireFM deploys only directly vetted, Enhanced DBS-checked mobile staff with strict electronic badge check-in protocols.',
        statutoryStandard: 'Keeping Children Safe in Education (KCSIE) Statutory Guidance',
      },
      {
        title: 'Legionella Risks Following Extended Summer Breaks',
        problem: 'Stagnant water sitting in school pipes over the 6-week summer holiday fosters dangerous Legionella bacteria growth.',
        solution: 'Comprehensive pre-term chemical disinfection, thermal pasteurisation, outlet flushing, and UKAS-accredited water sampling.',
        statutoryStandard: 'HSE ACoP L8 & HSG274 Water Hygiene in Educational Estates',
      },
      {
        title: 'Fragmented Asset Registers Across Multi-Academy Trusts',
        problem: 'Different schools maintain separate paper logbooks, leaving trust directors exposed to statutory non-compliance.',
        solution: 'EntireCAFM unifies asset registers, EICR certificates, fire alarm logs, and gas safety CP12s into one centralized online portal.',
        statutoryStandard: 'Good Estate Management for Schools (GEMS) Guidance',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Educational Estates',
    systemsSubline: 'Complete campus facilities management, mechanical engineering, and compliance services:',
    systemGroups: [
      {
        category: 'Campus Heating, Boilers & Ventilation',
        headline: 'Central heating plant, classroom air quality and energy',
        items: [
          'Commercial gas boiler servicing & burner efficiency tests',
          'Classroom fresh air ventilation & CO2 monitoring systems',
          'Circulation pumps, expansion vessels & pressurisation units',
          'Gas safety CP12 certification & emergency gas shut-off valves',
          'BMS term-time scheduling & holiday frost protection controls',
        ],
      },
      {
        category: 'Electrical, Lighting & Power Safety',
        headline: 'Campus electrical infrastructure, lighting and safety',
        items: [
          'Periodic 5-year EICR fixed-wire inspection & testing',
          'Classroom LED relamping & automatic presence detection',
          'Emergency lighting 3-hour battery discharge testing',
          'Annual PAT testing across school IT and science equipment',
          'Main switchboard thermal imaging & surge protection checks',
        ],
      },
      {
        category: 'Fire Safety, Security & Access Control',
        headline: 'Campus security, safeguarding barriers and fire alarm systems',
        items: [
          'Addressable fire alarm testing, call points & sounder audits',
          'Automated security gates, perimeter barriers & intercoms',
          'Fire door inspection, intumescent seals & closer checks',
          'Campus CCTV surveillance & intruder alarm maintenance',
          'Disabled refuge communication systems & panic button testing',
        ],
      },
      {
        category: 'Water Hygiene, Catering & Fabric Care',
        headline: 'Safe drinking water, school kitchens and grounds',
        items: [
          'Legionella water temperature monitoring & pre-term flushing',
          'Commercial kitchen canopy extraction cleaning to TR19',
          'Holiday deep cleaning, gym floor sealing & window cleaning',
          'Roof gutter clearing, drainage jetting & minor fabric repairs',
          'Playground inspection, boundary fencing & grounds care',
        ],
      },
    ],
    operatingModelHeadline: 'Education Operating Model',
    operatingModelSubline: 'How EntireFM delivers structured facilities care aligned with academic terms:',
    operatingSteps: [
      { step: '01', title: 'Estate Asset Condition Survey', desc: 'Barcoding every boiler, distribution board, and fire panel across your school buildings into EntireCAFM.' },
      { step: '02', title: 'Academic Term Harmonisation', desc: 'Structuring heavy maintenance, fixed-wire tests, and deep cleans into half-terms and summer breaks.' },
      { step: '03', title: 'DBS-Vetted Engineering', desc: 'Deploying dedicated, safeguarding-trained mobile engineers with assigned security badges.' },
      { step: '04', title: 'Trust-Wide Compliance Vault', desc: 'Live digital transparency allowing school business managers and MAT executives to audit safety records.' },
      { step: '05', title: 'Annual Capital Renewal Plan', desc: 'Detailed condition surveys supporting Condition Improvement Fund (CIF) and SCA capital funding bids.' },
    ],
    technologyFocus: {
      badge: 'CAFM & EDUCATION ESTATE MANAGEMENT',
      title: 'Trust-Wide Estate Governance & Statutory Transparency',
      description: 'Our CAFM system provides multi-academy trust executives and school business managers with live insight across every school in the portfolio.',
      features: [
        { title: 'Multi-School Overview', desc: 'Consolidated dashboard tracking statutory compliance across all campus sites.' },
        { title: 'Holiday Task Dispatch', desc: 'Pre-scheduled work order queues ready for immediate execution during breaks.' },
        { title: 'Digital Certificate Archive', desc: 'Instant retrieval of EICRs, CP12s, asbestos surveys, and fire logs for DfE audits.' },
        { title: 'Budget & Asset Condition', desc: 'Forward maintenance tracking supporting CIF grant applications.' },
      ],
    },
    metrics: [
      { figure: 'Enhanced DBS', label: 'Security-Vetted Staff', detail: 'All engineers cleared for school and college environments' },
      { figure: 'Holiday PPM', label: 'Term-Aligned Delivery', detail: 'Major engineering executed during scheduled breaks' },
      { figure: 'DfE / GEMS', label: 'Best Practice Aligned', detail: 'Compliance management supporting good estate governance' },
    ],
    conversionCta: {
      headline: 'Looking to Elevate Facilities Management Across Your School or Trust?',
      subheadline: 'Speak with EntireFM education specialists. We provide tailored Hard and Soft FM with Enhanced DBS-vetted engineers and term-aligned maintenance scheduling.',
      badgeText: 'EDUCATION ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Holiday Regimes' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Campus Power' },
      { name: 'Commercial HVAC & Boiler Care', href: '/hvac-contractor', tag: 'Winter Heating' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Water Hygiene' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Holiday Cleans' },
    ],
  },

  // ── 7. HOTELS & HOSPITALITY ────────────────────────────────────────────────
  hospitality: {
    id: 'hospitality',
    name: 'Hotels & Hospitality',
    heroBadge: 'HOTELS & HOSPITALITY FM',
    heroHeadline: '24/7 guest comfort and invisible engineering.',
    heroSubline: 'Facilities management engineered for luxury hotels, boutique hospitality destinations, commercial kitchens, and resort estates.',
    heroImage: '/images/editorial/entirefm-reception-2000w.webp',
    heroImageAlt: 'EntireFM commercial reception and hotel front-of-house facilities management',
    heroHighlightedTitle: 'Guest Experience & 24/7 Plant Uptime',
    heroFacts: [
      { label: 'Guest Comfort', value: 'Instant Hot Water & Quiet AC' },
      { label: 'Kitchen Compliance', value: 'TR19 Canopy Extraction' },
      { label: 'Emergency Attendance', value: '24/7 Hospitality SLAs' },
    ],
    operationalStatement: 'In hospitality, maintenance must be completely invisible to guests.',
    operationalLead: 'Hotels operate 24 hours a day, 365 days a year. Unplanned boiler failures, air conditioning noise, or kitchen extraction issues immediately trigger guest complaints and lost revenue.',
    realityImage: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    realityImageAlt: 'Commercial hotel domestic hot water booster set and pump maintenance',
    realityImageCaption: 'Commercial domestic hot water booster pumps serviced during low-occupancy midday window',
    operationalRealities: [
      {
        number: '01',
        title: 'Continuous Domestic Hot Water & Water Pressure',
        description: 'Morning shower peaks across 200+ guest bedrooms demand rock-solid calorifiers, booster sets, and circulation pumps. Temperature drops are intolerable.',
        detail: 'Redundant pump changeover testing and calorifier descaling PPM.',
      },
      {
        number: '02',
        title: 'Quiet Guest Bedroom HVAC & Fan Coil Units',
        description: 'Noisy fan bearings, vibrating dampers, or whistling ducts ruin guest sleep. Air conditioning must deliver silent, draft-free climate control.',
        detail: 'Low-noise motor servicing, acoustic damping, and filter sanitation.',
      },
      {
        number: '03',
        title: 'Commercial Kitchen Extraction & Fire Safety',
        description: 'Hotel restaurants generate continuous grease in extraction ducts. Certified TR19 degreasing and gas interlock safety testing prevent catastrophic kitchen fire risks.',
        detail: 'Semi-annual TR19 canopy cleaning and Gas Safe CP42 certification.',
      },
      {
        number: '04',
        title: 'Midday Quiet-Window Maintenance Execution',
        description: 'All in-room and corridor engineering must be restricted to checkout windows (11:00–15:00) with strictly unobtrusive engineer presentation.',
        detail: 'White-glove technician etiquette and rapid room turnaround.',
      },
    ],
    anatomy: {
      headline: 'The 24/7 Anatomy of a Luxury Hotel Estate',
      subline: 'The hidden mechanical, thermal, and electrical systems supporting five-star guest hospitality:',
      imageSrc: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
      imageAlt: 'Hotel guest suite air conditioning cassette maintenance',
      callouts: [
        { area: 'Guest Rooms', title: 'Silent VRV/VRF Fan Coil Units', description: 'Acoustically isolated fans, digital thermostats, and condensate drain lines.' },
        { area: 'Central Plant', title: 'Domestic Hot Water Calorifiers', description: 'Commercial water heaters, expansion vessels, and Legionella pasteurisation circuits.' },
        { area: 'Kitchens', title: 'Commercial Kitchen Canopies', description: 'TR19 ductwork degreasing, grease filters, and gas solenoid safety interlocks.' },
        { area: 'Spa & Leisure', title: 'Pool Plant & Sauna Systems', description: 'Circulation pumps, dosing controllers, and heat exchanger servicing.' },
      ],
    },
    snapshotLead: 'Hard FM and engineering support engineered for luxury hotels, boutique hospitality, and resort estates requiring 24/7 guest comfort.',
    snapshotPriorities: [
      { title: 'Continuous Hot Water & HVAC', subtitle: 'Boiler redundancy, booster sets & silent bedroom climate control', iconName: 'commercialBuildings' },
      { title: 'Commercial Kitchen Safety', subtitle: 'TR19 canopy degreasing, gas interlocks & commercial kitchen FM', iconName: 'riskCompliance' },
      { title: 'Discreet Midday Servicing', subtitle: 'Engineering scheduled strictly during checkout windows (11am-3pm)', iconName: 'twentyFourSevenOps' },
      { title: '24/7 Rapid Emergency Response', subtitle: 'Priority callout SLAs for guest room leaks, power trips & lift faults', iconName: 'operationalExcellence' },
    ],
    challengesHeadline: 'Where hospitality facilities maintenance usually fails.',
    challengesSubline: 'Hotels cannot afford guest disruptions or negative reviews. Here is how EntireFM engineers protect hotel operations:',
    challenges: [
      {
        title: 'Morning Domestic Hot Water Pressure Drops',
        problem: 'Simultaneous shower demand at 08:00 overwhelms tired booster pumps, leaving top-floor guests with cold showers.',
        solution: 'Dual-pump redundancy calibration, quarterly calorifier descaling, and expansion vessel pressure recharging.',
        statutoryStandard: 'Water Supply (Water Fittings) Regulations 1999 & CIBSE Guide G',
      },
      {
        title: 'Guest Bedroom Fan Coil Unit (FCU) Noise & Leaks',
        problem: 'Rattling fan bearings or blocked condensate drip trays ruin guest sleep and damage bedroom ceilings.',
        solution: 'Midday preventive fan balancing, acoustic damping replacement, and enzymatic condensate drain clearing.',
        statutoryStandard: 'CIBSE Acoustic Criteria for Hotel Accommodations',
      },
      {
        title: 'Commercial Kitchen Grease Buildup & Fire Risks',
        problem: 'Heavy cooking grease accumulating in extraction ducts poses severe fire hazards and invalidates building insurance.',
        solution: 'Certified out-of-hours TR19 ductwork degreasing, access panel installation, and photographic certificate filing.',
        statutoryStandard: 'BESA TR19 Specification for Internal Cleanliness of Ventilation Systems',
      },
      {
        title: 'Emergency Lighting & Fire Alarm Testing Disrupting Guests',
        problem: 'Sounding fire alarm tests during breakfast or late checkouts causes guest alarm and negative online reviews.',
        solution: 'Meticulously scheduled, pre-announced test windows conducted with silent flash modes and pre-recorded guest announcements.',
        statutoryStandard: 'BS 5839-1 Fire Detection & BS 5266 Emergency Lighting',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Hospitality Estates',
    systemsSubline: 'Full-service Hard FM, plantroom care, and compliance management for hospitality venues:',
    systemGroups: [
      {
        category: 'Domestic Hot Water & Heating Plant',
        headline: 'Continuous hot water generation and boiler resilience',
        items: [
          'Commercial gas/oil boiler servicing & burner tuning',
          'Domestic hot water (DHW) calorifiers & plate heat exchangers',
          'Water booster pump sets, variable speed drives & expansion tanks',
          'Gas safety CP12 certification & emergency gas valve tests',
          'BMS central temperature scheduling & night setback controls',
        ],
      },
      {
        category: 'Guest Room & Public Space HVAC',
        headline: 'Silent comfort cooling, fresh air and ventilation',
        items: [
          'VRV/VRF multi-split systems & 4-pipe fan coil units (FCUs)',
          'Guest room condensate pump servicing & drainage clearing',
          'Lobby & restaurant air handling units (AHUs) & filter changes',
          'F-Gas refrigerant leak inspections and digital log archiving',
          'Wine cellar & cold room refrigeration maintenance',
        ],
      },
      {
        category: 'Commercial Kitchen & Catering Services',
        headline: 'Kitchen extraction hygiene, gas safety and equipment',
        items: [
          'TR19 certified canopy extraction degreasing & grease filters',
          'Commercial kitchen gas interlock & proving system tests',
          'Fat, oil, and grease (FOG) grease trap servicing & dosing',
          'Commercial dishwasher plumbing, water softeners & booster sets',
          'Refrigerated prep counters, walk-in chillers & freezers',
        ],
      },
      {
        category: 'Life Safety, Spa & Electrical Care',
        headline: 'Guest safety, spa facilities and electrical distribution',
        items: [
          'Periodic EICR fixed-wire testing & thermal imaging',
          'Fire alarm system testing, smoke dampers & door holders',
          'Emergency lighting 3-hour battery discharge testing',
          'Swimming pool circulation pumps, heat exchangers & filtration',
          'Exterior architectural facade lighting & car park illumination',
        ],
      },
    ],
    operatingModelHeadline: 'Hospitality Operating Model',
    operatingModelSubline: 'How EntireFM delivers five-star facilities care without disrupting the guest journey:',
    operatingSteps: [
      { step: '01', title: 'Estate Asset Baseline Survey', desc: 'Tagging every boiler, FCU, booster pump, and kitchen canopy into EntireCAFM.' },
      { step: '02', title: 'Midday Window Scheduling', desc: 'Executing all in-room and corridor engineering strictly between checkout and check-in (11am-3pm).' },
      { step: '03', title: 'White-Glove Engineer Protocols', desc: 'Deploying smartly presented, customer-trained technicians who maintain total discretion.' },
      { step: '04', title: '24/7 Priority Emergency Attendance', desc: 'Rapid mobile engineer callout for urgent guest room water leaks, electrical faults, or lift stoppages.' },
      { step: '05', title: 'Comprehensive Compliance Vault', desc: 'Archiving TR19 kitchen certs, CP12s, and water hygiene records in an audit-ready digital portal.' },
    ],
    technologyFocus: {
      badge: 'CAFM & HOSPITALITY TELEMETRY',
      title: 'Digital Hotel Asset Management & Instant Compliance Evidence',
      description: 'Our CAFM system provides hotel general managers with live visibility over asset health, reactive maintenance speed, and statutory certificates.',
      features: [
        { title: 'Rapid Reactive Dispatch', desc: 'Priority routing for urgent bedroom heating or plumbing calls.' },
        { title: 'TR19 Kitchen Compliance', desc: 'Instant access to kitchen extraction degreasing certificates for insurer audits.' },
        { title: 'Legionella Water Logging', desc: 'Digital recording of sentinel water temperatures across all guest floors.' },
        { title: 'Multi-Site Portfolio View', desc: 'Centralised performance reporting across hotel chains and regional properties.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Care', detail: 'Maintenance routines structured around guest occupancy windows' },
      { figure: '24/7', label: 'Emergency Priority Desk', detail: 'Round-the-clock technical dispatch for critical hotel plant faults' },
      { figure: 'TR19', label: 'Certified Kitchen Care', detail: 'Audited extraction degreasing protecting commercial insurance' },
    ],
    conversionCta: {
      headline: 'Looking to Upgrade Facilities Management Across Your Hotel Estate?',
      subheadline: 'Speak directly with EntireFM hospitality engineering directors. We self-deliver comprehensive Hard FM, boiler plant care, HVAC, and kitchen compliance built around your guest operations.',
      badgeText: 'HOTEL ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial HVAC & Air Quality', href: '/hvac-contractor', tag: 'Silent Guest AC' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Boilers & Boosters' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power Continuity' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Midday PPM' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'TR19 Kitchens' },
    ],
  },

  // ── 8. STADIUMS, ARENAS & LEISURE VENUES ───────────────────────────────────
  'venues-leisure': {
    id: 'venues-leisure',
    name: 'Stadiums, Arenas & Leisure Venues',
    heroBadge: 'STADIUMS, ARENAS & VENUES FM',
    heroHeadline: 'Event readiness and crowd safety on a national scale.',
    heroSubline: 'High-capacity facilities management engineered for major entertainment arenas, sports stadiums, convention centres, and public leisure complexes.',
    heroImage: '/images/editorial/entirefm-manchester-castlefield-night-1920w.webp',
    heroImageAlt: 'Major entertainment arena and venue district illuminated at dusk',
    heroHighlightedTitle: 'Event Readiness & Crowd Safety',
    heroFacts: [
      { label: 'Event Protocol', value: 'Pre-Event Handover Audits' },
      { label: 'Crowd Safety', value: 'Green Guide Compliant' },
      { label: 'Capacity Model', value: 'Dark-Day PPM Sprints' },
    ],
    operationalStatement: 'A venue must operate at 100% capacity the moment doors open.',
    operationalLead: 'Stadiums and arenas host tens of thousands of visitors at once. Life safety systems, high-volume washrooms, pitch floodlighting, and turnstiles must be verified before every single event.',
    realityImage: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    realityImageAlt: 'EntireFM engineer conducting switchgear and emergency power testing in stadium plantroom',
    realityImageCaption: 'High-voltage event power testing executed during scheduled non-event dark days',
    operationalRealities: [
      {
        number: '01',
        title: 'Dark-Day Maintenance Sprints',
        description: 'Major mechanical plant overhauls, high-level rigging access, and distribution board tests must take place during non-event "dark days" between fixtures.',
        detail: 'Rigorous 48-hour turnarounds before major event load-ins.',
      },
      {
        number: '02',
        title: 'Pre-Event Life Safety Handover Audits',
        description: 'Public address / voice alarm (PA/VA), emergency lighting, turnstile access control, and fire damper integrations must be functionally tested before doors open.',
        detail: 'Formal sign-off certificate issued to the Safety Advisory Group (SAG).',
      },
      {
        number: '03',
        title: 'High-Volume Turnstiles & Ingress Management',
        description: 'Tens of thousands of attendees pass through turnstiles within 60 minutes. Optical sensors, motor drives, and ticket readers require preventive servicing.',
        detail: 'Pre-match turnstile calibration and on-site standby engineers.',
      },
      {
        number: '04',
        title: 'High-Volume Washrooms & Mass Water Demand',
        description: 'Half-time and interval flushes create sudden, massive water demand. Heavy-duty booster pump sets, surge arrestors, and vacuum drainage must respond instantly.',
        detail: 'High-capacity booster pump testing and pipework pressure maintenance.',
      },
    ],
    anatomy: {
      headline: 'The Infrastructure Anatomy of a Major Venue',
      subline: 'The large-scale building services engineered to support mass crowds and live events:',
      imageSrc: '/images/editorial/entirefm-manchester-castlefield-night-1920w.webp',
      imageAlt: 'Major entertainment arena and venue district',
      callouts: [
        { area: 'Life Safety', title: 'PA/VA & Crowd Evacuation', description: 'Voice alarm intelligibility, emergency lighting battery banks, and smoke control louvres.' },
        { area: 'High-Level Access', title: 'Rooftop Rigging & Floodlights', description: 'IRATA rope access, stadium roof gantry inspections, and sports floodlight arrays.' },
        { area: 'Mass Amenities', title: 'High-Volume Public Washrooms', description: 'High-flow booster sets, anti-vandal sanitaryware, and rapid drainage interceptors.' },
        { area: 'Event Power', title: 'Dual-Fed Substations & Generators', description: 'Broadcaster power tie-ins, UPS resilience, and emergency generator synchronisation.' },
      ],
    },
    snapshotLead: 'Hard and Soft facilities management engineered for entertainment arenas, sports stadiums, exhibition centres, and major leisure facilities.',
    snapshotPriorities: [
      { title: 'Pre-Event Sign-Off Audits', subtitle: 'Rigorous life safety, fire, and PA/VA testing before doors open', iconName: 'riskCompliance' },
      { title: 'Dark-Day Maintenance Sprints', subtitle: 'Disruptive plant overhauls executed between event fixtures', iconName: 'twentyFourSevenOps' },
      { title: 'High-Capacity Amenities', subtitle: 'Heavy-duty water booster pumps and high-traffic washroom care', iconName: 'commercialBuildings' },
      { title: 'On-Site Event Standby Care', subtitle: 'Assigned M&E engineers on-site during live fixtures for immediate fix', iconName: 'operationalExcellence' },
    ],
    challengesHeadline: 'Where venue facilities maintenance usually fails.',
    challengesSubline: 'Arenas and stadiums face extreme event pressure. Here is how EntireFM engineers protect venue operations:',
    challenges: [
      {
        title: 'Turnstile & Egress Gate Failures at Peak Ingress',
        problem: 'A jammed electronic turnstile bank creates dangerous bottlenecking at the stadium gates and delays kick-off.',
        solution: 'Pre-event turnstile motor checks, optical sensor cleaning, backup power verification, and dedicated on-site standby technicians.',
        statutoryStandard: 'Guide to Safety at Sports Grounds (Green Guide) & BS EN 13200',
      },
      {
        title: 'Half-Time Washroom Pressure Drops & Blockages',
        problem: 'Sudden interval flushing by thousands of spectators drops water pressure, causing toilet blockages and public complaints.',
        solution: 'Pre-event booster set load testing, expansion vessel recharging, and high-frequency interval plumbing triage.',
        statutoryStandard: 'Water Supply Regulations 1999 & CIBSE Guide G Public Health',
      },
      {
        title: 'PA/VA Voice Alarm Failures During Licensing Inspections',
        problem: 'Poor acoustic intelligibility (STI) or battery failures during Safety Advisory Group (SAG) inspections threaten the event license.',
        solution: 'Quarterly sound pressure level testing, speech transmission index audits, and 3-hour emergency lighting battery discharge runs.',
        statutoryStandard: 'BS 5839-8 Voice Alarm Systems & BS 5266 Emergency Lighting',
      },
      {
        title: 'High-Level Roof Gantry & Rigging Access Constraints',
        problem: 'Inspecting floodlights, acoustic banners, and structural steel above the arena bowl requires specialized height access.',
        solution: 'IRATA-certified rope access teams and powered access specialists conducting dark-day structural and luminaire maintenance.',
        statutoryStandard: 'Work at Height Regulations 2005 & LOLER 1998 Lifting Equipment',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Stadiums & Venues',
    systemsSubline: 'Full-scope Hard FM, event engineering, and compliance management for high-capacity venues:',
    systemGroups: [
      {
        category: 'Event Power, Floodlights & Electrical',
        headline: 'Heavy event electrical supply, floodlights and distribution',
        items: [
          'High-voltage substation servicing & broadcast power tie-ins',
          'Stadium floodlight arrays, LED controls & gantry access',
          'Standby diesel generators & automated changeover switchgear',
          'Periodic EICR fixed-wire testing & thermal imaging surveys',
          'UPS battery banks & uninterrupted event power distribution',
        ],
      },
      {
        category: 'Life Safety, PA/VA & Smoke Management',
        headline: 'Crowd safety, voice alarm systems and smoke extract',
        items: [
          'Public Address / Voice Alarm (PA/VA) speech intelligibility tests',
          'Addressable fire alarm testing, beam detectors & call points',
          'Emergency lighting 3-hour battery discharge testing',
          'Automatic smoke extract louvres & fire damper drop testing',
          'Disabled refuge communication & steward intercom systems',
        ],
      },
      {
        category: 'Ingress, Turnstiles & Access Control',
        headline: 'Perimeter security, electronic turnstiles and gates',
        items: [
          'Electronic turnstile mechanism servicing & optical sensors',
          'Automated vehicle security barriers, bollards & sliding gates',
          'CCTV perimeter surveillance & control room monitor walls',
          'Emergency exit panic hardware & magnetic lock release tests',
          'Hostile Vehicle Mitigation (HVM) barrier maintenance',
        ],
      },
      {
        category: 'Mass Water Systems & Venue Fabric',
        headline: 'High-capacity water boosters, washrooms and bowl fabric',
        items: [
          'High-capacity domestic water booster pump set servicing',
          'Anti-vandal public washroom plumbing & sensor flushing',
          'Legionella water temperature monitoring & tank pasteurisation',
          'Bowl seating repairs, concrete joint sealing & balustrades',
          'Post-event waste management & deep seating bowl cleaning',
        ],
      },
    ],
    operatingModelHeadline: 'Venue Operating Model',
    operatingModelSubline: 'How EntireFM delivers flawless event engineering across national venues:',
    operatingSteps: [
      { step: '01', title: 'Estate Asset Baseline Survey', desc: 'Cataloguing every turnstile, floodlight, generator, and water booster into EntireCAFM.' },
      { step: '02', title: 'Dark-Day Sprint Scheduling', desc: 'Executing all heavy engineering and statutory tests during non-event windows.' },
      { step: '03', title: 'Pre-Event Sign-Off Handover', desc: 'Conducting formal life safety, PA/VA, and turnstile functional checks before doors open.' },
      { step: '04', title: 'Live Event Standby Engineering', desc: 'Stationing qualified M&E engineers on-site during live fixtures for immediate fault triage.' },
      { step: '05', title: 'Digital SAG Compliance Vault', desc: 'Providing instant digital certification for local authority Safety Advisory Group audits.' },
    ],
    technologyFocus: {
      badge: 'CAFM & VENUE EVENT TELEMETRY',
      title: 'Digital Event Safety Handover & Compliance Platform',
      description: 'Our CAFM platform provides venue directors with live visibility over pre-event safety sign-offs, reactive incident tracking, and statutory certificates.',
      features: [
        { title: 'Pre-Event Safety Checklists', desc: 'Digital sign-off for turnstiles, emergency lighting, and fire alarms before doors open.' },
        { title: 'Live Event Incident Triage', desc: 'Instant mobile dispatch for urgent power, plumbing, or door faults during fixtures.' },
        { title: 'SAG Audit Compliance Vault', desc: 'Instant access to Green Guide, EICR, and gas certificates for local authorities.' },
        { title: 'Multi-Venue Overview', desc: 'Centralised reporting across multi-arena portfolios and event campuses.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Routines', detail: 'Maintenance executed during scheduled non-event dark days' },
      { figure: 'Green Guide', label: 'Crowd Safety Aligned', detail: 'Pre-event functional checks supporting safety certificates' },
      { figure: 'On-Site', label: 'Live Event Standby Care', detail: 'Technical engineering presence during major public fixtures' },
    ],
    conversionCta: {
      headline: 'Require Higher-Calibre Facilities Management for Your Stadium or Venue?',
      subheadline: 'Speak directly with EntireFM venue operations leaders. We provide comprehensive Hard FM, dark-day engineering sprints, and pre-event safety handover governance.',
      badgeText: 'VENUE ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Event Power' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Dark-Day PPM' },
      { name: 'Commercial HVAC & Air Systems', href: '/hvac-contractor', tag: 'Smoke Extract' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Mass Boosters' },
      { name: 'Specialist Commercial Cleaning', href: '/commercial-cleaning', tag: 'Bowl Cleans' },
    ],
  },

  // ── 9. RESIDENTIAL ESTATES & PRS ───────────────────────────────────────────
  'residential-prs': {
    id: 'residential-prs',
    name: 'Residential Estates & Build to Rent (PRS)',
    heroBadge: 'RESIDENTIAL & BUILD TO RENT (PRS) FM',
    heroHeadline: 'Resident comfort and statutory building safety.',
    heroSubline: 'Comprehensive facilities management engineered for Build to Rent (BTR/PRS) developments, residential block portfolios, and mixed-use luxury estates.',
    heroImage: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    heroImageAlt: 'EntireFM commercial plumbing and communal heating plant in modern residential development',
    heroHighlightedTitle: 'Building Safety Act & Resident Care',
    heroFacts: [
      { label: 'Safety Governance', value: 'Building Safety Act 2022' },
      { label: 'Plant Scope', value: 'Energy Centres & HIUs' },
      { label: 'Resident Support', value: '24/7 Rapid Helpdesk' },
    ],
    operationalStatement: 'Residential block FM must balance building safety with resident retention.',
    operationalLead: 'Modern Build-to-Rent and residential block management demands flawless communal heating, strict fire safety compliance, and spotless common areas to protect asset value and lease renewals.',
    realityImage: '/images/editorial/entirefm-plumbing-callout-arrival-2000w.webp',
    realityImageAlt: 'EntireFM engineer arriving at prime residential block development',
    realityImageCaption: 'Rapid engineer callout attending residential communal energy centre',
    operationalRealities: [
      {
        number: '01',
        title: 'Building Safety Act 2022 & Golden Thread Records',
        description: 'Higher-Risk Buildings (HRBs) require an indisputable digital Golden Thread of building information, fire safety audits, and mandatory occurrence reporting.',
        detail: 'Digital compliance archiving and compartmentation inspection in EntireCAFM.',
      },
      {
        number: '02',
        title: 'Communal Energy Centres & Heat Interface Units (HIUs)',
        description: 'District heating networks and central boiler plantrooms power heating and hot water across hundreds of apartments. Plant trips cause immediate mass tenant dissatisfaction.',
        detail: 'Scheduled HIU strainer cleaning, pump balancing, and water quality dosing.',
      },
      {
        number: '03',
        title: 'Passenger Lift Continuity & Egress Reliability',
        description: 'A broken lift in a 20-storey tower isolates residents and triggers urgent accessibility crises. Preventive motor care and rapid entrapment response are critical.',
        detail: 'LOLER 6-month thorough examinations and 24/7 release protocols.',
      },
      {
        number: '04',
        title: 'Spotless Communal Fabric & Concierge Presentation',
        description: 'High resident turnover and daily deliveries create constant wear across lobbies, corridors, and refuse stores. Continuous janitorial attendance keeps presentation premium.',
        detail: 'Daily common-part cleaning, carpet care, and odour-controlled bin stores.',
      },
    ],
    anatomy: {
      headline: 'The Infrastructure Anatomy of a Modern Residential Block',
      subline: 'The core building services powering communal heating, life safety, and resident comfort:',
      imageSrc: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
      imageAlt: 'Residential building central plant and booster pumps',
      callouts: [
        { area: 'Central Energy', title: 'Energy Centre & District Heating', description: 'Commercial gas boilers, CHP units, buffer vessels, and secondary distribution pumps.' },
        { area: 'Apartment Feeds', title: 'Heat Interface Units (HIUs)', description: 'Plate heat exchangers, motorized control valves, and heat metering telemetry.' },
        { area: 'Building Life Safety', title: 'AOV Smoke Vents & Dry Risers', description: 'Automatic opening vents (AOVs), dry riser pressure tests, and fire doors.' },
        { area: 'Communal Realm', title: 'Lobbies, Lifts & Amenity Spaces', description: 'Passenger lifts, access control fobs, parcel lockers, and concierge presentation.' },
      ],
    },
    snapshotLead: 'Integrated Hard and Soft facilities management for Build-to-Rent developments, private residential blocks, and PRS property portfolios.',
    snapshotPriorities: [
      { title: 'Building Safety Act Compliance', subtitle: 'Digital Golden Thread record-keeping for higher-risk buildings', iconName: 'complianceAudit' },
      { title: 'Energy Centre & HIU Servicing', subtitle: 'Commercial boiler plant, district heating & Heat Interface Units', iconName: 'commercialBuildings' },
      { title: 'Fire Safety & AOV Testing', subtitle: 'Smoke ventilation, fire door inspections & dry riser maintenance', iconName: 'riskCompliance' },
      { title: '24/7 Resident Emergency Helpdesk', subtitle: 'Rapid response for communal leaks, lift faults & gate failures', iconName: 'twentyFourSevenOps' },
    ],
    challengesHeadline: 'Where residential block maintenance usually fails.',
    challengesSubline: 'Residential properties operate under intense resident scrutiny and strict statutory legislation. Here is how EntireFM manages residential real estate:',
    challenges: [
      {
        title: 'Communal Heating Stoppages in District Energy Centres',
        problem: 'A tripped central boiler or failed circulation pump leaves hundreds of residents without heating or hot water.',
        solution: '24/7 telemetry monitoring on central plant, scheduled pump changeover tests, inhibitor water dosing, and priority emergency engineer cover.',
        statutoryStandard: 'Heat Network (Metering and Billing) Regulations & CIBSE CP1',
      },
      {
        title: 'Fire Door Non-Compliance & Missing Golden Thread Records',
        problem: 'Damaged self-closers or missing smoke seals in communal corridors trigger severe Building Safety Regulator enforcement.',
        solution: 'Bi-annual certified fire door inspections, digital photographic tagging, and instant upload to your building’s compliance portal.',
        statutoryStandard: 'Fire Safety (England) Regulations 2022 & Building Safety Act 2022',
      },
      {
        title: 'Communal Water Booster Pump Failures',
        problem: 'Pump failure cuts water supply to upper apartment floors, creating an immediate environmental health emergency.',
        solution: 'Tri-pump variable speed booster servicing, pressure vessel bladder inspections, and 24/7 standby response.',
        statutoryStandard: 'Water Supply Regulations 1999 & BS EN 806',
      },
      {
        title: 'Refuse Store Contamination & Bin Room Odours',
        problem: 'High-density waste disposal leads to overflowing chutes, foul odours, and pest infestations in residential basements.',
        solution: 'Scheduled bin room pressure washing, biocidal sanitisation, waste chute maintenance, and proactive pest control inspections.',
        statutoryStandard: 'Environmental Protection Act 1990 & Public Health Act 1936',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Residential & PRS Estates',
    systemsSubline: 'Comprehensive Hard FM, communal heating, and block management solutions:',
    systemGroups: [
      {
        category: 'Communal Heating & Energy Centres',
        headline: 'District heating networks, central boilers and HIUs',
        items: [
          'Commercial gas/biomass boiler plantroom servicing',
          'Heat Interface Unit (HIU) servicing & strainer cleaning',
          'Primary & secondary heating pump set maintenance',
          'Water treatment dosing, filtration & inhibitor testing',
          'Gas safety CP12 certification & emergency gas shut-off valves',
        ],
      },
      {
        category: 'Fire Safety & Building Safety Act',
        headline: 'Golden Thread compliance, smoke vents and fire systems',
        items: [
          'Automatic Opening Vent (AOV) smoke extract testing',
          'Quarterly communal fire door inspections and seal checks',
          'Dry riser periodic pressure testing & visual inspection',
          'Addressable fire alarm testing & sprinkler system checks',
          'Emergency lighting 3-hour battery discharge testing',
        ],
      },
      {
        category: 'Domestic Water, Pumps & Lifts',
        headline: 'Water booster sets, passenger lifts and drainage',
        items: [
          'Cold water booster pump set servicing & vessel checks',
          'Legionella water temperature monitoring & tank audits (L8)',
          'Passenger lift LOLER compliance coordination & servicing',
          'Communal drainage jetting, sump pumps & foul interceptors',
          'Automatic vehicle gate & pedestrian access fob systems',
        ],
      },
      {
        category: 'Common Area Cleaning & Block Presentation',
        headline: 'Communal area hygiene, waste rooms and fabric',
        items: [
          'Daily/weekly communal staircase and corridor cleaning',
          'Refuse store deep pressure washing & bin sanitisation',
          'Entrance lobby glass cleaning & concierge presentation',
          'Car park sweeping, external lighting & bollard maintenance',
          'Internal painting, plaster repairs & carpet extraction',
        ],
      },
    ],
    operatingModelHeadline: 'Residential Operating Model',
    operatingModelSubline: 'How EntireFM delivers five-star block management and total safety compliance:',
    operatingSteps: [
      { step: '01', title: 'Building Safety Audit & Asset Tagging', desc: 'Cataloguing every communal plant item, fire door, and AOV vent into EntireCAFM to establish the Golden Thread.' },
      { step: '02', title: 'Predictive PPM Scheduling', desc: 'Executing SFG20 maintenance routines on energy centres, booster sets, and life safety systems.' },
      { step: '03', title: 'Resident-Centric Engineering', desc: 'Deploying courteous, uniformed mobile engineers trained in residential communication and quiet working.' },
      { step: '04', title: 'Live Compliance Transparency', desc: 'Providing property managers with an audit-ready compliance dashboard for Building Safety Regulator inspections.' },
      { step: '05', title: 'Service Charge Strategy', desc: 'Detailed monthly reporting supporting accurate service charge budgeting and capital reserve planning.' },
    ],
    technologyFocus: {
      badge: 'CAFM & BUILDING SAFETY PORTAL',
      title: 'Digital Golden Thread & Block Compliance Platform',
      description: 'Our CAFM system provides residential property managers and Build to Rent operators with live transparency over asset health, fire safety checks, and resident tickets.',
      features: [
        { title: 'Golden Thread Compliance Vault', desc: 'Secure digital repository for all Building Safety Act documentation and fire audits.' },
        { title: 'Real-Time Telemetry Alerts', desc: 'Instant automated alerts for energy centre boiler trips or booster pump faults.' },
        { title: 'Fire Door Audit Tracking', desc: 'Barcode-scanned photographic evidence for every communal fire door inspection.' },
        { title: 'Managing Agent Reporting', desc: 'Transparent reporting supporting annual service charge accounts and reserve funds.' },
      ],
    },
    metrics: [
      { figure: 'BSA 2022', label: 'Building Safety Compliant', detail: 'Digital Golden Thread records supporting Higher-Risk Building audits' },
      { figure: 'SFG20', label: 'Standardised PPM Care', detail: 'Energy centres and communal plant maintained to industry standards' },
      { figure: '24/7', label: 'Emergency Resident Desk', detail: 'Round-the-clock response for communal heating, water, and lift faults' },
    ],
    conversionCta: {
      headline: 'Seeking a Higher Standard of FM for Your Residential or BTR Estate?',
      subheadline: 'Speak directly with EntireFM residential operations leaders. We provide comprehensive Hard & Soft FM, energy centre management, and Building Safety Act governance.',
      badgeText: 'RESIDENTIAL ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Block PPM' },
      { name: 'Plumbing & Commercial Water', href: '/plumbing-gas', tag: 'Energy Centres' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Plant Care' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Communal Cleans' },
      { name: 'Building Fabric Maintenance', href: '/building-maintenance', tag: 'Fire Doors' },
    ],
  },

  // ── 10. MANAGING AGENTS & PROPERTY PORTFOLIOS ──────────────────────────────
  'corporate-managing-agents': {
    id: 'corporate-managing-agents',
    name: 'Managing Agents & Property Portfolios',
    heroBadge: 'MANAGING AGENTS & PROPERTY PORTFOLIOS',
    heroHeadline: 'Single-source FM accountability across multi-site portfolios.',
    heroSubline: 'Institutional-grade facilities management engineered for commercial managing agents, property asset managers, and national investment portfolios.',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    heroImageAlt: 'EntireFM commercial directors conducting annual facilities review with corporate managing agent team',
    heroHighlightedTitle: 'Service Charge Transparency & Multi-Site Governance',
    heroFacts: [
      { label: 'Accountability', value: 'Single-Source Delivery' },
      { label: 'Accounting Alignment', value: 'RICS Service Charge Code' },
      { label: 'Portfolio Model', value: 'National Mobile Engineering' },
    ],
    operationalStatement: 'Managing agents need unified governance, not dozens of local contractor headaches.',
    operationalLead: 'Managing commercial property portfolios requires single-point accountability, rigorous statutory compliance, transparent service charge accounting, and fast tenant satisfaction.',
    realityImage: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    realityImageAlt: 'EntireFM national operations centre supporting UK property portfolios',
    realityImageCaption: 'Centralised portfolio coordination across multi-site commercial estates',
    operationalRealities: [
      {
        number: '01',
        title: 'Consolidated Single-Source Contract Structure',
        description: 'Managing separate local contractors for HVAC, electrical, fire, cleaning, and security creates massive administrative drag and fragmented compliance records.',
        detail: 'EntireFM self-delivers Hard and Soft FM under one master agreement and monthly invoice.',
      },
      {
        number: '02',
        title: 'RICS Service Charge Code Financial Transparency',
        description: 'Property managers must defend service charge expenditure to institutional landlords and tenants. Every invoice requires granular breakdown and photographic proof.',
        detail: 'CAFM work order evidence packs linked directly to service charge schedules.',
      },
      {
        number: '03',
        title: 'National Multi-Site SLA Consistency',
        description: 'Portfolio owners expect identical engineering quality and statutory diligence whether a property is in Central London, Manchester, or regional business parks.',
        detail: 'Standardised SFG20 maintenance routines delivered via regional mobile hubs.',
      },
      {
        number: '04',
        title: 'Audit-Ready Landlord Compliance Reporting',
        description: 'Missing fixed-wire EICRs, fire risk assessments, or F-Gas logs during property sales or lease regears delay transactions and devalue assets.',
        detail: 'Instant digital portfolio compliance export via EntireCAFM.',
      },
    ],
    anatomy: {
      headline: 'The Portfolio Governance Anatomy of Commercial Real Estate',
      subline: 'How unified facilities management protects property values and simplifies managing agent oversight:',
      imageSrc: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
      imageAlt: 'Modern commercial corporate office corridor and multi-tenant common parts',
      callouts: [
        { area: 'Base-Build M&E', title: 'Central Plantrooms & HVAC', description: 'Chillers, boilers, distribution boards, and TM44 energy inspections.' },
        { area: 'Tenant Demises', title: 'Demarcation & Reconciliations', description: 'Clear segregation between landlord plant and tenant-owned equipment.' },
        { area: 'Statutory Safety', title: 'Life Safety & Compliance Vault', description: 'EICRs, fire risk assessments, water hygiene sampling, and insurance certs.' },
        { area: 'Financial Reporting', title: 'RICS Service Charge Alignment', description: 'Detailed cost reporting mapped directly to tenant service charge schedules.' },
      ],
    },
    snapshotLead: 'Single-source Hard and Soft FM solutions engineered for commercial managing agents, institutional property investors, and national asset managers.',
    snapshotPriorities: [
      { title: 'Single-Source Accountability', subtitle: 'Consolidated M&E, HVAC, cleaning & compliance under one master contract', iconName: 'operationalExcellence' },
      { title: 'RICS Service Charge Auditing', subtitle: 'Transparent job-by-job expenditure reporting with photo evidence', iconName: 'dataInsights' },
      { title: 'National Portfolio Consistency', subtitle: 'Unified SFG20 engineering standards across all UK regions', iconName: 'commercialBuildings' },
      { title: 'Digital Compliance Vault', subtitle: 'Centralised online access to all statutory certificates and PPM schedules', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Where property portfolio facilities management usually fails.',
    challengesSubline: 'Managing agents operate between demanding tenants and yield-focused landlords. Here is how EntireFM delivers portfolio support:',
    challenges: [
      {
        title: 'Fragmented Contractor Supply Chains Creating Administrative Drag',
        problem: 'Coordinating 15 separate regional subcontractors across 20 commercial properties causes missed compliance visits and billing disputes.',
        solution: 'EntireFM acts as the single-source partner, self-delivering core Hard and Soft FM under one consolidated SLA and single monthly invoice.',
        statutoryStandard: 'RICS Commercial Real Estate Management Professional Standards',
      },
      {
        title: 'Unverifiable Invoices Causing Service Charge Disputes',
        problem: 'Tenants dispute vague contractor invoices, delaying service charge reconciliation and creating cash flow bottlenecks.',
        solution: 'Every EntireFM work order includes GPS-timestamped engineer sign-off, before/after photos, and detailed parts breakdowns in EntireCAFM.',
        statutoryStandard: 'RICS Service Charges in Commercial Property (1st Edition)',
      },
      {
        title: 'Missing Statutory Certificates During Building Transactions',
        problem: 'Gaps in 5-year EICRs, fire risk assessments, or F-Gas logs halt property sales and trigger insurer penalties.',
        solution: 'Our CAFM system automatically alerts our desk to upcoming renewal dates, ensuring 100% continuous statutory compliance certification.',
        statutoryStandard: 'Regulatory Reform (Fire Safety) Order 2005 & Health and Safety at Work Act',
      },
      {
        title: 'Slow Reactive Triage Escalating Tenant Dissatisfaction',
        problem: 'Helpdesk delays in triaging roof leaks or air conditioning faults damage tenant relationships and impact lease renewals.',
        solution: '24/7 central operations desk with contracted attendance SLAs, direct client portal visibility, and dedicated account management.',
        statutoryStandard: 'Contracted Performance SLAs with Key Performance Indicators (KPIs)',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Managed Portfolios',
    systemsSubline: 'Full-spectrum Hard FM, compliance governance, and workplace care across multi-tenant estates:',
    systemGroups: [
      {
        category: 'Mechanical, HVAC & Building Services',
        headline: 'Base-build plantroom care, comfort cooling and ventilation',
        items: [
          'Central chiller & boiler plantroom planned maintenance',
          'VRV/VRF air conditioning servicing & TM44 energy inspections',
          'Air handling unit (AHU) filter cleaning & belt replacements',
          'F-Gas compliant refrigerant inspections and digital logbooks',
          'BMS central controls monitoring & seasonal recommissioning',
        ],
      },
      {
        category: 'Electrical, Lighting & Power Resilience',
        headline: 'Power distribution, architectural lighting and safety',
        items: [
          'Periodic 5-year EICR fixed-wire inspection & testing',
          'Thermal imaging thermographic surveys of main switchboards',
          'Emergency lighting 3-hour battery discharge testing',
          'Standby diesel generator AMF testing & UPS maintenance',
          'Car park, estate street lighting & bollard maintenance',
        ],
      },
      {
        category: 'Life Safety, Fire & Building Security',
        headline: 'Statutory fire protection, access control and security',
        items: [
          'Addressable fire alarm testing & call point checks',
          'Automatic smoke vent (AOV) testing & fire damper audits',
          'Communal fire door inspection, intumescent seals & closers',
          'Access control speed gates, intercoms & CCTV servicing',
          'Dry riser testing, fire extinguisher servicing & water tanks',
        ],
      },
      {
        category: 'Common Part Cleaning, Water & Fabric Care',
        headline: 'Estate presentation, washrooms and water hygiene',
        items: [
          'Contract common-part cleaning & window cleaning to height',
          'Legionella water temperature monitoring & sampling (L8)',
          'High-traffic public washroom plumbing & booster sets',
          'Drainage gully clearance, jetting & interceptor emptying',
          'External landscaping, perimeter fencing & winter gritting',
        ],
      },
    ],
    operatingModelHeadline: 'Managing Agent Operating Model',
    operatingModelSubline: 'How EntireFM delivers seamless multi-site governance and service charge transparency:',
    operatingSteps: [
      { step: '01', title: 'Portfolio Baseline Audit & Onboarding', desc: 'Conducting comprehensive asset condition surveys and barcoding all plant items across every building into EntireCAFM.' },
      { step: '02', title: 'Unified SFG20 PPM Formulation', desc: 'Establishing 52-week preventative maintenance schedules aligned strictly with RICS service charge budgets.' },
      { step: '03', title: 'Regional Mobile Delivery', desc: 'Deploying dedicated mobile engineering teams across UK regions for consistent service quality.' },
      { step: '04', title: 'Live Client Compliance Portal', desc: 'Providing managing agents with 24/7 web access to certificates, open work orders, and SLA performance.' },
      { step: '05', title: 'Quarterly Executive Review', desc: 'Strategic meetings reviewing asset health trends, first-time fix rates, and forward capital expenditure recommendations.' },
    ],
    technologyFocus: {
      badge: 'CAFM & PORTFOLIO ASSET INTELLIGENCE',
      title: 'Centralised Portfolio Governance & Audit-Ready Compliance',
      description: 'Our CAFM system provides managing agents and asset managers with complete digital visibility over multi-property maintenance, reactive jobs, and statutory certification.',
      features: [
        { title: 'Multi-Property Overview', desc: 'Instant portfolio dashboard tracking PPM completion across all managed assets.' },
        { title: 'Service Charge Evidence Packs', desc: 'Every invoice backed by timestamped engineer job sheets and before/after photos.' },
        { title: 'Digital Compliance Vault', desc: 'Searchable EICRs, fire certs, TM44 reports, and water hygiene records for landlord audits.' },
        { title: 'Executive SLA Analytics', desc: 'Transparent reporting of first-time fix rates, response times, and compliance percentage.' },
      ],
    },
    metrics: [
      { figure: 'SFG20', label: 'Standardised PPM Regimes', detail: 'Maintenance aligned strictly with engineering best practice' },
      { figure: 'RICS', label: 'Service Charge Aligned', detail: 'Granular job sheets and evidence supporting auditable recharges' },
      { figure: 'Single-Source', label: 'Consolidated Delivery', detail: 'Hard and Soft FM unified under one master agreement' },
    ],
    conversionCta: {
      headline: 'Looking to Consolidate Facilities Management Across Your Property Portfolio?',
      subheadline: 'Connect with EntireFM portfolio directors. We provide single-source Hard and Soft FM, transparent service charge reporting, and national engineering coverage.',
      badgeText: 'PORTFOLIO ESTATE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'SFG20 Schedules' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Plantroom Care' },
      { name: 'Commercial HVAC & Air Systems', href: '/hvac-contractor', tag: 'Comfort Climate' },
      { name: 'Building Fabric Maintenance', href: '/building-maintenance', tag: 'Common Parts' },
      { name: 'Commercial Cleaning Services', href: '/cleaning-services', tag: 'Estate Hygiene' },
    ],
  },

  // ── 11. CONSTRUCTION HANDOVER & DAY-ONE FM ─────────────────────────────────
  'construction-handover': {
    id: 'construction-handover',
    name: 'Construction Handover & Day-One FM',
    heroBadge: 'CONSTRUCTION HANDOVER & DAY-ONE FM',
    heroHeadline: 'Bridging practical completion into operational FM.',
    heroSubline: 'Specialist facilities management engineered to transition newly completed commercial developments from contractor handover to live operational occupation.',
    heroImage: '/images/editorial/entirefm-site-arrival-2000w.webp',
    heroImageAlt: 'EntireFM mobile engineering unit arriving at newly constructed commercial development for handover onboarding',
    heroHighlightedTitle: 'Practical Completion & Asset Onboarding',
    heroFacts: [
      { label: 'Handover Framework', value: 'BSRIA Soft Landings' },
      { label: 'Asset Onboarding', value: 'Day-One Barcode Tagging' },
      { label: 'Defect Support', value: 'DLP Triage Coordination' },
    ],
    operationalStatement: 'The gap between construction completion and live occupation is where buildings fail.',
    operationalLead: 'Practical completion is not the end of a project. Incoming tenants need immediate Day-One operational support, asset warranty protection, and clear defects logging.',
    realityImage: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    realityImageAlt: 'EntireFM engineers conducting initial commissioning and asset verification',
    realityImageCaption: 'Pre-handover asset walkthrough and digital CAFM configuration',
    operationalRealities: [
      {
        number: '01',
        title: 'Pre-Handover Asset Walkthrough & Verification',
        description: 'Verifying that physical plant installations match the O&M manuals and commissioning certificates before the principal contractor leaves site.',
        detail: 'Comprehensive asset verification and condition baseline logging.',
      },
      {
        number: '02',
        title: 'Specialist Builders Clean & Sparkle Finish',
        description: 'Thorough post-construction deep cleaning removing fine plaster dust, paint overspray, and protective films for pristine client presentation.',
        detail: 'Sparkle cleaning of glass, sanitaryware, and raised access floors.',
      },
      {
        number: '03',
        title: 'Defects Liability Period (DLP) Management',
        description: 'Logging, tracking, and coordinating snagging items with the original installing trade contractors to protect client warranty claims.',
        detail: 'Photographic defect logging and formal trade contractor SLA follow-up.',
      },
      {
        number: '04',
        title: 'Day-One Tenant Move-In & Technical Triage',
        description: 'On-site technical engineers assist incoming tenants with access fobs, BMS temperature balancing, and immediate issue triage during occupation.',
        detail: 'Smooth transition from fit-out into long-term facilities management.',
      },
    ],
    anatomy: {
      headline: 'The Handover Infrastructure of a New Development',
      subline: 'Key milestones and building services transitioning from construction to live management:',
      imageSrc: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
      imageAlt: 'EntireFM fleet and engineering mobilisation team',
      callouts: [
        { area: 'Plant Commissioning', title: 'M&E Commissioning Records', description: 'Balancing certificates, pressure test logs, and electrical commissioning sign-offs.' },
        { area: 'Digital Asset Register', title: 'Barcode Asset Onboarding', description: 'Every plant item barcoded and mapped to SFG20 statutory maintenance routines.' },
        { area: 'Defects Management', title: 'DLP Contractor Triage', description: 'Photographic defect logging and coordination with principal fit-out contractors.' },
        { area: 'Day-One Operation', title: 'On-Site FM & Janitorial Care', description: 'Tenant move-in coordination, waste management, and ongoing statutory PPM.' },
      ],
    },
    snapshotLead: 'Specialist facilities management engineered to transition newly completed commercial developments from contractor handover to live operational occupation.',
    snapshotPriorities: [
      { title: 'Digital Asset Onboarding', subtitle: 'Barcoding plant assets into CAFM before tenant move-in', iconName: 'dataInsights' },
      { title: 'Specialist Sparkle Cleaning', subtitle: 'Builders cleans, glass polishing & immaculate handover finish', iconName: 'commercialCleaning' },
      { title: 'DLP Defect Coordination', subtitle: 'Photographic snag logging protecting contractor warranties', iconName: 'complianceAudit' },
      { title: 'Day-One On-Site Engineering', subtitle: 'Technical presence ensuring smooth tenant occupation and BMS tuning', iconName: 'operationalExcellence' },
    ],
    challengesHeadline: 'Where construction handovers usually fail.',
    challengesSubline: 'The transition from construction to live building operation is fraught with friction. Here is how EntireFM guarantees a smooth handover:',
    challenges: [
      {
        title: 'Unindexed O&M Manuals & Delayed Asset Handover',
        problem: 'Disorganized paper manuals mean incoming facilities teams have no clear register of plant assets or statutory test dates.',
        solution: 'EntireFM conducts physical barcode asset surveys prior to practical completion, building a live digital asset register in EntireCAFM.',
        statutoryStandard: 'BSRIA BG 54/2018 Soft Landings Framework & O&M Standards',
      },
      {
        title: 'Residual Construction Dust in HVAC Ductwork',
        problem: 'Fine plaster dust circulating through newly commissioned air handling units damages fan coils and triggers tenant air quality complaints.',
        solution: 'Pre-handover ductwork inspections, TR19 cleanliness verification, and fresh secondary filter exchanges before tenant move-in.',
        statutoryStandard: 'BESA TR19 Cleanliness of Ventilation Systems',
      },
      {
        title: 'DLP Snagging Disputes with Fit-Out Contractors',
        problem: 'Unclear defect responsibility leads to arguments over whether a fault is a contractor snag or an operational maintenance issue.',
        solution: 'Our CAFM logs defects with photographic evidence and commissioning data, providing indisputable records for warranty resolution.',
        statutoryStandard: 'JCT / NEC4 Contract Defects Liability Governance',
      },
      {
        title: 'Lapsed Statutory Certificates in the Handover Gap',
        problem: 'Commissioning certificates expire shortly after handover, leaving the building owner legally non-compliant on Day 1.',
        solution: 'EntireFM schedules immediate 52-week SFG20 PPM routines from Day 1 of occupation, ensuring seamless statutory compliance continuity.',
        statutoryStandard: 'Building Regulations Part L, Electricity at Work Regs & Fire Safety Order',
      },
    ],
    systemsHeadline: 'Engineered Facilities Systems for Construction Handover',
    systemsSubline: 'Specialist mobilisation, snagging management, and Day-One facilities care:',
    systemGroups: [
      {
        category: 'Asset Onboarding & Digital CAFM',
        headline: 'Asset register formulation and warranty mapping',
        items: [
          'Pre-handover physical asset survey & barcode tagging',
          'O&M manual verification and digital document archiving',
          'Asset warranty start/end date mapping in EntireCAFM',
          'SFG20 maintenance routine formulation for all plant items',
          'Energy metering verification & baseline utility readings',
        ],
      },
      {
        category: 'Specialist Handover Cleans & Presentation',
        headline: 'Builders cleans, sparkle finish and glass detailing',
        items: [
          'Comprehensive post-construction builders cleaning',
          'Sparkle finish cleans for tenant and client handover',
          'External facade, glazing and architectural cladding washing',
          'Raised access floor void vacuuming and tile realignments',
          'Carpark jet-washing, line marking and external realm care',
        ],
      },
      {
        category: 'Mechanical & Electrical Handover Verification',
        headline: 'Plant verification, commissioning checks and balancing',
        items: [
          'HVAC commissioning certificate review & airflow checks',
          'BMS sensor calibration, setpoint testing & scheduling',
          'Fixed wire EICR sign-off verification & panel labeling',
          'Emergency lighting central battery test validation',
          'Water system chlorination certificate verification (L8)',
        ],
      },
      {
        category: 'Defect Management & Day-One FM Support',
        headline: 'On-site presence protecting contractor warranty periods',
        items: [
          'Day-One on-site FM presence assisting incoming tenant move-ins',
          'Defects Liability Period (DLP) logging and specialist coordination',
          'Rapid technical triage preventing minor snags from escalating',
          'Meter reading verification and utility handover records',
          'Smooth operational handover to long-term facilities management team',
        ],
      },
    ],
    operatingModelHeadline: 'Construction Handover Operating Model',
    operatingModelSubline: 'Bridging the critical gap between practical completion and live building management:',
    operatingSteps: [
      { step: '01', title: 'Pre-Handover Asset Walkthrough', desc: 'Our engineers walk the site with the principal contractor to verify asset locations and O&M alignment.' },
      { step: '02', title: 'Builders Clean & Sparkle Finish', desc: 'Specialist cleaning teams deliver immaculate presentation for final client inspection.' },
      { step: '03', title: 'Digital CAFM Onboarding', desc: 'All assets, warranties, and maintenance frequencies configured before practical completion.' },
      { step: '04', title: 'Day-One Tenant Support', desc: 'On-site technical engineers ensure smooth tenant move-in and immediate issue triage.' },
      { step: '05', title: 'Seamless Transition to Long-Term FM', desc: 'Continuous statutory compliance and PPM care from the very first day of occupation.' },
    ],
    technologyFocus: {
      badge: 'CAFM & HANDOVER GOVERNANCE',
      title: 'Digital Handover & Asset Management Platform',
      description: 'Streamlining practical completion by organizing every asset warranty, commissioning cert, and maintenance task in one digital platform.',
      features: [
        { title: 'Digital O&M Asset Register', desc: 'Barcoded plant items linked directly to installation specs and warranties.' },
        { title: 'Snagging Defect Log', desc: 'Photographic defect tracking coordinating trade contractors during the DLP.' },
        { title: 'Handover Compliance Checklist', desc: 'Verification of all statutory commissioning documents in one vault.' },
        { title: 'Client Ready Dashboard', desc: 'Seamless handover interface for incoming building owners and tenants.' },
      ],
    },
    metrics: [
      { figure: 'BSRIA', label: 'Soft Landings Aligned', detail: 'Structured handover process reducing post-occupation friction' },
      { figure: 'Barcoded', label: 'Day-One Asset Register', detail: 'Every maintainable plant item tagged into digital CAFM' },
      { figure: 'Audit-Ready', label: 'Commissioning Verification', detail: 'All statutory certificates verified before tenant occupation' },
    ],
    conversionCta: {
      headline: 'Approaching Practical Completion on a Commercial or Fit-Out Project?',
      subheadline: 'Speak with EntireFM handover specialists. We provide sparkle cleans, asset onboarding, defect management, and seamless transition to live FM.',
      badgeText: 'CONSTRUCTION HANDOVER CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Handover Care' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Asset Onboarding' },
      { name: 'Specialist Commercial Cleaning', href: '/commercial-cleaning', tag: 'Sparkle Cleans' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Plant Verification' },
      { name: 'Commercial HVAC & Commissioning', href: '/hvac-contractor', tag: 'Air Quality' },
    ],
  },
};

/**
 * Helper to resolve archetype configuration for any given sector route.
 */
export function resolveSectorArchetype(path: string): SectorArchetype {
  const p = path.toLowerCase();
  if (p.includes('industrial') || p.includes('manufactur')) return SECTOR_ARCHETYPES.industrial;
  if (p.includes('healthcare') || p.includes('hospital') || p.includes('clinical')) return SECTOR_ARCHETYPES.healthcare;
  if (p.includes('education') || p.includes('school') || p.includes('universit')) return SECTOR_ARCHETYPES.education;
  if (p.includes('hotel') || p.includes('resort') || p.includes('restaurant') || p.includes('hospitality')) return SECTOR_ARCHETYPES.hospitality;
  if (p.includes('arena') || p.includes('stadium') || p.includes('sports') || p.includes('sport-centre') || p.includes('leisure') || p.includes('landmark')) return SECTOR_ARCHETYPES['venues-leisure'];
  if (p.includes('residential')) return SECTOR_ARCHETYPES['residential-prs'];
  if (p.includes('retail') || p.includes('shopping-centre')) return SECTOR_ARCHETYPES.retail;
  if (p.includes('logistics') || p.includes('distribution') || p.includes('warehouse') || p.includes('transport') || p.includes('service-station') || p.includes('airport')) return SECTOR_ARCHETYPES['logistics-warehousing'];
  if (p.includes('construction')) return SECTOR_ARCHETYPES['construction-handover'];
  if (p.includes('managing-agent') || p.includes('property-manager') || p.includes('tier-one') || p.includes('tierone') || p.includes('public-sector') || p.includes('industries')) return SECTOR_ARCHETYPES['corporate-managing-agents'];
  if (p.includes('commercial') || p.includes('office') || p.includes('corporate') || p.includes('co-working')) return SECTOR_ARCHETYPES['commercial-offices'];
  return SECTOR_ARCHETYPES['commercial-offices'];
}
