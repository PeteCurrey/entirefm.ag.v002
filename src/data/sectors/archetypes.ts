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

export interface SectorArchetype {
  id: string;
  name: string;
  heroBadge: string;
  heroImage: string;
  heroImageAlt: string;
  heroHighlightedTitle: string;
  heroFacts: Array<{ label: string; value: string }>;
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
  industrial: {
    id: 'industrial',
    name: 'Industrial & Manufacturing',
    heroBadge: 'INDUSTRIAL & MANUFACTURING FM',
    heroImage: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    heroImageAlt: 'EntireFM engineer conducting industrial switchroom survey in heavy manufacturing plant',
    heroHighlightedTitle: 'Plant Reliability & Uptime',
    heroFacts: [
      { label: 'Continuous Process Uptime', value: 'Zero-Disruption PPM' },
      { label: 'High-Voltage Switchgear & LEV', value: 'Heavy Engineering' },
      { label: 'Permit-to-Work & LOTO Governance', value: 'Strict Safety Audit' },
    ],
    snapshotLead: 'Engineering-led facilities management for heavy manufacturing plants, process facilities, and industrial estates where unplanned downtime costs thousands per hour.',
    snapshotPriorities: [
      { title: 'Production Line Uptime', subtitle: 'PPM scheduled around shift patterns and tooling shutdowns', iconName: 'operationalExcellence' },
      { title: 'Heavy HV/LV Distribution', subtitle: 'Main switchgear, transformers, busbars & power factor correction', iconName: 'powerElectrical' },
      { title: 'Statutory Safety & LEV', subtitle: 'Local exhaust ventilation, pressure vessels & DSEAR compliance', iconName: 'riskCompliance' },
      { title: 'Strict LOTO Governance', subtitle: 'Formal Lock-Out / Tag-Out and hot work permit administration', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Manufacturing facilities cannot tolerate unplanned downtime.',
    challengesSubline: 'Industrial environments operate under intense commercial and safety pressure. Here is how EntireFM engineers resolve core plant vulnerabilities:',
    challenges: [
      {
        title: 'Production Schedule Clashes with Statutory Servicing',
        problem: 'Stopping active assembly or processing lines for routine mechanical/electrical maintenance incurs heavy throughput losses.',
        solution: 'EntireFM structures all major plant overhauls, boiler servicing, and distribution board tests into planned night-shift windows or bank holiday tooling shutdowns.',
        statutoryStandard: 'SFG20 Industrial Task Frequency & Machinery Directives',
      },
      {
        title: 'High-Load Switchgear & Thermal Hot-Spot Failures',
        problem: 'Continuous high electrical demand induces thermal stress, component oxidation, and catastrophic breaker trips.',
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
      { figure: '100%', label: 'Statutory Compliance Audit Trail', detail: 'Digital certificates timestamped and archived on completion' },
      { figure: '24/7', label: 'Priority Emergency Response Desk', detail: 'Dedicated technical triage for critical plant stoppages' },
      { figure: 'SFG20', label: 'Standardised Maintenance Tasks', detail: 'Manufacturer-aligned task schedules preserving asset warranty' },
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

  'commercial-offices': {
    id: 'commercial-offices',
    name: 'Commercial Offices & Corporate Estates',
    heroBadge: 'COMMERCIAL OFFICES & HEADQUARTERS',
    heroImage: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    heroImageAlt: 'EntireFM commercial facilities management across modern multi-storey corporate office building',
    heroHighlightedTitle: 'Workplace Experience & Asset Performance',
    heroFacts: [
      { label: 'Multi-Tenant Comfort Balancing', value: 'Zoned HVAC & Air' },
      { label: 'Executive Front-of-House', value: 'Pristine Standards' },
      { label: 'Out-of-Hours Servicing', value: 'Zero Tenant Disruption' },
    ],
    snapshotLead: 'Integrated facilities management engineered for prime corporate headquarters, multi-tenant commercial offices, and flexible co-working spaces.',
    snapshotPriorities: [
      { title: 'Indoor Air Quality & Comfort', subtitle: 'VRV/VRF temperature balance, fresh air ventilation & filtration', iconName: 'commercialBuildings' },
      { title: 'Immaculate Presentation', subtitle: 'High-frequency day janitors, executive washrooms & fabric care', iconName: 'commercialCleaning' },
      { title: 'Out-of-Hours Engineering', subtitle: 'Noisy maintenance and compliance testing scheduled when desks are empty', iconName: 'twentyFourSevenOps' },
      { title: 'Transparent Service Charge Audit', subtitle: 'Clear digital reporting partitioned by tenant and landlord demises', iconName: 'dataInsights' },
    ],
    challengesHeadline: 'Office FM must deliver five-star tenant experience while protecting landlord assets.',
    challengesSubline: 'Modern office occupiers expect perfect climate control, rapid fault resolution, and spotless amenities. Here is how EntireFM manages corporate real estate:',
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
        statutoryStandard: 'RICS Service Charges in Commercial Property Code',
      },
    ],
    systemsHeadline: 'Integrated Facilities Systems for Corporate Offices',
    systemsSubline: 'Comprehensive Hard & Soft FM services structured for corporate landlords, managing agents, and occupiers:',
    systemGroups: [
      {
        category: 'Workplace Climate & HVAC',
        headline: 'Thermal comfort and clean fresh air across all floors',
        items: [
          'VRV / VRF air conditioning quarterly servicing and filter hygiene',
          'Air handling units (AHUs) belt tensioning & HEPA filtration',
          'Building Management System (BMS) schedule & setpoint tuning',
          'F-Gas statutory leak checks with digital register logging',
          'Chiller compressor oil sampling and seasonal changeover',
        ],
      },
      {
        category: 'Power, Lighting & Electrical Safety',
        headline: 'Continuous electrical reliability and statutory testing',
        items: [
          'Fixed wire electrical testing (EICR) across tenant & landlord boards',
          'Emergency lighting monthly flick tests & 3-hour annual audits',
          'DALI architectural lighting scene configuration and repairs',
          'Floor box power reconfigurations and comms room UPS servicing',
          'Portable appliance testing (PAT) for communal & office appliances',
        ],
      },
      {
        category: 'Life Safety, Fire & Water Compliance',
        headline: 'Absolute protection for office occupants and visitors',
        items: [
          'Fire alarm weekly bell tests, call point checks & panel servicing',
          'Fire door inspection, drop-seal tests & intumescent gap auditing',
          'Water hygiene temperature monitoring & Legionella risk assessments',
          'Disabled refuge intercom and automatic door operator testing',
          'Dry riser and sprinkler system periodic maintenance checks',
        ],
      },
      {
        category: 'Soft FM & Workplace Services',
        headline: 'Immaculate presentation and day-to-day building care',
        items: [
          'Daily contract office cleaning & executive washroom sanitisation',
          'Daytime janitorial attendance for rapid spills and stock management',
          'Internal carpet extraction, window cleaning & high-level dusting',
          'Grounds maintenance, gritting & external car park care',
          'Waste management, confidential shredding & recycling streams',
        ],
      },
    ],
    operatingModelHeadline: 'Corporate Estate Operating Framework',
    operatingModelSubline: 'Precision facilities management delivery tailored for modern office real estate:',
    operatingSteps: [
      { step: '01', title: 'Asset Register & Demise Mapping', desc: 'Every plant item is tagged and attributed to either Landlord Base Build or Tenant Fit-out.' },
      { step: '02', title: 'Access & Quiet Hours Protocol', desc: 'Routine servicing matrix scheduled strictly outside 08:00–18:00 tenant trading hours.' },
      { step: '03', title: 'Uniformed Mobile Engineers', desc: 'Professional, background-checked technicians equipped with full PPE and smart corporate presentation.' },
      { step: '04', title: 'Instant Helpdesk Triage', desc: 'Tenants log requests via QR code or portal; priority SLAs trigger rapid dispatch.' },
      { step: '05', title: 'Monthly Executive Governance', desc: 'Detailed reporting on SLA compliance, first-time fix rates, and energy telemetry.' },
    ],
    technologyFocus: {
      badge: 'CAFM & TENANT EXPERIENCE',
      title: 'Real-Time CAFM Portal for Landlords, Tenants & Managing Agents',
      description: 'Complete digital transparency over building compliance, reactive repair statuses, and service charge evidence packs.',
      features: [
        { title: 'Multi-Demise Partitioning', desc: 'Separate portals for managing agents and individual floor tenants.' },
        { title: 'Live Ticket QR Scanning', desc: 'Occupants scan desk/room QR codes to report temperature or fabric issues instantly.' },
        { title: 'Digital Compliance Logbook', desc: 'Real-time cloud archival of EICRs, fire certs, and water hygiene logs.' },
        { title: 'Service Charge Proof', desc: 'Exportable work order proof packs simplifying year-end reconciliations.' },
      ],
    },
    metrics: [
      { figure: '99.8%', label: 'Asset Availability Rate', detail: 'Preventative routines keeping HVAC and power fully operational' },
      { figure: 'Out-of-Hours', label: 'Standard Maintenance Windows', detail: 'No noise, no dust, and no interruptions to working hours' },
      { figure: 'Single Contact', label: 'Dedicated Account Manager', detail: 'One direct point of contact for all building matters' },
    ],
    conversionCta: {
      headline: 'Looking for Higher Standards Across Your Office Portfolio?',
      subheadline: 'Speak with EntireFM about our integrated Hard & Soft FM service model. We create immaculate workplace environments while preserving building capital value.',
      badgeText: 'COMMERCIAL OFFICE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', tag: 'Climate Control' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Hard Services' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Plant' },
      { name: 'Commercial Contract Cleaning', href: '/commercial-cleaning', tag: 'Soft FM' },
      { name: 'Planned Preventative Maintenance', href: '/ppm', tag: 'Asset Care' },
    ],
  },

  'logistics-warehousing': {
    id: 'logistics-warehousing',
    name: 'Logistics, Warehousing & Distribution',
    heroBadge: 'LOGISTICS & DISTRIBUTION CENTRES',
    heroImage: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    heroImageAlt: 'EntireFM facilities management and technical maintenance at major UK logistics distribution hub',
    heroHighlightedTitle: '24/7 Throughput & Loading Bay Availability',
    heroFacts: [
      { label: 'High-Volume Goods In/Out', value: 'Dock Leveller Uptime' },
      { label: 'Massive Footprints & Yards', value: 'High-Bay Lighting & Fabric' },
      { label: '24/7 Round-the-Clock', value: 'Rapid Emergency Cover' },
    ],
    snapshotLead: 'Heavy-duty facilities engineering and estate management for high-throughput distribution hubs, automated fulfillment centres, and cross-dock logistics facilities.',
    snapshotPriorities: [
      { title: 'Dock Leveller & Door Uptime', subtitle: 'Rapid repairs for loading bays, sectional doors & rapid-roll shutters', iconName: 'maintenanceTools' },
      { title: 'High-Bay Electrical & Lighting', subtitle: 'High-level LED maintenance, distribution boards & emergency arrays', iconName: 'powerElectrical' },
      { title: 'Large-Volume Space Heating', subtitle: 'Destratification fans, radiant overhead heaters & gas fired units', iconName: 'twentyFourSevenOps' },
      { title: 'Yard & Perimeter Security', subtitle: 'Automated barrier gates, CCTV, access turnstiles & winter gritting', iconName: 'securityCctv' },
    ],
    challengesHeadline: 'In logistics, a broken loading door or faulty breaker halts the entire supply chain.',
    challengesSubline: 'Distribution centres run on strict delivery timetables. EntireFM provides the robust engineering and rapid response necessary to keep goods moving:',
    challenges: [
      {
        title: 'Failed Dock Levellers Halting Vehicle Turnaround',
        problem: 'Hydraulic ramp failures or damaged dock seals trap trailers and prevent unloading, cascading delays across the transport network.',
        solution: 'Periodic hydraulic servicing, seal inspections, interlock checks, and prioritized emergency engineer callout with common ram and seal spares.',
        statutoryStandard: 'LOLER Regulations 1998 & PUWER 1998 Machinery Safety',
      },
      {
        title: 'High-Bay Lighting Failures in 15m+ Racking Aisles',
        problem: 'Dark picking aisles create severe health and safety hazards for forklift drivers and picking teams.',
        solution: 'IPAF-certified high-access mobile engineers utilizing scissor lifts and articulating booms for rapid luminaire repairs and sensor re-commissioning.',
        statutoryStandard: 'CIBSE Lighting Guide 1: Industrial Environments',
      },
      {
        title: 'Winter Freeze, Ice in Yards & Loading Aprons',
        problem: 'Black ice in vehicle marshalling yards causes articulated lorry collisions, forklift skidding, and pedestrian injuries.',
        solution: 'Automated Met Office weather-triggered proactive gritting, salt bin replenishment, and high-capacity snow clearance services.',
        statutoryStandard: 'Workplace Regulations 1992 (Regulation 12 Traffic Routes)',
      },
      {
        title: 'High Gas Bills & Cold Air Ingress at Open Bays',
        problem: 'Constantly opening roller doors dump building heat, driving astronomical heating costs and miserable picking temperatures.',
        solution: 'Servicing of fast-acting roller doors, maintenance of air curtains, and recalibration of destratification fan speed controls.',
        statutoryStandard: 'Building Regulations Part L & TM44 Inspections',
      },
    ],
    systemsHeadline: 'Logistics & Distribution Facilities Scopes',
    systemsSubline: 'Comprehensive maintenance covering internal high-bay warehouse space, offices, and external logistics yards:',
    systemGroups: [
      {
        category: 'Loading Bay & Door Systems',
        headline: 'Critical throughput assets and goods handling maintenance',
        items: [
          'Hydraulic dock leveller inspection, oil checks & LOLER certification',
          'Industrial roller shutters, rapid-roll speed doors & sectional repairs',
          'Inflatable and mechanical dock shelter & bumper pad maintenance',
          'Vehicle wheel lock interlocks, traffic lights & dock guide mirrors',
          'Loading bay edge protection barriers & safety gate servicing',
        ],
      },
      {
        category: 'High-Level Electrical & Lighting',
        headline: 'Warehouse aisle illumination and heavy distribution',
        items: [
          'High-bay LED luminaire maintenance & daylight sensor tuning',
          'Periodic fixed wire testing (EICR) across main warehouse panels',
          'Emergency lighting 3-hour battery discharge testing & logbooks',
          'MHE forklift charging station electrical supply & breaker testing',
          'Busbar trunking and high-level cable tray periodic inspection',
        ],
      },
      {
        category: 'Warehouse Heating & Ventilation',
        headline: 'Volumetric space heating and air movement',
        items: [
          'Overhead radiant tube heaters & warm air blowers servicing',
          'Destratification fans speed control & balance calibration',
          'Smoke and heat exhaust ventilation systems (SHEVS) & louvres',
          'Office mezzanine HVAC VRV/VRF air conditioning maintenance',
          'Commercial gas train safety certification (CP12)',
        ],
      },
      {
        category: 'External Yard & Perimeter Fabric',
        headline: 'Heavy vehicle yards, drainage, and building envelope',
        items: [
          'Automated security entrance gates, barriers & ANPR servicing',
          'Heavy-duty yard drainage pumps, interceptors & gully clearance',
          'Roof gutter vacuuming, cladding repairs & downpipe cleaning',
          'Proactive winter gritting and salt bin management services',
          'Fencing, crash barrier and bollard repairs after vehicle impact',
        ],
      },
    ],
    operatingModelHeadline: 'Logistics Hub Operating Framework',
    operatingModelSubline: 'Resilient FM delivery structured for uninterrupted 24/7 logistics operations:',
    operatingSteps: [
      { step: '01', title: 'High-Level Asset Barcoding', desc: 'Every dock leveller, door, and heater is barcoded with serials and hydraulic specs.' },
      { step: '02', title: 'Aisle-By-Aisle Access Planning', desc: 'PPM works coordinated with warehouse shift supervisors to isolate single aisles safely.' },
      { step: '03', title: 'IPAF & MEWP Certified Crews', desc: 'Specialist engineers qualified for high-level MEWP access in active automated warehouses.' },
      { step: '04', title: 'Rapid Breakdown Dispatch', desc: 'Central 24/7 helpdesk dispatches local engineers when dock doors or critical plant fail.' },
      { step: '05', title: 'LOLER & Statutory Archival', desc: 'Instant certificate uploads satisfying health & safety and insurance inspectors.' },
    ],
    technologyFocus: {
      badge: 'CAFM & CRITICAL ASSET UPTIME',
      title: 'Digital Loading Bay & Asset Management Platform',
      description: 'Real-time telemetry and ticket tracking ensuring warehouse operations managers always know the exact status of dock bays and plant.',
      features: [
        { title: 'Dock Bay Status Dashboard', desc: 'Immediate visibility of available vs out-of-service loading bays across your hub.' },
        { title: 'LOLER Certificate Vault', desc: 'Searchable database of hydraulic lift and leveller compliance inspections.' },
        { title: 'First-Time Fix Tracking', desc: 'Detailed tracking of parts usage and turnaround times on roller doors.' },
        { title: 'Multi-Site Portfolio View', desc: 'Centralised reporting across all UK regional distribution nodes.' },
      ],
    },
    metrics: [
      { figure: '99.5%', label: 'Dock Bay Target Availability', detail: 'Rapid preventative servicing eliminating loading ramp downtime' },
      { figure: '24/7/365', label: 'Round-The-Clock Response Desk', detail: 'Emergency engineer dispatch for broken doors and power outages' },
      { figure: 'LOLER', label: 'Complete Lifting Compliance', detail: 'Statutory testing for all hydraulic docks and lifting equipment' },
    ],
    conversionCta: {
      headline: 'Operating a High-Throughput Logistics or Distribution Hub?',
      subheadline: 'Speak to EntireFM about robust Hard FM and loading bay maintenance. We protect goods throughput and ensure total statutory safety compliance.',
      badgeText: 'LOGISTICS CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Fabric & Doors' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Plant' },
      { name: 'Planned Preventative Maintenance', href: '/ppm', tag: 'Asset Care' },
      { name: 'Industrial Extraction & LEV', href: '/industrial-cleaning', tag: 'High-Level Care' },
      { name: 'Plumbing & Heating Services', href: '/plumbing-gas', tag: 'Space Heating' },
    ],
  },

  retail: {
    id: 'retail',
    name: 'Retail, Shopping Centres & Retail Parks',
    heroBadge: 'RETAIL ESTATES & SHOPPING CENTRES',
    heroImage: '/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-1600w.webp',
    heroImageAlt: 'EntireFM commercial facilities management across prime retail and high-footfall shopping destination',
    heroHighlightedTitle: 'Footfall, Presentation & Trading Hours',
    heroFacts: [
      { label: 'Trading Continuity', value: 'Zero Customer Disruption' },
      { label: 'Multi-Site Estate Consistency', value: 'National Coverage' },
      { label: 'Customer Hygiene & Climate', value: 'Comfort Guaranteed' },
    ],
    snapshotLead: 'Specialist facilities management engineered for shopping centres, high-street retail chains, and out-of-town retail parks across the UK.',
    snapshotPriorities: [
      { title: 'Store Trading Protection', subtitle: 'All maintenance and deliveries scheduled outside shopper opening hours', iconName: 'commercialBuildings' },
      { title: 'Retail HVAC & Air Curtains', subtitle: 'Comfort cooling, warm air door curtains & VRV system reliability', iconName: 'maintenanceTools' },
      { title: 'Customer Washroom Hygiene', subtitle: 'Rapid plumbing triage, sensor tap repairs & high-standard janitorial care', iconName: 'commercialCleaning' },
      { title: 'Emergency Glazing & Security', subtitle: 'Fast response for broken shopfronts, automatic doors & security shutters', iconName: 'securityCctv' },
    ],
    challengesHeadline: 'In retail, a building fault directly reduces customer dwell time and lost sales.',
    challengesSubline: 'Shoppers expect comfortable temperatures, working amenities, and flawless store presentation. Here is how EntireFM supports retail operations:',
    challenges: [
      {
        title: 'HVAC Failure on Peak Trading Days',
        problem: 'Overheating in summer or freezing winter drafts near store entrances drives customers out and ruins trading revenue.',
        solution: 'Regular PPM servicing of entrance over-door air heaters, VRV cooling cassettes, and extract ventilation with 24/7 priority callout.',
        statutoryStandard: 'F-Gas Regulations & Workplace Comfort Guidelines',
      },
      {
        title: 'Customer Washroom Plumbing Breakdowns & Leaks',
        problem: 'Overflowing toilets or non-functioning baby changing facilities cause immediate customer outrage and reputational damage.',
        solution: 'Same-day reactive plumbing dispatch, regular preventative descaling of sensor urinals, and rapid pipework repairs.',
        statutoryStandard: 'Water Supply (Water Fittings) Regulations 1999',
      },
      {
        title: 'Multi-Site Inconsistency Across Dispersed Chains',
        problem: 'Managing dozens of high street stores with fragmented local handymen leads to missing compliance certs and poor budget control.',
        solution: 'One single national contract with EntireFM, uniform SLAs, transparent pricing, and centralized CAFM compliance tracking.',
        statutoryStandard: 'Centralised National SLA Governance',
      },
      {
        title: 'Automatic Entrance Door & Shutter Malfunctions',
        problem: 'A jammed automatic entrance door prevents customer entry or traps staff after closing.',
        solution: 'BS EN 16005 compliance checks, periodic roller shutter servicing, and emergency manual release testing.',
        statutoryStandard: 'BS EN 16005 Power Operated Pedestrian Doors',
      },
    ],
    systemsHeadline: 'Retail Facilities Systems & Store Engineering',
    systemsSubline: 'Comprehensive maintenance covering shopfronts, customer trading floors, and back-of-house store rooms:',
    systemGroups: [
      {
        category: 'Store Climate & Air Curtains',
        headline: 'Comfort cooling and customer entrance temperature barriers',
        items: [
          'Over-door warm air curtain servicing & thermostat calibration',
          'VRV / VRF comfort cooling cassettes filter washing & sanitisation',
          'Stockroom extract ventilation and air exchange fan servicing',
          'F-Gas refrigerant leak detection and electronic logbooks',
          'Condensate pump testing and drain line clearing',
        ],
      },
      {
        category: 'Store Lighting & Electrical',
        headline: 'Merchandise display illumination and life safety',
        items: [
          'Track lighting, spotlight replacements & display luminaire repairs',
          'Periodic fixed wire testing (EICR) across store distribution boards',
          'Emergency lighting monthly testing and 3-hour annual audits',
          'Till point power supply, data cabling & comms rack UPS checks',
          'External illuminated signage & fascia lighting repairs',
        ],
      },
      {
        category: 'Store Access & Physical Security',
        headline: 'Customer ingress, automatic sliders and perimeter security',
        items: [
          'Automatic sliding door servicing & BS EN 16005 safety sensor checks',
          'Security roller shutters, grilles & key switch maintenance',
          'Emergency exit panic hardware, maglocks & alarm interlocks',
          'EAS security tagging antenna power supply and cabling checks',
          'Intruder alarm, CCTV camera angles & DVR recording verification',
        ],
      },
      {
        category: 'Customer Washrooms & Store Fabric',
        headline: 'Clean amenities and professional retail presentation',
        items: [
          'Customer & staff washroom plumbing, taps & drainage maintenance',
          'Water hygiene temperature checks & Legionella monitoring',
          'Storefront glazing repairs, silicone resealing & manifestation care',
          'Retail floor tile replacement, mastic repairs & threshold fixing',
          'Back-of-house racking safety checks & waste compaction care',
        ],
      },
    ],
    operatingModelHeadline: 'Retail Estate Operating Framework',
    operatingModelSubline: 'Designed specifically to preserve customer dwell time and store footfall:',
    operatingSteps: [
      { step: '01', title: 'Out-of-Hours Servicing Matrix', desc: 'All disruptive engineering, testing, and cleaning scheduled pre-trading or post-closing.' },
      { step: '02', title: 'Uniform National Asset Register', desc: 'Standardized digital catalog of all store AC units, shutters, and switchboards across your chain.' },
      { step: '03', title: 'Store Manager Mobile Helpdesk', desc: 'Store managers log issues in seconds via phone or mobile portal with instant SLA tracking.' },
      { step: '04', title: 'Rapid Reactive Response', desc: 'Mobile technicians arrive with common retail spares to achieve first-time fix.' },
      { step: '05', title: 'Central Consolidated Billing', desc: 'One itemised monthly invoice and live compliance portal for estate managers.' },
    ],
    technologyFocus: {
      badge: 'CAFM & MULTI-SITE RETAIL',
      title: 'Centralised Portal for Retail Property & Operations Directors',
      description: 'Complete estate oversight showing statutory compliance status, reactive ticket speed, and spend across every store location.',
      features: [
        { title: 'Store-by-Store Compliance Status', desc: 'Traffic-light overview of fire, electrical, and water safety across all branches.' },
        { title: 'Live Reactive Job Tracking', desc: 'Track engineer attendance and see photographic completion evidence on each repair.' },
        { title: 'Pre-Approved Spend Limits', desc: 'Set regional spending caps to accelerate repairs without bureaucratic delays.' },
        { title: 'Consolidated Estate Reporting', desc: 'Monthly executive summaries on asset performance and budget trends.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'Trading Hours Integrity', detail: 'Zero disruptive maintenance carried out while stores are open to customers' },
      { figure: 'National', label: 'UK-Wide Store Support', detail: 'Consistent service standards across high streets and retail parks' },
      { figure: 'BS EN 16005', label: 'Automatic Door Compliance', detail: 'Certified testing for powered customer entrance doors' },
    ],
    conversionCta: {
      headline: 'Managing a Multi-Site Retail Estate or Shopping Centre?',
      subheadline: 'Contact EntireFM to discuss a consolidated national facilities contract. We protect customer trading, improve store presentation, and ensure complete compliance.',
      badgeText: 'RETAIL CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'National Schedules' },
      { name: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', tag: 'Store Climate' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Fabric & Doors' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Lights' },
      { name: 'Commercial Contract Cleaning', href: '/commercial-cleaning', tag: 'Hygiene' },
    ],
  },

  healthcare: {
    id: 'healthcare',
    name: 'Healthcare, Clinics & Medical Centres',
    heroBadge: 'HEALTHCARE & CLINICAL FACILITIES',
    heroImage: '/images/editorial/entirefm-reception-2000w.webp',
    heroImageAlt: 'EntireFM professional facilities management in modern healthcare and medical clinic setting',
    heroHighlightedTitle: 'Hygiene, Reliability & Statutory Compliance',
    heroFacts: [
      { label: 'Infection Control Standards', value: 'Clinical Grade Hygiene' },
      { label: 'Uninterrupted Critical Power', value: 'Standby UPS & Backup' },
      { label: 'Water Safety & Legionella', value: 'HTM Aligned Protocols' },
    ],
    snapshotLead: 'Rigorous facilities management and engineering support tailored for private hospitals, medical centres, dental practices, and outpatient clinical facilities.',
    snapshotPriorities: [
      { title: 'Strict Water Safety & Hygiene', subtitle: 'Temperature logs, microbiological sampling & TMV servicing', iconName: 'riskCompliance' },
      { title: 'Continuous Power Reliability', subtitle: 'UPS battery maintenance, standby generator tests & clean power circuits', iconName: 'powerElectrical' },
      { title: 'Air Exchange & HEPA Filtration', subtitle: 'Air handling units, positive pressure ventilation & filter validation', iconName: 'operationalExcellence' },
      { title: 'Audit-Proof Certification', subtitle: 'Digital compliance records satisfying CQC, HSE & insurer inspections', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'In healthcare, facilities management directly underpins patient safety.',
    challengesSubline: 'Clinical environments cannot tolerate power fluctuations, water contamination, or hygiene lapses. Here is how EntireFM ensures complete operational integrity:',
    challenges: [
      {
        title: 'Water System Contamination & Legionella Risk',
        problem: 'Stagnant pipework or temperature fluctuations create lethal bacterial growth in complex healthcare plumbing networks.',
        solution: 'Monthly calibrated temperature monitoring, thermostatic mixing valve (TMV) descaling and fail-safe testing, and accredited microbiological water sampling.',
        statutoryStandard: 'HTM 04-01 Water Safety & ACOP L8 Compliance',
      },
      {
        title: 'Critical Power Interruptions to Medical Equipment',
        problem: 'Mains power failure during medical procedures or cold-chain pharmaceutical storage risks patient lives and ruined supplies.',
        solution: 'Routine load-bank testing of standby generators, uninterruptible power supply (UPS) battery health checks, and dual-supply transfer switch maintenance.',
        statutoryStandard: 'HTM 06-01 Electrical Services Supply and Distribution',
      },
      {
        title: 'Air Quality, Filtration & Cross-Contamination',
        problem: 'Inadequate fresh air exchanges or clogged filters spread airborne pathogens across consultation rooms and waiting areas.',
        solution: 'Specialist AHU servicing, HEPA filtration replacements, ductwork inspection, and pressure cascade verification.',
        statutoryStandard: 'HTM 03-01 Specialised Ventilation in Healthcare Premises',
      },
      {
        title: 'CQC Compliance Inspection Readiness',
        problem: 'Scattered paper logbooks and unorganized certification trigger failed audits and regulatory enforcement from the CQC.',
        solution: 'EntireCAFM provides an instant digital audit trail for every asset, certificate, risk assessment, and PPM record.',
        statutoryStandard: 'Care Quality Commission (CQC) Fundamental Standards',
      },
    ],
    systemsHeadline: 'Specialist Healthcare Facilities Scopes',
    systemsSubline: 'Hard FM, building engineering, and compliance management tailored for clinical environments:',
    systemGroups: [
      {
        category: 'Water Hygiene & Safety (HTM 04-01)',
        headline: 'Total bacterial prevention and temperature governance',
        items: [
          'Monthly statutory water temperature monitoring & logbook entry',
          'Thermostatic Mixing Valve (TMV) inspection, descaling & failsafe testing',
          'Calorifier inspection, pasteurisation cycles & blowdown checks',
          'UKAS-accredited microbiological water sampling (Legionella, Pseudomonas)',
          'Dead-leg identification, cold water storage tank cleaning & chlorination',
        ],
      },
      {
        category: 'Specialist Ventilation & HVAC (HTM 03-01)',
        headline: 'Clean air distribution and infection control airflows',
        items: [
          'Air handling unit (AHU) periodic servicing & HEPA filter changes',
          'Consultation room air change rate verification & airflow balancing',
          'Medical extract ventilation and dirty utility exhaust fan checks',
          'VRV / VRF comfort cooling and heating maintenance with antibacterial wash',
          'F-Gas compliant refrigerant inspections and digital compliance records',
        ],
      },
      {
        category: 'Critical Electrical Infrastructure (HTM 06-01)',
        headline: 'Resilient electrical distribution and life safety power',
        items: [
          'Medical-grade UPS battery impedance testing & maintenance',
          'Standby diesel generator off-load and full load-bank testing',
          'Periodic fixed wire testing (EICR) across all clinical sub-boards',
          'Emergency lighting monthly testing and 3-hour annual discharge audits',
          'Automatic transfer switch (ATS) failover simulation testing',
        ],
      },
      {
        category: 'Physical Security, Fire & Clinical Fabric',
        headline: 'Safe patient environments and emergency protection',
        items: [
          'Fire alarm panel maintenance, weekly call point checks & sounder tests',
          'Fire door inspection, drop-seal integrity & smoke seal verification',
          'Access control keycard & intercom systems for secure clinical areas',
          'Disabled toilet emergency pull-cord alarms testing & logbook entry',
          'Specialist anti-microbial deep cleaning & clinical touchpoint sanitisation',
        ],
      },
    ],
    operatingModelHeadline: 'Clinical Estate Operating Framework',
    operatingModelSubline: 'Engineered specifically for healthcare reliability and CQC compliance readiness:',
    operatingSteps: [
      { step: '01', title: 'HTM-Aligned Asset Register', desc: 'Every TMV, calorifier, AHU, and UPS is catalogued with required HTM testing frequencies.' },
      { step: '02', title: 'Vetted, Background-Checked Technicians', desc: 'DBS-checked, uniformed engineers trained in clinical infection control protocols.' },
      { step: '03', title: 'Calibrated Digital Testing', desc: 'UKAS-calibrated digital thermometers and electrical analyzers logging raw data directly to CAFM.' },
      { step: '04', title: 'Emergency Response Prioritisation', desc: 'High-priority SLA dispatch for any fault impacting heating, hot water, or power.' },
      { step: '05', title: 'Instant CQC Audit Readiness', desc: 'One-click export of complete compliance registers for health inspectors and auditors.' },
    ],
    technologyFocus: {
      badge: 'CAFM & CQC AUDIT READY',
      title: 'Digital Compliance Vault for Healthcare Estate Managers',
      description: 'Total digital accountability over water hygiene, electrical safety, and fire compliance across single clinics or national healthcare estates.',
      features: [
        { title: 'Digital Water Temperature Logs', desc: 'Automated timestamped logging eliminating missing paper sheets.' },
        { title: 'TMV Fail-Safe Test Records', desc: 'Detailed individual valve records preventing scalding and non-compliance.' },
        { title: 'CQC Inspection Export', desc: 'Instant compile of all statutory certificates and PPM logs in seconds.' },
        { title: 'Real-Time SLA Triage', desc: 'Priority escalation for any fault affecting clinical operational areas.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'CQC Audit Compliance Ready', detail: 'Instant digital records for every statutory test and maintenance visit' },
      { figure: 'HTM 04-01', label: 'Water Hygiene Standard', detail: 'Strict preventative regimes eliminating waterborne bacterial risks' },
      { figure: 'DBS', label: 'Vetted Engineering Fleet', detail: 'Enhanced background checks for personnel in sensitive healthcare premises' },
    ],
    conversionCta: {
      headline: 'Need Clinical-Grade Facilities Management for Your Healthcare Site?',
      subheadline: 'Speak directly with EntireFM healthcare compliance specialists. We provide audit-proof maintenance, water hygiene, and critical plant care.',
      badgeText: 'HEALTHCARE CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'HTM Regimes' },
      { name: 'Plumbing & Water Hygiene', href: '/plumbing-gas', tag: 'Water Safety' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Plant' },
      { name: 'Commercial HVAC & Air Quality', href: '/hvac-contractor', tag: 'Air Quality' },
      { name: 'Specialist Clinical Cleaning', href: '/commercial-cleaning', tag: 'Hygiene' },
    ],
  },

  education: {
    id: 'education',
    name: 'Education, Schools, Colleges & Universities',
    heroBadge: 'EDUCATION & CAMPUS ESTATES',
    heroImage: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    heroImageAlt: 'EntireFM certified engineers performing statutory compliance testing in education facility',
    heroHighlightedTitle: 'Safeguarding, Statutory Safety & Term-Time Agility',
    heroFacts: [
      { label: 'Safeguarding & DBS Vetted', value: '100% Enhanced DBS' },
      { label: 'Term-Time Maintenance Windows', value: 'Holiday Overhauls' },
      { label: 'Heating & Water Safety', value: 'DfE Compliance' },
    ],
    snapshotLead: 'Comprehensive facilities management and estate engineering for primary and secondary schools, multi-academy trusts (MATs), colleges, and university campuses.',
    snapshotPriorities: [
      { title: 'Enhanced DBS Safeguarding', subtitle: 'All engineers and technicians fully vetted for educational environments', iconName: 'teamManagement' },
      { title: 'Holiday Overhaul Windows', subtitle: 'Concentrated heavy plant servicing scheduled during half-terms and summer break', iconName: 'operationalExcellence' },
      { title: 'Boiler & Heating Reliability', subtitle: 'Preventative servicing ensuring warm classrooms throughout the winter term', iconName: 'maintenanceTools' },
      { title: 'Statutory Safety & Asbestos Awareness', subtitle: 'Rigorous fire, electrical, water, and building fabric compliance', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Educational facilities must maintain rigorous statutory safety while safeguarding students.',
    challengesSubline: 'Schools and universities balance tight budgets with strict regulatory compliance and holiday-dependent access schedules. Here is how EntireFM delivers:',
    challenges: [
      {
        title: 'Winter Boiler Breakdown Causing Emergency School Closure',
        problem: 'A failed central heating boiler in winter drops classroom temperatures below legal minimums, forcing disruptive school closure.',
        solution: 'Summer holiday burner overhauls, pump descaling, pressurized expansion vessel testing, and 24/7 priority emergency response.',
        statutoryStandard: 'Education (School Premises) Regulations 2012 (Regulation 17 Heating)',
      },
      {
        title: 'Legionella Risk in Long School Summer Holidays',
        problem: 'Six weeks of stagnant water in dormant pipework and showers during summer creates severe bacterial growth before the September return.',
        solution: 'Structured holiday flushing regimes, pre-term disinfection, TMV servicing, and pre-term UKAS water sampling.',
        statutoryStandard: 'DfE Health and Safety Advice on Educational Visits & ACOP L8',
      },
      {
        title: 'Safeguarding Compliance & Contractor Supervision',
        problem: 'Unvetted contractors working on site during school hours create severe safeguarding and Ofsted compliance failures.',
        solution: '100% Enhanced DBS-checked, uniformed personnel with clear photo ID, strict sign-in protocols, and segregation from students.',
        statutoryStandard: 'DfE Keeping Children Safe in Education (KCSIE) Statutory Guidance',
      },
      {
        title: 'Multi-Academy Trust (MAT) Budget Transparency',
        problem: 'MAT estate managers struggle to compare maintenance expenditure and compliance percentages across multiple dispersed school sites.',
        solution: 'Centralized EntireCAFM portal providing trust-wide visibility over asset condition, spend per school, and compliance certificates.',
        statutoryStandard: 'Good Estates Management for Schools (GEMS) Guidance',
      },
    ],
    systemsHeadline: 'Education Facilities Management & Campus Scopes',
    systemsSubline: 'Complete Hard FM, statutory safety, and fabric maintenance structured for education estates:',
    systemGroups: [
      {
        category: 'Heating, Gas & Plantroom Engineering',
        headline: 'Reliable thermal comfort across classrooms and halls',
        items: [
          'Commercial gas boiler servicing & Gas Safe CP12 certification',
          'Pressurisation unit & circulation pump maintenance and balancing',
          'Radiator valve, fan convector & thermostat replacements',
          'Science lab gas safety solenoid valves & emergency shut-off testing',
          'Commercial kitchen gas interlock systems & extraction servicing',
        ],
      },
      {
        category: 'Water Hygiene & Legionella Control',
        headline: 'Safe drinking water and holiday flushing protocols',
        items: [
          'Monthly statutory water temperature monitoring across sentinel taps',
          'Pre-term shower descaling, disinfection & TMV failsafe testing',
          'Summer holiday stagnant line flushing regimes and digital records',
          'Water storage tank inspection, chlorination & UKAS sampling',
          'Legionella risk assessments & digital logbook archival',
        ],
      },
      {
        category: 'Electrical, Lighting & Life Safety',
        headline: 'Fixed wire safety and emergency lighting compliance',
        items: [
          'Periodic fixed wire testing (EICR) across all block distribution boards',
          'Emergency lighting monthly testing and statutory 3-hour discharge audits',
          'Fire alarm weekly bell testing, smoke detector checks & panel servicing',
          'Classroom LED lighting upgrades, external security & floodlight repairs',
          'Portable appliance testing (PAT) for school IT, workshops & classrooms',
        ],
      },
      {
        category: 'Campus Fabric, Grounds & Security',
        headline: 'Safe physical premises, playground security and winter care',
        items: [
          'Perimeter security fencing, automated vehicular & pedestrian gates',
          'Fire door inspections, self-closer adjustments & panic bar testing',
          'High-level gutter vacuuming, roof leak repairs & drain clearing',
          'Winter gritting, salt replenishment & snow clearance for access paths',
          'Sports hall, gym floor & classroom fabric maintenance',
        ],
      },
    ],
    operatingModelHeadline: 'Education Estate Operating Framework',
    operatingModelSubline: 'Tailored for term dates, safeguarding rigor, and MAT estate efficiency:',
    operatingSteps: [
      { step: '01', title: 'Enhanced DBS Verified Staff', desc: 'Every technician is fully vetted, badged, and trained in KCSIE safeguarding protocols.' },
      { step: '02', title: 'Holiday Maintenance Windows', desc: 'Noisy, invasive engineering works scheduled strictly during half-term and summer holidays.' },
      { step: '03', title: 'School-By-School Digital Register', desc: 'Every boiler, fire panel, and TMV barcoded for complete asset history.' },
      { step: '04', title: '24/7 Rapid Emergency Cover', desc: 'Fast response for burst pipes, power cuts, or heating failures to prevent school closures.' },
      { step: '05', title: 'MAT Trust-Wide Governance', desc: 'Consolidated reporting for Trust CFOs and Estate Directors across all schools.' },
    ],
    technologyFocus: {
      badge: 'CAFM & EDUCATION ESTATES',
      title: 'Trust-Wide CAFM Portal Aligned with DfE GEMS Guidance',
      description: 'Single-dashboard management giving Headteachers and MAT Estate Directors live oversight of compliance, repairs, and capital replacement schedules.',
      features: [
        { title: 'Trust Estate Dashboard', desc: 'Track compliance status across every individual school in your academy trust.' },
        { title: 'Statutory Certificate Archival', desc: 'Instant access to Gas Safety, EICRs, and water logs for Ofsted and HSE visits.' },
        { title: 'Forward Capital Planning', desc: 'Condition grading identifying aging boilers before they fail in winter.' },
        { title: 'Fast Ticket Logging', desc: 'Site managers report defects on mobile in under 30 seconds.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'Enhanced DBS Checked Staff', detail: 'Complete safeguarding peace of mind across all school environments' },
      { figure: 'DfE GEMS', label: 'Estate Management Framework', detail: 'Practices aligned with Department for Education standards' },
      { figure: 'Holiday', label: 'Major Plant Overhauls', detail: 'Intensive engineering scheduled during student breaks' },
    ],
    conversionCta: {
      headline: 'Managing a School, College or Multi-Academy Trust Estate?',
      subheadline: 'Speak with EntireFM education specialists. We provide DBS-vetted engineering, holiday maintenance overhauls, and robust statutory compliance.',
      badgeText: 'EDUCATION CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'School Regimes' },
      { name: 'Plumbing, Boilers & Heating', href: '/plumbing-gas', tag: 'Heating Care' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Safety' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Campus Fabric' },
      { name: 'Commercial HVAC & Air Quality', href: '/hvac-contractor', tag: 'Classroom Air' },
    ],
  },

  hospitality: {
    id: 'hospitality',
    name: 'Hotels, Hospitality & Restaurants',
    heroBadge: 'HOTELS, RESORTS & HOSPITALITY',
    heroImage: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp',
    heroImageAlt: 'EntireFM premium facilities management in luxury hotel and hospitality guest environment',
    heroHighlightedTitle: '24/7 Guest Comfort & Discreet Maintenance',
    heroFacts: [
      { label: 'Unobtrusive Delivery', value: 'Discreet Staff' },
      { label: 'Continuous Hot Water & HVAC', value: '100% Guest Comfort' },
      { label: 'Kitchen Extract & Fire Safety', value: 'TR19 Certified' },
    ],
    snapshotLead: 'Discreet, high-standard facilities management for boutique and luxury hotels, resort destinations, restaurants, and premium hospitality venues.',
    snapshotPriorities: [
      { title: 'Continuous Hot Water & Heating', subtitle: 'Redundant calorifiers, booster sets & commercial boiler resilience', iconName: 'maintenanceTools' },
      { title: 'Guest Room HVAC & Acoustics', subtitle: 'Silent VRV/VRF air conditioning, acoustic baffling & rapid filter cleaning', iconName: 'operationalExcellence' },
      { title: 'Commercial Kitchen Compliance', subtitle: 'Gas interlocks, TR19 ductwork degreasing & grease trap maintenance', iconName: 'riskCompliance' },
      { title: 'Discreet 24/7 Rapid Response', subtitle: 'Quiet out-of-sight engineer attendance that protects the guest experience', iconName: 'twentyFourSevenOps' },
    ],
    challengesHeadline: 'In hospitality, a cold shower or noisy AC unit results in instant refund demands and bad reviews.',
    challengesSubline: 'Guests expect seamless luxury and immediate comfort. EntireFM provides round-the-clock engineering that operates silently behind the scenes:',
    challenges: [
      {
        title: 'Morning Hot Water Pressure Drop in Full Occupancy',
        problem: 'Simultaneous morning peak demand across hundreds of guest bathrooms causes pressure collapse and temperature fluctuations.',
        solution: 'Duplex booster set sequencing, accumulator pre-charge checks, calorifier descaling, and secondary return balancing ensure uninterrupted hot water flow.',
        statutoryStandard: 'CIBSE Guide G: Public Health Engineering & Water Services',
      },
      {
        title: 'Commercial Kitchen Canopy Fire Hazards (TR19)',
        problem: 'Grease accumulation in extraction ductwork creates catastrophic fire risks and invalidates building insurance.',
        solution: 'Certified TR19 kitchen extract ductwork cleaning, canopy degreasing, ESP filter maintenance, and digital BESA certification.',
        statutoryStandard: 'BESA TR19 Specification for Internal Cleanliness of Ventilation Systems',
      },
      {
        title: 'Disruptive Daytime Maintenance in Guest Corridors',
        problem: 'Toolboxes, drilling, or ladder work in public lobbies and corridors destroys the premium guest atmosphere.',
        solution: 'Strict quiet-hours access protocol: all public area maintenance completed early morning or late night with immaculate housekeeping cleanup.',
        statutoryStandard: 'Hospitality Brand Standards & Quiet Hours Governance',
      },
    ],
    systemsHeadline: 'Hospitality Facilities Systems & Engineering',
    systemsSubline: 'Comprehensive maintenance covering guest suites, public lobbies, commercial kitchens, and central plantrooms:',
    systemGroups: [
      {
        category: 'Guest Room Climate & Acoustic Care',
        headline: 'Silent, individual temperature control across all suites',
        items: [
          'VRV / VRF air conditioning quarterly servicing and quiet mode calibration',
          'Fan coil unit (FCU) filter wash, antibacterial treatment & bearing care',
          'Silent condensate drain pump maintenance and anti-vibration checks',
          'Individual room thermostat and smart room sensor recalibration',
          'Bathroom extract ventilation fan servicing and acoustic baffling',
        ],
      },
      {
        category: 'Central Hot Water & Boiler Plant',
        headline: 'High-capacity domestic hot water generation and pressure',
        items: [
          'Commercial gas boiler servicing & Gas Safe CP12 certification',
          'Calorifier inspection, thermal pasteurisation & scale removal',
          'Cold water booster sets and variable speed pump maintenance',
          'Thermostatic Mixing Valve (TMV) statutory failsafe audits',
          'Water hygiene temperature monitoring & Legionella management',
        ],
      },
      {
        category: 'Commercial Kitchen & Extraction Compliance',
        headline: 'Fire safety and statutory catering ventilation',
        items: [
          'TR19 certified kitchen extract ductwork & canopy degreasing',
          'Gas interlocking solenoid safety valves & emergency cut-off tests',
          'Grease trap dosing, mechanical maintenance & waste compliance',
          'Catering refrigeration cold room & freezer compressor servicing',
          'Kitchen fire suppression system (Ansul/R-102) periodic checks',
        ],
      },
      {
        category: 'Public Realm, Lighting & Life Safety',
        headline: 'Lobby elegance, mood lighting and guest safety',
        items: [
          'Architectural mood lighting scene controllers & DALI maintenance',
          'Periodic fixed wire testing (EICR) across all floor panels',
          'Emergency lighting monthly flick tests & 3-hour annual audits',
          'Fire alarm panel maintenance with silent visual testing during guest stay',
          'Passenger lift emergency phone line testing & LOLER audits',
        ],
      },
    ],
    operatingModelHeadline: 'Hospitality Estate Operating Framework',
    operatingModelSubline: 'Engineered specifically to protect guest satisfaction ratings and brand prestige:',
    operatingSteps: [
      { step: '01', title: 'Discreet Front-of-House Presentation', desc: 'Smartly presented, background-checked engineers who respect guest privacy and quiet hours.' },
      { step: '02', title: 'Proactive Redundant Plant Checks', desc: 'Boilers and pumps tested under simulated peak load to prevent morning water drop.' },
      { step: '03', title: 'Rapid Silent Room Triage', desc: 'Technicians resolve AC or plumbing defects between 11:00 checkout and 15:00 check-in.' },
      { step: '04', title: 'TR19 Certified Kitchen Compliance', desc: 'BESA-certified canopy and duct cleaning keeping hotel insurance valid.' },
      { step: '05', title: 'Consolidated Executive Portal', desc: 'General managers view live repair statuses and compliance certs across all venues.' },
    ],
    technologyFocus: {
      badge: 'CAFM & HOSPITALITY OPS',
      title: 'Digital Facilities Portal for Hotel General Managers & Head Chefs',
      description: 'Instant mobile defect reporting and automated compliance tracking that keeps your hotel audit-ready and guest reviews high.',
      features: [
        { title: 'Rapid Turnaround Ticket Triage', desc: 'Log room defects for urgent rectification before incoming guests check in.' },
        { title: 'TR19 Certificate Vault', desc: 'Instant proof of kitchen extract cleaning for insurers and fire officers.' },
        { title: 'Preventative Plant Alarms', desc: 'Temperature warnings before hot water cylinders drop below comfort setpoints.' },
        { title: 'Multi-Venue Management', desc: 'Consolidated reporting for hotel groups and restaurant chains.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'TR19 Kitchen Compliance', detail: 'BESA-certified extraction cleaning ensuring building insurance validity' },
      { figure: '24/7', label: 'Emergency Guest Room Support', detail: 'Rapid response for HVAC, plumbing, or power issues in guest suites' },
      { figure: 'Silent', label: 'Quiet-Hours Maintenance', detail: 'Zero noisy works scheduled during guest sleeping hours' },
    ],
    conversionCta: {
      headline: 'Managing a Hotel, Resort, or Multi-Site Restaurant Group?',
      subheadline: 'Speak with EntireFM hospitality specialists. We deliver discreet, high-standard building maintenance that protects guest satisfaction and plant resilience.',
      badgeText: 'HOSPITALITY CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', tag: 'Guest Climate' },
      { name: 'Commercial Boilers & Hot Water', href: '/plumbing-gas', tag: 'Water Plant' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Asset Care' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Hotel Fabric' },
      { name: 'Commercial Contract Cleaning', href: '/commercial-cleaning', tag: 'Presentation' },
    ],
  },

  'venues-leisure': {
    id: 'venues-leisure',
    name: 'Arenas, Stadiums, Sports & Leisure Venues',
    heroBadge: 'STADIUMS, ARENAS & LEISURE VENUES',
    heroImage: '/images/editorial/entirefm-rooftop-plant-night-2000w.webp',
    heroImageAlt: 'EntireFM technical facilities management across large-scale commercial sports and entertainment venue',
    heroHighlightedTitle: 'High-Capacity Crowds & Event Readiness',
    heroFacts: [
      { label: 'Event Surge Capacity', value: 'High-Footfall Resilience' },
      { label: 'Mass-Scale Life Safety', value: 'Public Safety Compliance' },
      { label: 'Rapid Turnaround Cleaning', value: 'Post-Event Restorations' },
    ],
    snapshotLead: 'High-capacity facilities management and building engineering for entertainment arenas, sports stadiums, major exhibition venues, and public leisure centres.',
    snapshotPriorities: [
      { title: 'Event-Day Plant Standby', subtitle: 'Power redundancy, standby generator checks & on-site technical support', iconName: 'twentyFourSevenOps' },
      { title: 'High-Volume Public Washrooms', subtitle: 'Heavy-duty drainage, high-capacity flushing & continuous hygiene care', iconName: 'commercialCleaning' },
      { title: 'Mass Evacuation & Life Safety', subtitle: 'Public address voice alarms (PA/VA), emergency lighting & turnstiles', iconName: 'riskCompliance' },
      { title: 'Rapid Post-Event Turnaround', subtitle: 'Large-scale waste extraction, seating area cleaning & deep disinfection', iconName: 'operationalExcellence' },
    ],
    challengesHeadline: 'Stadium and arena facilities operate under intense event-day public scrutiny and safety licensing.',
    challengesSubline: 'When 20,000+ visitors enter a venue, every turnstile, toilet, and lighting array must operate flawlessly. Here is how EntireFM ensures event success:',
    challenges: [
      {
        title: 'Sudden High-Volume Surge on Washroom Plumbing',
        problem: 'Intermission or half-time surges overwhelm drainage lines, causing blockages, flooding, and severe health hazards.',
        solution: 'Pre-event preventative drain jetting, booster pump pressure checks, and dedicated plumbing rapid response during live events.',
        statutoryStandard: 'Green Guide (Guide to Safety at Sports Grounds) & Building Regs',
      },
      {
        title: 'Emergency Lighting & Mass Evacuation Compliance',
        problem: 'A power cut in a crowded dark arena creates severe crush risk if emergency lighting or PA/VA systems fail.',
        solution: 'Mandatory 3-hour battery discharge testing, generator automatic transfer testing, and central battery system load verification.',
        statutoryStandard: 'BS 5266-1 & Local Authority Safety Advisory Group (SAG) Licencing',
      },
      {
        title: 'Turnstile, Barrier & Access Ingress Failures',
        problem: 'Jammed turnstiles or malfunctioning ticketing gates create hazardous crowd bottlenecks at venue entrance gates.',
        solution: 'Pre-event turnstile mechanism servicing, optical sensor cleaning, and manual override fail-safe checks.',
        statutoryStandard: 'Sports Grounds Safety Authority (SGSA) Ingress Standards',
      },
      {
        title: 'Tight Turnaround Between Back-to-Back Events',
        problem: 'Concert on Friday night, sports match on Saturday afternoon leaves only hours to clean, repair, and re-commission the venue.',
        solution: 'Mobilised rapid-turnaround cleaning and maintenance crews deployed immediately upon crowd egress for overnight restoration.',
        statutoryStandard: 'Venue Turnaround Operational Governance',
      },
    ],
    systemsHeadline: 'Venues, Stadiums & Leisure Facilities Scopes',
    systemsSubline: 'Heavy-duty building services, mass life safety, and event support engineering:',
    systemGroups: [
      {
        category: 'High-Capacity Power & Emergency Backup',
        headline: 'Massive electrical distribution and uninterrupted power',
        items: [
          'High-voltage (HV) transformer and main LV switchboard servicing',
          'Standby diesel generator full load-bank tests & ATS failover checks',
          '3-hour statutory emergency lighting audits & central battery banks',
          'Floodlighting arrays, arena sports lighting & DMX controller care',
          'Periodic fixed wire testing (EICR) across all concourse distribution boards',
        ],
      },
      {
        category: 'High-Volume Washrooms & Water Services',
        headline: 'Surge plumbing resilience and water safety',
        items: [
          'Concourse washroom multiple-urinal & high-capacity toilet PPM',
          'Pre-event drain line clearance, grease interceptors & pump pits',
          'Thermostatic Mixing Valve (TMV) servicing in changing rooms & showers',
          'Water hygiene temperature logs & Legionella risk assessments',
          'Swimming pool, spa & hydrotherapy plant mechanical servicing',
        ],
      },
      {
        category: 'Life Safety, Access & Crowd Protection',
        headline: 'Safety Advisory Group (SAG) compliance and entrance gates',
        items: [
          'Automated turnstile mechanisms, optical sensors & emergency drop gates',
          'Public Address / Voice Alarm (PA/VA) audio intelligibility checks',
          'Fire alarm multi-zone panel servicing & visual beacon verification',
          'Fire door drop-seals, panic bars & crowd barrier structural integrity',
          'Smoke extraction fans, natural roof louvres & SHEVS testing',
        ],
      },
      {
        category: 'Public Concourse, Seating & Post-Event Care',
        headline: 'Rapid venue restoration between matchdays and concerts',
        items: [
          'Rapid overnight post-event litter extraction & concourse pressure washing',
          'Tiered bowl seating pressure washing, gum removal & repair',
          'Executive corporate box cleaning, HVAC filter care & glass polishing',
          'Car park sweeping, high-level canopy care & perimeter maintenance',
          'Waste compaction, segregating recycling streams & skip logistics',
        ],
      },
    ],
    operatingModelHeadline: 'Venues & Stadiums Operating Framework',
    operatingModelSubline: 'Engineered specifically for event cycles, Safety Advisory Groups (SAG), and crowd safety:',
    operatingSteps: [
      { step: '01', title: 'Pre-Event Technical Sign-Off', desc: 'Comprehensive multi-point inspection of generators, turnstiles, and life safety prior to doors opening.' },
      { step: '02', title: 'Event-Day Standby Engineers', desc: 'On-site technical engineers stationed in control rooms to resolve any live plant faults immediately.' },
      { step: '03', title: 'Overnight Rapid Turnaround', desc: 'High-capacity cleaning and repair teams mobilized post-event to prepare for the next fixture.' },
      { step: '04', title: 'SAG & Licencing Audit Trail', desc: 'Digital compliance logs immediately exportable for Local Authority and police licensing reviews.' },
      { step: '05', title: 'Post-Season Asset Overhauls', desc: 'Major plant overhauls, high-level lighting repairs, and deep fabric maintenance in off-season.' },
    ],
    technologyFocus: {
      badge: 'CAFM & EVENT SAFETY',
      title: 'Digital Safety & Compliance System for Stadium Operations Directors',
      description: 'Real-time visibility of pre-event safety sign-offs, live defect tickets, and statutory inspection certificates.',
      features: [
        { title: 'Pre-Event Checklist App', desc: 'Digital verification of every safety check required prior to venue licensing sign-off.' },
        { title: 'Live Control Room Dispatch', desc: 'Direct radio-linked ticketing for on-site engineers during live matchdays.' },
        { title: 'SAG Audit Compliance Pack', desc: 'Instant export of emergency lighting, fire alarm, and structural checks.' },
        { title: 'Turnaround Progress Tracking', desc: 'Real-time status of bowl cleaning and seat inspections between fixtures.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'Event-Day Ready Sign-Off', detail: 'Zero venue licensing delays or missed fixture deadlines' },
      { figure: 'Green Guide', label: 'Safety Ground Compliance', detail: 'Standards aligned with sports ground safety authority guidance' },
      { figure: 'Overnight', label: 'Rapid Turnaround Model', detail: 'Complete venue reset between back-to-back stadium events' },
    ],
    conversionCta: {
      headline: 'Operating a Stadium, Arena or High-Capacity Leisure Venue?',
      subheadline: 'Contact EntireFM sports and venues specialists. We provide robust engineering, event-day technical standby, and rapid post-event restorations.',
      badgeText: 'VENUES & ARENAS CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Heavy Power' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Venue Fabric' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Asset Care' },
      { name: 'Specialist Contract Cleaning', href: '/commercial-cleaning', tag: 'Rapid Turnaround' },
      { name: 'Commercial HVAC & Air Movement', href: '/hvac-contractor', tag: 'Large Spaces' },
    ],
  },

  'residential-prs': {
    id: 'residential-prs',
    name: 'Residential Property, Block Management & PRS',
    heroBadge: 'RESIDENTIAL BLOCKS & PRS ESTATES',
    heroImage: '/images/locations/manchester/facilities-management-manchester-castlefield-viaduct-1600w.webp',
    heroImageAlt: 'EntireFM residential facilities management across modern multi-occupancy residential development',
    heroHighlightedTitle: 'Building Safety Act Compliance & Resident Wellbeing',
    heroFacts: [
      { label: 'Building Safety Act 2022', value: 'Golden Thread Ready' },
      { label: 'Communal Plant & Heating', value: '24/7 Resident Comfort' },
      { label: 'Access Control & Security', value: 'Secure Premises' },
    ],
    snapshotLead: 'Specialist facilities management for residential block managing agents, private rented sector (PRS) operators, build-to-rent (BTR) developments, and housing associations.',
    snapshotPriorities: [
      { title: 'Building Safety Act Governance', subtitle: 'Fire door inspections, smoke ventilation & digital compliance golden thread', iconName: 'riskCompliance' },
      { title: 'Communal Heating & Plant', subtitle: 'Central energy centres, HIU servicing, booster pumps & gas CP12s', iconName: 'maintenanceTools' },
      { title: 'Access Control & Gates', subtitle: 'Intercoms, fob systems, automated car park gates & CCTV security', iconName: 'securityCctv' },
      { title: 'Clean Communal Presentation', subtitle: 'Lobbies, stairwells, bin stores, window cleaning & grounds care', iconName: 'commercialCleaning' },
    ],
    challengesHeadline: 'Residential block management requires strict safety compliance and resident sensitivity.',
    challengesSubline: 'Managing homes means dealing directly with resident expectations, service charge scrutiny, and new Building Safety Act obligations. Here is how EntireFM delivers:',
    challenges: [
      {
        title: 'Building Safety Act 2022 & Fire Door Regulations',
        problem: 'Strict quarterly communal fire door checks and annual flat entrance door checks create massive administrative and inspection burdens.',
        solution: 'Digital QR-barcoded fire door inspection programs logging gap measurements, intumescent seals, and self-closing devices directly to the resident portal.',
        statutoryStandard: 'Fire Safety (England) Regulations 2022 & Building Safety Act',
      },
      {
        title: 'Communal Heating Breakdown Leaving Residents Cold',
        problem: 'Central boiler plant or heat network pump failure deprives hundreds of flats of heating and hot water, sparking resident revolt.',
        solution: 'Proactive seasonal servicing of central boilers, heat interface units (HIUs), pressurisation sets, and 24/7 emergency response.',
        statutoryStandard: 'Heat Network (Metering and Billing) Regulations & Gas Safety',
      },
      {
        title: 'Bin Store Overflow, Vermin & Refuse Chute Blockages',
        problem: 'Neglected bin rooms cause foul odours, vermin infestation, and severe resident complaints in multi-storey blocks.',
        solution: 'Scheduled bin room jet-washing, chute unblocking, specialist sanitisation, and pest control management programs.',
        statutoryStandard: 'Environmental Protection Act 1990 Section 34 Duty of Care',
      },
      {
        title: 'Service Charge Transparency for Leaseholders',
        problem: 'Leaseholders challenge vague maintenance invoices, leading to non-payment and disputes at First-tier Tribunal.',
        solution: 'Itemised digital work order evidence packs showing exact date, timestamp, engineer notes, and photos for every repair.',
        statutoryStandard: 'Section 20 Landlord and Tenant Act 1985 & RICS Residential Code',
      },
    ],
    systemsHeadline: 'Residential Block & PRS Facilities Scopes',
    systemsSubline: 'Comprehensive communal Hard & Soft FM services structured for property managers and residents:',
    systemGroups: [
      {
        category: 'Communal Energy, Heating & Water',
        headline: 'Central plantroom reliability and hot water distribution',
        items: [
          'Central commercial boiler plant servicing & Gas Safe CP12 certification',
          'Cold water booster sets, expansion vessel checks & pump overhauls',
          'Communal water hygiene temperature monitoring & Legionella audits',
          'Thermostatic Mixing Valve (TMV) testing in communal shower/toilet areas',
          'Heat Interface Unit (HIU) annual servicing and strainer cleaning',
        ],
      },
      {
        category: 'Building Safety, Fire & Ventilation',
        headline: 'Statutory compliance aligned with Building Safety Regulator',
        items: [
          'Communal fire door quarterly inspections & flat entrance door audits',
          'Automatic Opening Vents (AOVs) & smoke control damper servicing',
          'Fire alarm panel testing, sounder verification & dry riser visual checks',
          'Emergency lighting monthly testing and statutory 3-hour discharge audits',
          'Lightning protection system annual visual inspection and testing',
        ],
      },
      {
        category: 'Access Control, Security & Lifts',
        headline: 'Resident security, automated gates and vertical transport',
        items: [
          'Video entry intercom systems, proximity fob readers & maglock care',
          'Automated vehicle gates, rising barriers & roller shutter servicing',
          'CCTV security camera system maintenance and recording checks',
          'Passenger lift LOLER statutory examinations & emergency call line tests',
          'Car park ventilation and carbon monoxide (CO) sensor calibration',
        ],
      },
      {
        category: 'Communal Cleaning & Grounds Estate Care',
        headline: 'Spotless common areas, grounds, and refuse hygiene',
        items: [
          'Stairwell, entrance lobby, corridor cleaning & carpet extraction',
          'Bin store deep jet-washing, sanitisation & chute maintenance',
          'Grounds maintenance, lawn mowing, hedge trimming & weed control',
          'Window cleaning across communal entrances and high-level glazing',
          'Winter gritting, salt bin replenishment & emergency snow clearing',
        ],
      },
    ],
    operatingModelHeadline: 'Residential Estate Operating Framework',
    operatingModelSubline: 'Engineered specifically for leaseholder satisfaction and block management transparency:',
    operatingSteps: [
      { step: '01', title: 'Digital Building Safety Asset Registry', desc: 'Every fire door, AOV, booster pump, and lift is catalogued for the Golden Thread.' },
      { step: '02', title: 'Uniformed, Resident-Friendly Staff', desc: 'Professional, courteous engineers respectful of private residential environments.' },
      { step: '03', title: 'Property Manager CAFM Portal', desc: 'Managing agents view live repair progress and compliance status across their entire portfolio.' },
      { step: '04', title: '24/7 Out-of-Hours Emergency Line', desc: 'Dedicated out-of-hours coverage for major communal leaks, lift entrapments, and power cuts.' },
      { step: '05', title: 'Transparent Service Charge Packs', desc: 'Itemised proof packs making year-end service charge accounts simple and defensible.' },
    ],
    technologyFocus: {
      badge: 'CAFM & BUILDING SAFETY ACT',
      title: 'Digital Golden Thread Portal for Residential Block Managers',
      description: 'Complete digital safety records ensuring your residential developments comply with the Building Safety Act and Fire Safety Regulations.',
      features: [
        { title: 'Digital Fire Door Register', desc: 'Individual barcode history for every flat entrance and communal fire door.' },
        { title: 'Live Resident Notice Archival', desc: 'Instant access to statutory compliance records for leaseholder queries.' },
        { title: 'Defect Photography Proof', desc: 'Before-and-after photographs attached to every completed maintenance ticket.' },
        { title: 'Portfolio Compliance Radar', desc: 'Track compliance percentages across all managed blocks from one screen.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'Fire Safety Act Compliance', detail: 'Structured quarterly checks on communal doors and AOVs' },
      { figure: '24/7/365', label: 'Communal Emergency Desk', detail: 'Rapid response for major residential leaks, power outages, and boiler trips' },
      { figure: 'Golden Thread', label: 'Building Safety Act Ready', detail: 'Complete digital asset history protecting property managers' },
    ],
    conversionCta: {
      headline: 'Managing a Residential Block, PRS Portfolio, or BTR Scheme?',
      subheadline: 'Speak with EntireFM residential block management specialists. We provide audit-proof compliance, reliable communal plant care, and spotless presentation.',
      badgeText: 'RESIDENTIAL CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Block Fabric' },
      { name: 'Plumbing & Communal Heating', href: '/plumbing-gas', tag: 'Energy Centres' },
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'Safety Schedules' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'Power & Lights' },
      { name: 'Commercial Contract Cleaning', href: '/commercial-cleaning', tag: 'Communal Areas' },
    ],
  },

  'corporate-managing-agents': {
    id: 'corporate-managing-agents',
    name: 'Managing Agents, Property Managers & Tier-1 Estates',
    heroBadge: 'MANAGING AGENTS & TIER-1 ESTATES',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    heroImageAlt: 'EntireFM executive facilities management meeting with commercial managing agents and property directors',
    heroHighlightedTitle: 'Multi-Site Governance & Single-Source Accountability',
    heroFacts: [
      { label: 'Single Contractor Model', value: 'Hard & Soft FM' },
      { label: 'RICS Compliant Reporting', value: 'Service Charge Ready' },
      { label: 'Tier-1 Safety Standards', value: 'SafeContractor / ISO' },
    ],
    snapshotLead: 'Strategic facilities management partnership for commercial managing agents, chartered surveyors, Tier-1 contractors, and regional property management portfolios.',
    snapshotPriorities: [
      { title: 'Single-Source Accountability', subtitle: 'Consolidated Hard & Soft FM eliminating fragmented contractor markups', iconName: 'integratedServices' },
      { title: 'RICS Service Charge Audit', subtitle: 'Indisputable work order evidence packs and transparent cost codes', iconName: 'proposalReporting' },
      { title: 'National Mobile Engineering', subtitle: 'Directly employed certified technicians providing consistent UK coverage', iconName: 'nationwideCoverage' },
      { title: 'Robust Statutory Governance', subtitle: 'Real-time digital compliance monitoring across all managed assets', iconName: 'complianceAudit' },
    ],
    challengesHeadline: 'Managing agents need a single trusted FM partner, not 20 uncoordinated trade contractors.',
    challengesSubline: 'Property managers are squeezed between demanding landlords, vocal tenants, and strict compliance liabilities. Here is how EntireFM streamlines estate operations:',
    challenges: [
      {
        title: 'Fragmented Subcontractor Management & High Invoicing Overhead',
        problem: 'Juggling separate HVAC, electrical, plumbing, cleaning, and fire contractors creates massive administrative friction and finger-pointing.',
        solution: 'One integrated contract with EntireFM self-delivering Hard & Soft FM with a dedicated Technical Account Manager and single monthly bill.',
        statutoryStandard: 'Single-Source Commercial Governance',
      },
      {
        title: 'Missing Statutory Compliance Certificates Across the Portfolio',
        problem: 'Incomplete EICRs, missed CP12s, or lost water hygiene logs create severe personal liability for property managers during audits.',
        solution: 'EntireCAFM tracks statutory deadlines across your entire portfolio and automatically schedules tests before certificates expire.',
        statutoryStandard: 'Health and Safety at Work etc. Act 1974 & RICS Professional Standards',
      },
      {
        title: 'Tenant Service Charge Challenges at Year-End',
        problem: 'Commercial tenants refuse to pay service charges due to vague contractor descriptions and lack of repair proof.',
        solution: 'Every EntireFM job includes photographic before/after proof, time logs, and clear asset identification coded to the correct service charge schedule.',
        statutoryStandard: 'RICS Service Charges in Commercial Property Professional Statement',
      },
      {
        title: 'Slow Reactive Contractor Response & Frustrated Tenants',
        problem: 'Local contractors taking days to attend basic plumbing leaks or air conditioning faults damages landlord-tenant relationships.',
        solution: 'Contracted response SLAs backed by a 24/7 central operations desk and tracked mobile engineering fleet.',
        statutoryStandard: 'Contracted Performance Service Level Agreements (SLAs)',
      },
    ],
    systemsHeadline: 'Managing Agent & Commercial Portfolio Scopes',
    systemsSubline: 'Total estate Hard & Soft FM maintenance across multi-tenant commercial properties:',
    systemGroups: [
      {
        category: 'Hard FM & Building Engineering',
        headline: 'Comprehensive plantroom and mechanical electrical care',
        items: [
          'Mechanical & electrical engineering maintenance (HVAC, power, gas)',
          'Commercial HVAC servicing, chiller maintenance & F-Gas logging',
          'Periodic fixed wire testing (EICR) & thermal imaging surveys',
          'Commercial gas boiler servicing & Gas Safe CP12 certification',
          'Emergency lighting monthly testing and 3-hour annual discharge audits',
        ],
      },
      {
        category: 'Statutory Safety & Compliance Auditing',
        headline: 'Total statutory governance and risk management',
        items: [
          'Water hygiene monitoring, Legionella risk assessments & TMV testing',
          'Fire alarm panel testing, smoke vents (AOVs) & fire door inspections',
          'Asbestos re-inspections & digital hazardous register maintenance',
          'Passenger lift LOLER compliance examinations and emergency phone tests',
          'Lightning protection testing and fall-arrest roof safety line recertification',
        ],
      },
      {
        category: 'Soft FM & Workplace Services',
        headline: 'Consistent presentation across all commercial common parts',
        items: [
          'Contract commercial cleaning across communal lobbies, stairs & toilets',
          'Daytime janitorial attendance, washroom restocking & hygiene care',
          'High-level window cleaning, cladding washing & gutter clearance',
          'Grounds maintenance, landscaping, litter picking & exterior care',
          'Winter gritting services with automated weather-forecast triggers',
        ],
      },
      {
        category: 'Fabric Maintenance & Capital Projects',
        headline: 'Preserving physical asset integrity and tenant improvements',
        items: [
          'Roof leak repairs, membrane patch repairs & drainage unclogging',
          'Commercial locksmithing, automatic door repairs & security shutters',
          'Drylining, ceiling tile replacements, painting & dilapidations work',
          'Car park resurfacing, pothole repairs, line marking & bollard fixes',
          'Condition surveys & forward capital expenditure (CapEx) 5-year plans',
        ],
      },
    ],
    operatingModelHeadline: 'Managing Agent Partnership Operating Model',
    operatingModelSubline: 'Designed specifically to free property managers from day-to-day maintenance chaos:',
    operatingSteps: [
      { step: '01', title: 'Portfolio Mobilisation & Asset Audit', desc: 'We survey every property, barcode all plant assets, and establish an SFG20 baseline schedule.' },
      { step: '02', title: 'Dedicated Technical Account Manager', desc: 'One senior FM director assigned to your portfolio managing all communication and SLAs.' },
      { step: '03', title: 'Live Client Portal & Automated Alerts', desc: 'Property managers and surveyors view live compliance traffic lights across all sites.' },
      { step: '04', title: 'Pre-Approved Delegated Authority Limits', desc: 'Urgent repairs below agreed spend thresholds are resolved instantly without delay.' },
      { step: '05', title: 'Consolidated RICS Invoicing', desc: 'Itemised, audit-ready monthly billing mapped directly to your property accounting codes.' },
    ],
    technologyFocus: {
      badge: 'CAFM & PORTFOLIO GOVERNANCE',
      title: 'Enterprise CAFM Dashboard for Managing Agents & Property Directors',
      description: 'Single-pane-of-glass oversight across your entire managed property portfolio with instant compliance status, live work orders, and financial tracking.',
      features: [
        { title: 'Portfolio Compliance Radar', desc: 'Real-time traffic-light status of statutory certificates across every building.' },
        { title: 'Service Charge Reconciliation', desc: 'Exportable digital work order proof packs eliminating leaseholder disputes.' },
        { title: 'Tenant Ticket Management', desc: 'Tenants log issues directly, reducing property manager email overload.' },
        { title: 'CapEx Lifecycle Planning', desc: 'Asset condition grading predicting major replacement costs 1–5 years ahead.' },
      ],
    },
    metrics: [
      { figure: '100%', label: 'Portfolio Compliance Visibility', detail: 'Real-time dashboard tracking all statutory deadlines across your estate' },
      { figure: '1 Partner', label: 'Consolidated Hard & Soft FM', detail: 'Single point of contact replacing fragmented trade contractors' },
      { figure: 'RICS', label: 'Service Charge Aligned Billing', detail: 'Transparent cost coding and photographic job completion evidence' },
    ],
    conversionCta: {
      headline: 'Managing a Commercial Property Portfolio or Tier-1 Estate?',
      subheadline: 'Talk to EntireFM about a strategic facilities management partnership. We deliver single-source accountability, robust compliance, and seamless reporting.',
      badgeText: 'MANAGING AGENT CONSULTATION',
    },
    relatedServiceSlugs: [
      { name: 'Planned Preventative Maintenance (PPM)', href: '/ppm', tag: 'SFG20 Care' },
      { name: 'Commercial Building Maintenance', href: '/building-maintenance', tag: 'Hard FM' },
      { name: 'Mechanical & Electrical Engineering', href: '/mechanical-electrical', tag: 'M&E' },
      { name: 'Commercial Contract Cleaning', href: '/commercial-cleaning', tag: 'Soft Services' },
      { name: 'Commercial HVAC & Air Conditioning', href: '/hvac-contractor', tag: 'Climate' },
    ],
  },

  'construction-handover': {
    id: 'construction-handover',
    name: 'Construction Handover, Post-Completion & Fit-Out',
    heroBadge: 'CONSTRUCTION & POST-HANDOVER FM',
    heroImage: '/images/editorial/entirefm-access-control-install-2000w.webp',
    heroImageAlt: 'EntireFM engineering team managing post-completion building handover and commissioning',
    heroHighlightedTitle: 'Seamless Handover & Mobilisation Care',
    heroFacts: [
      { label: 'Defects & Snagging Management', value: 'Rapid Resolution' },
      { label: 'O&M & Asset Onboarding', value: 'Complete Register' },
      { label: 'Builders Cleans & Sparkle', value: 'Handover Ready' },
    ],
    snapshotLead: 'Specialist facilities management, post-completion snagging remediation, asset tagging, and sparkle cleaning for principal contractors, fit-out specialists, and developers.',
    snapshotPriorities: [
      { title: 'Post-Practical Completion Care', subtitle: 'Smooth transition from main contractor to live building operations', iconName: 'operationalExcellence' },
      { title: 'Digital Asset Tagging & O&Ms', subtitle: 'Transforming paper O&M manuals into barcoded SFG20 CAFM asset registers', iconName: 'dataInsights' },
      { title: 'Builders Clean & Sparkle Finish', subtitle: 'High-standard architectural cleaning preparing spaces for client occupation', iconName: 'commercialCleaning' },
      { title: 'Defect Period Triage', subtitle: 'Managing warranty issues and snagging without disrupting incoming tenants', iconName: 'twentyFourSevenOps' },
    ],
    challengesHeadline: 'The transition from construction completion to live occupation is where most FM failures occur.',
    challengesSubline: 'Main contractors need a smooth handover that protects warranty liabilities and satisfies client handover criteria. Here is how EntireFM bridges the gap:',
    challenges: [
      {
        title: 'Unstructured O&M Manuals Leading to Delayed Maintenance',
        problem: 'Massive PDF manuals sit unread on flash drives while newly installed plant runs for months without first-year statutory servicing.',
        solution: 'EntireFM extracts equipment schedules from O&M documentation and builds a fully barcoded, manufacturer-aligned SFG20 PPM schedule in CAFM.',
        statutoryStandard: 'BSRIA Soft Landings Framework & O&M Handover Standards',
      },
      {
        title: 'Subcontractor Defect Blame-Games During Warranty Period',
        problem: 'Incoming tenants face plant issues, but trade contractors argue over whether the fault is installation defect or operational misuse.',
        solution: 'Our independent technical engineers investigate root causes, provide clear photographic evidence, and liaise with original installers.',
        statutoryStandard: 'Defects Liability Period (DLP) Technical Governance',
      },
      {
        title: 'Construction Dust in Brand-New HVAC Ductwork',
        problem: 'Fine drywall dust and plaster powder sucked into new air conditioning during commissioning ruins filters and triggers tenant complaints.',
        solution: 'Comprehensive pre-occupation ductwork cleaning, coil washing, and initial filter changeovers to ensure clean air on Day One.',
        statutoryStandard: 'BESA TR19 Internal Cleanliness of Ventilation Systems',
      },
      {
        title: 'Complex Commissioning Records & Missing Certs at Handover',
        problem: 'Missing initial EICR, commissioning certificates, or water chlorination sign-offs delay client sign-off and lease commencement.',
        solution: 'Comprehensive handover compliance audit ensuring every statutory certificate is verified and digitally filed before building opening.',
        statutoryStandard: 'Building Regulations Part P, L, and Approved Documents',
      },
    ],
    systemsHeadline: 'Construction Handover & Transition Scopes',
    systemsSubline: 'Specialist transition services for main contractors, developers, and incoming occupiers:',
    systemGroups: [
      {
        category: 'Asset Onboarding & O&M Digitalisation',
        headline: 'Turning construction data into an operational facilities model',
        items: [
          'Comprehensive on-site physical asset tagging with QR / barcodes',
          'O&M manual extraction and SFG20 maintenance schedule creation',
          'Warranty period tracking and subcontractor contact register',
          'Spare parts holding recommendations for critical building plant',
          'Digital CAFM platform setup for client facility teams',
        ],
      },
      {
        category: 'Builders Cleans & Sparkle Finishes',
        headline: 'Architectural cleaning for client handover inspections',
        items: [
          'Post-construction deep builders clean removing plaster, paint & dust',
          'Sparkle cleaning for practical completion and VIP client handovers',
          'Internal and external architectural glazing clean & mastic removal',
          'Hard floor sealing, carpet vacuuming & protective film removal',
          'Sanitaryware polishing, stainless steel cleaning & sticker removal',
        ],
      },
      {
        category: 'Pre-Occupation Building Engineering',
        headline: 'Verifying plant performance before tenant move-in',
        items: [
          'HVAC system pre-occupation filter changes & coil sanitisation',
          'Water system pre-commissioning flush, disinfection & sampling',
          'Emergency lighting full 3-hour discharge baseline audit',
          'Access control card programming and automated barrier testing',
          'AOV smoke control and fire alarm sounder volume verification',
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
      { figure: '100%', label: 'Day-One Compliance Ready', detail: 'All statutory certificates verified and filed before tenant occupation' },
      { figure: 'BSRIA', label: 'Soft Landings Alignment', detail: 'Smooth transition reducing post-handover tenant complaints' },
      { figure: 'Barcoded', label: 'Asset Tagging on Handover', detail: 'Every plant item barcoded and mapped to SFG20 maintenance tasks' },
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
